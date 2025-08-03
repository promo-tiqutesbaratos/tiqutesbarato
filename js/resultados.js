document.addEventListener("DOMContentLoaded", () => {
  
  // Datos de ciudades
  const cities = [
    { name: "Bogotá", code: "BOG", img: "BOG.jpg", country: "Colombia" },
    { name: "Medellín", code: "MEDE", img: "MEDE.jpg", country: "Colombia" },
    { name: "Cali", code: "CLO", img: "CLO.jpg", country: "Colombia" },
    { name: "Barranquilla", code: "BAQ", img: "BAQ.jpg", country: "Colombia" },
    { name: "Cartagena de Indias", code: "CTG", img: "CTG.jpg", country: "Colombia" },
    { name: "Bucaramanga", code: "BGA", img: "BGA.jpg", country: "Colombia" },
    { name: "Pereira", code: "PEI", img: "PEI.jpg", country: "Colombia" },
    { name: "Santa Marta", code: "SMR", img: "SMR.jpg", country: "Colombia" },
    { name: "San Andrés", code: "ADZ", img: "ADZ.jpg", country: "Colombia" },
    { name: "Leticia", code: "LET", img: "LET.jpg", country: "Colombia" },
    { name: "Cúcuta", code: "CUC", img: "CUC.jpg", country: "Colombia" },
    { name: "Manizales", code: "MZL", img: "MZL.jpg", country: "Colombia" },
    { name: "Neiva", code: "NVA", img: "NVA.jpg", country: "Colombia" },
    { name: "Armenia", code: "AXM", img: "AXM.jpg", country: "Colombia" },
    { name: "Montería", code: "MTR", img: "MTR.jpg", country: "Colombia" },
    { name: "Sincelejo", code: "CVE", img: "CVE.jpg", country: "Colombia" },
    { name: "Valledupar", code: "VUP", img: "VUP.jpg", country: "Colombia" },
    { name: "Tuluá", code: "TUL", img: "", country: "Colombia" },
    { name: "Villavicencio", code: "VVC", img: "VVC.jpg", country: "Colombia" },
    { name: "Popayán", code: "PPN", img: "PPN.jpg", country: "Colombia" }
  ];

  // Referencias a elementos del DOM con nuevos IDs
  const soloIdaRadio = document.getElementById("soloIda");
  const idaRegresoRadio = document.getElementById("idaRegreso");
  const fechasLabel = document.querySelector('label[for="input-fechas"]');
  const fechasInput = document.getElementById("input-fechas");
  const calendar = document.getElementById("calendar-fechas");
  const origenInput = document.getElementById("input-origen");
  const origenDropdown = document.getElementById("dropdown-origen");
  const destinoInput = document.getElementById("input-destino");
  const destinoDropdown = document.getElementById("dropdown-destino");
  const pasajerosInput = document.getElementById("input-pasajeros");
  const passengerDropdown = document.getElementById("dropdown-pasajeros");
  const adultCountEl = document.getElementById("adult-count");
  const childCountEl = document.getElementById("child-count");
  const childAgesContainer = document.getElementById("child-ages");
  const applyButton = document.getElementById("apply-passengers");
  const closeButton = document.getElementById("close-passenger-dropdown");
  const limitMessage = document.getElementById("passenger-limit-message");

  // Variables de estado
  let currentDate = new Date();
  let startDate = null;
  let endDate = null;
  let tempEndDate = null;
  let adultCount = 1;
  let childCount = 0;

  // ********** Etiqueta de fechas **********
  function updateFechasLabel() {
    if (soloIdaRadio.checked) {
      fechasLabel.textContent = "Fecha";
      fechasInput.placeholder = "06 Abr 2025";
    } else {
      fechasLabel.textContent = "Fechas";
      fechasInput.placeholder = "06 Abr 2025 - 11 Abr 2025";
    }
  }
  soloIdaRadio.addEventListener("change", updateFechasLabel);
  idaRegresoRadio.addEventListener("change", updateFechasLabel);
  updateFechasLabel();

  // ********** Calendario **********
  fechasInput.addEventListener("click", e => {
    e.stopPropagation();
    closeAllDropdowns();
    calendar.classList.toggle("hidden");
    renderCalendar(currentDate);
  });

  document.addEventListener("click", () => {
    calendar.classList.add("hidden");
  });

  calendar.addEventListener("click", e => {
    e.stopPropagation();
  });

  function renderCalendar(date) {
    calendar.innerHTML = "";
    const monthsToShow = 2;
    for (let i = 0; i < monthsToShow; i++) {
      const month = new Date(date.getFullYear(), date.getMonth() + i, 1);
      calendar.appendChild(createMonthView(month));
    }
  }

  function createMonthView(date) {
    const monthDiv = document.createElement("div");
    monthDiv.className = "month";

    monthDiv.innerHTML = `
        <div class="month-header">
          <button class="prev">&lt;</button>
          <span>${MONTHS_ABBR[date.getMonth()]} ${date.getFullYear()}</span>
          <button class="next">&gt;</button>
        </div>
        <div class="days"></div>
      `;

    const daysDiv = monthDiv.querySelector(".days");
    const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    daysOfWeek.forEach(d => {
      const dEl = document.createElement("div");
      dEl.textContent = d;
      daysDiv.appendChild(dEl);
    });




    // Alinear lunes en primer columna
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const offset = (firstDay + 6) % 7;
    for (let i = 0; i < offset; i++) {
      daysDiv.appendChild(document.createElement("div"));
    }

    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.textContent = i;
      const thisDate = new Date(date.getFullYear(), date.getMonth(), i);
      dayDiv.dataset.fullDate = thisDate.toISOString();

      // Bloquear días pasados
      if (thisDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        dayDiv.classList.add("disabled");
        dayDiv.style.pointerEvents = "none";
        dayDiv.style.opacity = "0.5";
      }


      // Resaltado
      if (startDate && isSameDay(thisDate, startDate)) {
        dayDiv.classList.add("selected", "start");
      }
      if (endDate && isSameDay(thisDate, endDate)) {
        dayDiv.classList.add("selected", "end");
      }
      if (startDate && endDate && thisDate > startDate && thisDate < endDate) {
        dayDiv.classList.add("in-range");
      }

      // Selección y hover
      dayDiv.addEventListener("click", () => selectDate(thisDate));
      dayDiv.addEventListener("mouseover", () => {
        if (startDate && !endDate && idaRegresoRadio.checked) {
          tempEndDate = thisDate;
          highlightTempRange();
          showTooltip(dayDiv, calculateDays(startDate, tempEndDate));
        }
      });
      dayDiv.addEventListener("mouseout", () => {
        if (tempEndDate) {
          tempEndDate = null;
          highlightTempRange();
          hideTooltip();
        }
      });

      daysDiv.appendChild(dayDiv);
    }



    return monthDiv;
  }

  function highlightTempRange() {
    document.querySelectorAll(".day").forEach(dayEl => {
      const d = new Date(dayEl.dataset.fullDate);
      if (startDate && tempEndDate && d >= startDate && d <= tempEndDate) {
        dayEl.classList.add("temp-range");
        if (isSameDay(d, tempEndDate)) dayEl.classList.add("hover-end");
      } else {
        dayEl.classList.remove("temp-range", "hover-end");
      }
    });
  }

  function selectDate(date) {
    if (soloIdaRadio.checked) {
      startDate = date; endDate = null; tempEndDate = null;
      fechasInput.value = formatDate(startDate);
      calendar.classList.add("hidden");
      hideTooltip();
    } else {
      if (!startDate || (startDate && endDate)) {
        startDate = date; endDate = null; tempEndDate = null;
      } else if (date < startDate) {
        startDate = date; endDate = null; tempEndDate = null;
      } else {
        endDate = date;
        fechasInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        calendar.classList.add("hidden");
        hideTooltip();
      }
    }
    renderCalendar(currentDate);
  }

// Abreviaturas que quieras (sin puntos ni "de")
// Abreviaturas para tu formato, SIN puntos ni "de"
const MONTHS_ABBR = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];


function formatDate(d) {
  const dd   = String(d.getDate()).padStart(2, "0");
  const mon  = MONTHS_ABBR[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${dd} ${mon} ${yyyy}`;
}


  function calculateDays(a, b) {
    return Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24));
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function showTooltip(el, days) {
    let tip = document.querySelector(".tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tooltip";
      document.body.appendChild(tip);
    }
    tip.textContent = `${days} días`;
    const r = el.getBoundingClientRect();
    tip.style.left = `${r.left + r.width / 2 + window.scrollX}px`;
    tip.style.top = `${r.top - 30 + window.scrollY}px`;
    tip.style.display = "block";
  }

  function hideTooltip() {
    const tip = document.querySelector(".tooltip");
    if (tip) tip.style.display = "none";
  }

  // Navegación de meses
  calendar.addEventListener("click", e => {
    if (e.target.classList.contains("prev")) {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
    }
    if (e.target.classList.contains("next")) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
    }
  });

  // ********** Pasajeros **********
  limitMessage.style.display = "none";

  pasajerosInput.addEventListener("click", e => {
    e.stopPropagation();
    closeAllDropdowns();
    passengerDropdown.classList.toggle("hidden");
  });

  function updatePassengerInput() {
    // 1) Actualiza los spans del dropdown:
    adultCountEl.textContent = adultCount;
    childCountEl.textContent = childCount;

    // 2) Luego actualiza el input visible:
    const total = adultCount + childCount;
    const childTxt = childCount > 0 ? `, ${childCount} niño(s)` : "";
    pasajerosInput.value = `${adultCount} adulto(s)${childTxt}`;

    // 3) Y el mensaje de límite si hace falta:
    limitMessage.style.display = total >= 9 ? "flex" : "none";
  }


  function updateChildAges() {
    childAgesContainer.innerHTML = "";
    for (let i = 1; i <= childCount; i++) {
      const row = document.createElement("div");
      row.className = "child-age-row";
      row.innerHTML = `
          <span>Edad menor ${i}</span>
          <select>
            <option value="">Edad</option>
            <option value="0">0 a 23 meses</option>
            ${Array.from({ length: 10 }, (_, j) => `<option value="${j + 2}">${j + 2} años</option>`).join("")}
          </select>
        `;
      childAgesContainer.appendChild(row);
    }
  }

  passengerDropdown.addEventListener("click", e => {
    e.stopPropagation();
    if (e.target.classList.contains("increase")) {
      if (adultCount + childCount < 9) {
        if (e.target.dataset.type === "adult") adultCount++;
        else { childCount++; updateChildAges(); }
      }
    }
    if (e.target.classList.contains("decrease")) {
      if (e.target.dataset.type === "adult" && adultCount > 1) adultCount--;
      if (e.target.dataset.type === "child" && childCount > 0) { childCount--; updateChildAges(); }
    }
    updatePassengerInput();
  });

  applyButton.addEventListener("click", () => passengerDropdown.classList.add("hidden"));
  closeButton.addEventListener("click", () => passengerDropdown.classList.add("hidden"));

  // ********** Autocomplete ciudades **********
  function renderDropdown(dropdown, list, showImages = true, exclude = null) {
    dropdown.innerHTML = showImages ? "<h4>Orígenes más buscados</h4>" : "";
    const filtered = list
      .filter(c => c.name !== exclude)
      .slice(0, showImages ? 5 : list.length);
    filtered.forEach(city => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.innerHTML = showImages
        ? `<img src="../img/${city.img || "default.jpg"}" alt="${city.name}" />
             <div class="city-info"><span>${city.name} </span><small>${city.country}</small></div>
             <div class="city-code">${city.code}</div>`
        : `<div class="city-info"><span>${city.name} </span><small>${city.country}</small></div>
             <div class="city-code">${city.code}</div>`;
      item.addEventListener("click", () => {
        const isOri = dropdown === origenDropdown;
        const input = isOri ? origenInput : destinoInput;
        const otherInput = isOri ? destinoInput : origenInput;
        const otherDD = isOri ? destinoDropdown : origenDropdown;
        input.value = city.name;
        dropdown.classList.add("hidden");
        if (otherInput.value === city.name) otherInput.value = "";
        renderDropdown(otherDD, cities, true, city.name);
        if (!otherDD.classList.contains("hidden")) otherDD.classList.remove("hidden");
      });
      dropdown.appendChild(item);
    });
  }

  // Iniciar dropdowns
  renderDropdown(origenDropdown, cities);
  renderDropdown(destinoDropdown, cities);

  origenInput.addEventListener("input", () => {
    const term = origenInput.value.toLowerCase();
    const filt = cities.filter(c =>
      (c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      && c.name !== destinoInput.value
    );
    renderDropdown(origenDropdown, filt, false);
    origenDropdown.classList.remove("hidden");
  });

  destinoInput.addEventListener("input", () => {
    const term = destinoInput.value.toLowerCase();
    const filt = cities.filter(c =>
      (c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      && c.name !== origenInput.value
    );
    renderDropdown(destinoDropdown, filt, false);
    destinoDropdown.classList.remove("hidden");
  });

  origenInput.addEventListener("click", (e) => {
    e.stopPropagation();
    if (matchMedia("(max-width: 799px)").matches) {
      const term = origenInput.value?.trim();
      if (term && term.length > 0) {
        closeAllDropdowns();
        const searchTerm = origenInput.value.toLowerCase();
        const filtered = cities.filter(city =>
          (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
          city.name !== destinoInput.value
        );
        renderDropdown(origenDropdown, filtered, false);
        origenDropdown.classList.remove("hidden");
      }
    } else {
      closeAllDropdowns();
      renderDropdown(origenDropdown, cities, true, destinoInput.value);
      origenDropdown.classList.toggle("hidden");
    }
  });

  destinoInput.addEventListener("click", (e) => {
    e.stopPropagation();
    if (matchMedia("(max-width: 799px)").matches) {
      const term = origenInput.value?.trim();
      if (term && term.length > 0) {
        closeAllDropdowns();
        const searchTerm = destinoInput.value.toLowerCase();
        const filtered = cities.filter(city =>
          (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
          city.name !== origenInput.value
        );
        renderDropdown(destinoDropdown, filtered, false);
        destinoDropdown.classList.remove("hidden");
      }
    } else {
      closeAllDropdowns();
      renderDropdown(destinoDropdown, cities, true, origenInput.value);
      destinoDropdown.classList.toggle("hidden");
    }
  });

  // Cuando el usuario escribe, filtra y muestra el dropdown (sin imágenes en móvil)
  origenInput.addEventListener("input", () => {
    const term = origenInput.value.toLowerCase();
    const filt = cities.filter(c =>
      (c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      && c.name !== destinoInput.value
    );
    renderDropdown(origenDropdown, filt, matchMedia("(max-width: 799px)").matches ? false : false);
    origenDropdown.classList.remove("hidden");
  });

  destinoInput.addEventListener("input", () => {
    const term = destinoInput.value.toLowerCase();
    const filt = cities.filter(c =>
      (c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      && c.name !== origenInput.value
    );
    renderDropdown(destinoDropdown, filt, matchMedia("(max-width: 799px)").matches ? false : false);
    destinoDropdown.classList.remove("hidden");
  });

  // Cerrar todo al hacer clic fuera
  document.addEventListener("click", e => {
    if (!e.target.closest("#dropdown-pasajeros")
      && !e.target.closest("#input-pasajeros")
      && !e.target.closest("#dropdown-origen")
      && !e.target.closest("#input-origen")
      && !e.target.closest("#dropdown-destino")
      && !e.target.closest("#input-destino")
      && !e.target.closest("#calendar-fechas")
      && !e.target.closest("#input-fechas")
    ) {
      closeAllDropdowns();
    }
  });

  // Función auxiliar para cerrar todos los dropdowns/calendario
  function closeAllDropdowns() {
    passengerDropdown.classList.add("hidden");
    origenDropdown.classList.add("hidden");
    destinoDropdown.classList.add("hidden");
    calendar.classList.add("hidden");
    hideTooltip();
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnEconomicos');
  btn.addEventListener('click', () => {
    // Leemos y volcamos aria-pressed
    const isPressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!isPressed));

    // Cambiamos la clase del icono
    const icon = btn.querySelector('i');
    if (!isPressed) {
      icon.classList.replace('far', 'fas');
      icon.classList.replace('fa-square', 'fa-check-square');
    } else {
      icon.classList.replace('fas', 'far');
      icon.classList.replace('fa-check-square', 'fa-square');
    }
  });


});



const openBtn = document.getElementById("openFiltersBtn");
const dialog = document.getElementById("filtersDialog");
const closeBtn = dialog.querySelector(".modal-close");
const applyBtn = dialog.querySelector(".btn--primary");  // ← aquí lo agregas

openBtn.addEventListener("click", () => dialog.showModal());
closeBtn.addEventListener("click", () => dialog.close());

// Toggle accordion
dialog.querySelectorAll(".filter-toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });
});

// Cuenta filtros
function countFilters() {
  // 1. Paradas: calculamos si no es la primera opción
  const radios = [...dialog.querySelectorAll('input[name="parada"]')];
  const countParada = radios[0].checked ? 0 : 1;
  // 2. Aerolíneas
  const countAero = [...dialog.querySelectorAll('.filter-content input[type="checkbox"]')]
    .filter(chk => chk.checked).length;
  return countParada + countAero;
}

// Limpia todos los filtros
function clearFilters() {
  // Reset radios
  const radios = dialog.querySelectorAll('input[name="parada"]');
  radios.forEach((r, i) => r.checked = i === 0);
  // Reset checkboxes
  dialog.querySelectorAll('.filter-content input[type="checkbox"]')
    .forEach(chk => chk.checked = false);
  // Vuelve el botón al estado original
  resetFilterButton();
}

// Restaura el botón
function resetFilterButton() {
  openBtn.classList.remove("filter-active");
  openBtn.innerHTML = `Filtros <i class="fas fa-caret-down"></i>`;
}

// Aplica filtros al click en “Aplicar”
applyBtn.addEventListener("click", e => {
  e.preventDefault();
  const total = countFilters();
  if (total > 0) {
    openBtn.classList.add("filter-active");
    openBtn.innerHTML = `
      <span class="filter-count">${total}</span>
      Filtros
      <i class="fas fa-times clear-filters"></i>
    `;
    // “X” limpia filtros
    openBtn.querySelector(".clear-filters")
      .addEventListener("click", e => {
        e.stopPropagation();
        clearFilters();
      });
  } else {
    resetFilterButton();
  }
  dialog.close();
});

// Exclusividad para “Todas las aerolíneas”
// Tras definir applyBtn, etc...

// 1) Coge todos los checkboxes de aerolíneas
const aeroCheckboxes = Array.from(dialog.querySelectorAll('input[name="aerolinea"]'));
const allAero = aeroCheckboxes.find(chk => chk.value === 'all');
const otherAero = aeroCheckboxes.filter(chk => chk.value !== 'all');

// 2) Si marco “Todas las aerolíneas”, desmarco las otras
allAero.addEventListener('change', () => {
  if (allAero.checked) {
    otherAero.forEach(chk => chk.checked = false);
  }
});

// 3) Si marco cualquiera de las otras, desmarco “Todas las aerolíneas”
otherAero.forEach(chk => {
  chk.addEventListener('change', () => {
    if (chk.checked) {
      allAero.checked = false;
    }
  });
});

// Función para mostrar errores
function showError(input, message) {
  let errorMsg = input.parentElement.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("div");
    errorMsg.className = "error-message";
    input.parentElement.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
  input.classList.add("error");
}

// Función para limpiar errores
function clearError(input) {
  const errorMsg = input.parentElement.querySelector(".error-message");
  if (errorMsg) errorMsg.style.display = "none";
  input.classList.remove("error");
}

// Si tu botón está dentro de un form, previene el submit:
const form = document.querySelector("form"); // Ajusta el selector si tu form tiene un id o clase

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Siempre previene el submit por JS
  });
}

// Validar campos al hacer clic en el botón "Buscar"
document.querySelector(".buscar-2").addEventListener("click", (e) => {
  e.preventDefault();

  let hasError = false;

  // Validar Origen
  if (!origenInput.value.trim()) {
    showError(origenInput, "Selecciona tu aeropuerto de origen");
    hasError = true;
  } else {
    clearError(origenInput);
  }

  // Validar Destino
  if (!destinoInput.value.trim()) {
    showError(destinoInput, "Selecciona tu destino");
    hasError = true;
  } else {
    clearError(destinoInput);
  }

  // Validar Fechas
  if (!fechasInput.value.trim()) {
    showError(fechasInput, "Selecciona una fecha");
    hasError = true;
  } else {
    clearError(fechasInput);
  }

  // Validar Pasajeros (por defecto: 1 adulto)
  if (!pasajerosInput.value.trim()) {
    pasajerosInput.value = "1 adulto";
    // Si tienes variables de estado, también actualízalas:
    adultCount = 1;
    childCount = 0;
    updatePassengerInput && updatePassengerInput();
  }

  // Si hay errores, no continuar ni redireccionar
  if (hasError) {
    return false;
  }

  // --- AQUÍ construyes tus params para la búsqueda/redirección ---
  // Ejemplo:
  const params = new URLSearchParams();
  params.set("origen", origenInput.value.trim());
  params.set("destino", destinoInput.value.trim());
  params.set("fechas", fechasInput.value.trim());
  params.set("pasajeros", pasajerosInput.value.trim()); // <-- aquí ya va "1 adulto" si estaba vacío

  // ...continúa con tu lógica de búsqueda/redirección...
});

// Eliminar errores al escribir o interactuar con los campos
["input", "change"].forEach((event) => {
  origenInput.addEventListener(event, () => {
    if (origenInput.value.trim()) clearError(origenInput);
  });
  destinoInput.addEventListener(event, () => {
    if (destinoInput.value.trim()) clearError(destinoInput);
  });
  fechasInput.addEventListener(event, () => {
    if (fechasInput.value.trim()) clearError(fechasInput);
  });
});

// Eliminar error al seleccionar una ciudad en el dropdown de origen
origenDropdown.addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    clearError(origenInput);
  }
});

// Eliminar error al seleccionar una ciudad en el dropdown de destino
destinoDropdown.addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    clearError(destinoInput);
  }
});

// Eliminar error al seleccionar una fecha en el calendario
calendar.addEventListener("click", (e) => {
  if (e.target.classList.contains("day") && !e.target.classList.contains("disabled")) {
    clearError(fechasInput);
  }
});
