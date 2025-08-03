// mobile-flight-regreso-view.js

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.setProperty("--select-button-color", "#0095ff");

  let currentSelectedRadio = null;
  let resizeTimer;
  let isMobileViewTransformed = false;
  let lastWindowWidth = window.innerWidth;

  function showLoader() {
    document.documentElement.classList.add("mobile-loading");
    if (!document.getElementById("mobile-loader")) {
      const loader = document.createElement("div");
      loader.id = "mobile-loader";
      loader.innerHTML = `
        <div class="mobile-loader-backdrop">
          <div class="spinner"></div>
        </div>
      `;
      document.body.append(loader);
    }
  }

  function hideLoader() {
    const l = document.getElementById("mobile-loader");
    if (l) l.remove();
    document.documentElement.classList.remove("mobile-loading");
  }

  function transformToMobileView() {
    if (window.innerWidth > 900 || isMobileViewTransformed) return;
    isMobileViewTransformed = true;

    // 1) Leemos TODOS los params actuales (ida + búsqueda original)
    const globalParams = new URLSearchParams(window.location.search);

    // 2) Guardamos los campos de ida para re-aplicarlos más tarde
    const idaKeys = [
      "ida_tariff","ida_flightNo","ida_time","ida_arrival",
      "ida_price","ida_type","ida_logoSrc","ida_airline","ida_route",
      "fechaIda","pasajeros","origen","origenCode","destino","destinoCode","tipoVuelo"
    ];
    const savedIda = {};
    idaKeys.forEach(k => {
      const v = globalParams.get(k);
      if (v !== null) savedIda[k] = v;
    });

    // 3) Sacamos datos de vuelta para pintar cabecera
    const fechaVuelta   = globalParams.get("fechaVuelta")    || "";
    const rutaVuelta    = globalParams.get("vuelta_route")   || "";
    const logoSrcVuelta = globalParams.get("vuelta_logoSrc") || "";
    const airlineVuelta = globalParams.get("vuelta_airline") || "";

    document.querySelectorAll(".flight-selector").forEach(selector => {
      // eliminar previas
      const prev = selector.querySelector(".mobile-flight-cards");
      if (prev) prev.remove();

      const table = selector.querySelector(".fs-table");
      if (!table) return;

      const mobileCards = document.createElement("div");
      mobileCards.className = "mobile-flight-cards";

      // nombres de tarifa (columnas 5+)
      const tariffNames = Array.from(table.querySelectorAll("thead th"))
        .slice(5)
        .map(th => th.textContent.trim())
        .filter(Boolean);

      table.querySelectorAll("tbody tr").forEach((row,rowIndex) => {
        // datos básicos de este vuelo de regreso
        const time     = row.querySelector(".time")?.textContent.trim()    || "";
        const arrival  = row.querySelector(".arrival")?.textContent.trim() || "";
        const type     = row.querySelector(".type")?.textContent.trim()    || "Directo";
        const flightNo = row.querySelector(".flight-no")?.textContent.trim()|| "";

        // tarjeta
        const card = document.createElement("div");
        card.className = "flight-card";
        card.innerHTML = `
          <div class="flight-date">${fechaVuelta}</div>
          <div class="flight-header">
            <div class="flight-airline">
              <img src="${logoSrcVuelta}" alt="${airlineVuelta}" class="airline-logo">
              <span class="airline-name">${airlineVuelta}</span>
            </div>
            <div class="flight-route">${rutaVuelta}</div>
            <div class="flight-time">${time} ✈ ${arrival}</div>
            <div class="flight-info">
              <div class="flight-type">${type}</div>
              <div class="flight-number">${flightNo}</div>
            </div>
          </div>
        `;

        const ul = document.createElement("ul");
        ul.className = "fare-options";

        // cada tarifa
        row.querySelectorAll("td.fare").forEach((cell,cellIndex) => {
          const li = document.createElement("li");
          li.className = "fare-option";
          if (cell.classList.contains("basic")) li.classList.add("highlighted");

          if (cell.classList.contains("soldout")) {
            li.innerHTML = `
              <div class="fare-name">
                <span class="fare-info-icon">i</span>${tariffNames[cellIndex]}
              </div>
              <div class="fare-price">Agotado</div>
            `;
          } else {
            const price   = cell.querySelector("label .price")?.textContent.trim() || "";
            const tariff  = tariffNames[cellIndex] || "Tarifa";
            const radioId = `mobile-fare-${rowIndex}-${cellIndex}`;

            li.innerHTML = `
              <div class="fare-name">
                <span class="fare-info-icon">i</span>${tariff}
              </div>
              <div class="fare-price">${price}</div>
              <label class="fare-radio-container">
                <input type="radio" id="${radioId}" name="flight-fare-global">
                <span class="fare-radio-custom"></span>
              </label>
            `;

            // al cambiar selección…
            li.querySelector(`#${radioId}`).addEventListener("change", e => {
              // limpiar botones antiguos
              document.querySelectorAll(".select-button-container").forEach(b => b.remove());
              if (currentSelectedRadio && currentSelectedRadio !== e.target) {
                currentSelectedRadio.checked = false;
              }
              currentSelectedRadio = e.target;

              // crear botón "Reservar"
              const btnCont = document.createElement("div");
              btnCont.className = "select-button-container";
              const btn = document.createElement("button");
              btn.className = "select-flight-button";
              btn.textContent = "Seleccionar vuelo de regreso";

              btn.addEventListener("click", () => {
                // 1) Clonar todos los params actuales (incluye los de ida)
                const newParams = new URLSearchParams(globalParams.toString());

                // 2) Re-aplicar los de ida (por si acaso)
                Object.entries(savedIda).forEach(([k, v]) => newParams.set(k, v));

                // 3) Añadir los de vuelta con prefijo vuelta_
                newParams.set("vuelta_tariff",   tariff);
                newParams.set("vuelta_flightNo", flightNo);
                newParams.set("vuelta_time",     time);
                newParams.set("vuelta_arrival",  arrival);
                newParams.set("vuelta_price",    price);
                newParams.set("vuelta_type",     type);

                // Añadir logo y aerolínea de vuelta
                const logoImg = selector.querySelector(".fs-header img");
                if (logoImg) {
                  newParams.set("vuelta_logoSrc",  logoImg.src);
                  newParams.set("vuelta_airline",  logoImg.alt || "");
                }

                // Añadir ruta de vuelta correctamente
                let routeText = "";

                // 1. Intenta obtener de .fs-header .route
                const routeEl = selector.querySelector(".fs-header .route");
                if (routeEl && routeEl.textContent.trim()) {
                  routeText = routeEl.textContent.trim();
                }
                // 2. Si no, intenta de la cabecera de la tarjeta
                else if (card.querySelector(".flight-route") && card.querySelector(".flight-route").textContent.trim()) {
                  routeText = card.querySelector(".flight-route").textContent.trim();
                }
                // 3. Si no, usa rutaVuelta de los params
                else if (rutaVuelta) {
                  routeText = rutaVuelta;
                }
                // 4. Si sigue vacío, constrúyelo con origen/destino de los params
                if (!routeText) {
                  const origen = globalParams.get("destino") || "";
                  const origenCode = globalParams.get("destinoCode") || "";
                  const destino = globalParams.get("origen") || "";
                  const destinoCode = globalParams.get("origenCode") || "";
                  if (origen && destino && origenCode && destinoCode) {
                    routeText = `${origen} (${origenCode}) – ${destino} (${destinoCode})`;
                  }
                }

                newParams.set("vuelta_route", routeText);

                // 4) Redirigir a reservar con todos los params
                window.location.href = `./reservar.html?${newParams.toString()}`;
              });

              btnCont.append(btn);
              li.append(btnCont);
              document.body.classList.add("has-selection");
            });
          }

          ul.append(li);
        });

        card.append(ul);
        mobileCards.append(card);
      });

      selector.append(mobileCards);
    });
  }

  function doTransform() {
    showLoader();
    requestAnimationFrame(() => {
      transformToMobileView();
      requestAnimationFrame(hideLoader);
    });
  }

  // primera carga
  doTransform();

  // re-transformar en resize (debounce)
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth !== lastWindowWidth) {
        lastWindowWidth = window.innerWidth;
        isMobileViewTransformed = false;
        doTransform();
      }
    }, 300);
  });
});
