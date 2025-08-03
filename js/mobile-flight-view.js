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

    document.querySelectorAll(".flight-selector").forEach(selector => {
      // Remove previous mobile cards if any
      const prev = selector.querySelector(".mobile-flight-cards");
      if (prev) prev.remove();

      const table = selector.querySelector(".fs-table");
      if (!table) return;

      const mobileCards = document.createElement("div");
      mobileCards.className = "mobile-flight-cards";

      // Collect tariff names from the header columns 5 onward
      const tariffNames = Array.from(table.querySelectorAll("thead th"))
        .slice(5)
        .map(th => th.textContent.trim())
        .filter(Boolean);

      // Read flight type (soloIda / idaYvuelta) from URL params
      const globalParams = new URLSearchParams(window.location.search);
      const tipoVuelo = globalParams.get("tipoVuelo") || "soloIda";

      // Iterate each row to build a card
      table.querySelectorAll("tbody tr").forEach((row, rowIndex) => {
        const card = document.createElement("div");
        card.className = "flight-card";

        // Extract basic flight details
        const time     = row.querySelector(".time")?.textContent.trim()   || "";
        const arrival  = row.querySelector(".arrival")?.textContent.trim()|| "";
        const type     = row.querySelector(".type")?.textContent.trim()   || "Directo";
        const flightNo = row.querySelector(".flight-no")?.textContent.trim() || "";
        const origen   = row.querySelector(".origen")?.textContent.trim() || "";
        const destino  = row.querySelector(".destino")?.textContent.trim() || "";

        card.innerHTML = `
          <div class="flight-header">
            <div class="flight-time">${time} <span>✈</span> ${arrival}</div>
            <div class="flight-info">
              <div class="flight-type">${type}</div>
              <div class="flight-number">${flightNo}</div>
            </div>
            <div class="flight-route">${origen} - ${destino}</div>
          </div>
        `;

        const ul = document.createElement("ul");
        ul.className = "fare-options";

        // For each fare cell in the row
        row.querySelectorAll("td.fare").forEach((cell, cellIndex) => {
          const li = document.createElement("li");
          li.className = "fare-option";
          if (cell.classList.contains("basic")) li.classList.add("highlighted");

          if (cell.classList.contains("soldout")) {
            // Sold out fare
            li.innerHTML = `
              <div class="fare-name"><span class="fare-info-icon">i</span>${
                tariffNames[cellIndex]
              }</div>
              <div class="fare-price">Agotado</div>
            `;
          } else {
            // Available fare
            const price = cell.querySelector("label .price")?.textContent.trim() || "";
            const name  = tariffNames[cellIndex] || "Tarifa";
            const radioId = `mobile-fare-${rowIndex}-${cellIndex}`;

            li.innerHTML = `
              <div class="fare-name">
                <span class="fare-info-icon">i</span>${name}
              </div>
              <div class="fare-price">${price}</div>
              <label class="fare-radio-container">
                <input type="radio" id="${radioId}" name="flight-fare-global">
                <span class="fare-radio-custom"></span>
              </label>
            `;

            // When user selects this radio
            li.querySelector(`#${radioId}`).addEventListener("change", e => {
              // remove any existing select button
              document.querySelectorAll(".select-button-container").forEach(b => b.remove());

              // uncheck previous
              if (currentSelectedRadio && currentSelectedRadio !== e.target) {
                currentSelectedRadio.checked = false;
              }
              currentSelectedRadio = e.target;

              // build the Reserve / View Return button
              const btnCont = document.createElement("div");
              btnCont.className = "select-button-container";
              const btn = document.createElement("button");
              btn.className = "select-flight-button";
              btn.textContent = tipoVuelo === "soloIda"
                ? "Reservar"
                : "Seleccionar vuelo de ida";

              btn.addEventListener("click", () => {
                // start from current URL params
                const newParams = new URLSearchParams(window.location.search);

                // set each piece of data
                newParams.set("ida_tariff",  name);
                newParams.set("ida_flightNo", flightNo);
                newParams.set("ida_time",     time);
                newParams.set("ida_arrival",  arrival);
                newParams.set("ida_price",    price);

                // extract airline logo & alt from the desktop selector header
                const logoImg = selector.querySelector(".fs-header img");
                if (logoImg) {
                  newParams.set("ida_logoSrc", logoImg.src);
                  newParams.set("ida_airline", logoImg.alt || "");
                }

                // extract the full route label
                const routeEl = selector.querySelector(".fs-header .route");
                if (routeEl) {
                  newParams.set("ida_route", routeEl.textContent.trim());
                }

                // choose destination page
                const base = tipoVuelo === "soloIda"
                  ? "./reservar.html"
                  : "./resultados-regreso.html";

                // redirect with all params in the query string
                window.location.href = `${base}?${newParams.toString()}`;
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

  // initial transform
  doTransform();

  // re-transform on resize (with debounce)
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
