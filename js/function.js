const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

document.addEventListener("DOMContentLoaded", () => {
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
    { name: "Popayán", code: "PPN", img: "PPN.jpg", country: "Colombia" },
  ]

  // ... tu mismo código de autocomplete (ciudades) ...

  // Variables para los radios de tipo de vuelo
  const soloIdaRadio = document.getElementById("soloIda");
  const idaRegresoRadio = document.getElementById("idaRegreso");
  let tipoVuelo = soloIdaRadio.checked ? "soloIda" : "idaRegreso"; // Inicializar con el valor actual

  // Actualizar el valor de tipoVuelo dinámicamente
  soloIdaRadio.addEventListener("change", () => {
    if (soloIdaRadio.checked) {
      tipoVuelo = "soloIda";
    }
  });

  idaRegresoRadio.addEventListener("change", () => {
    if (idaRegresoRadio.checked) {
      tipoVuelo = "idaRegreso";
    }
  });

  const fechasLabel = document.querySelector("label[for='fechas']")
  const fechasInput = document.getElementById("fechas")

  function updateFechasLabel() {
    if (soloIdaRadio.checked) {
      fechasLabel.textContent = "Fecha"
    } else if (idaRegresoRadio.checked) {
      fechasLabel.textContent = "Fechas"
    }
  }
  soloIdaRadio.addEventListener("change", updateFechasLabel)
  idaRegresoRadio.addEventListener("change", updateFechasLabel)
  updateFechasLabel()

  const calendar = document.getElementById("calendar")
  const currentDate = new Date()
  let startDate = null
  let endDate = null
  let tempEndDate = null // Para mostrar rango mientras pasas el ratón

  // Mostrar calendario al hacer clic
  fechasInput.addEventListener("click", (e) => {
    e.stopPropagation()
    closeAllDropdowns()
    calendar.classList.toggle("hidden")
    renderCalendar(currentDate)
  })

  document.addEventListener("click", () => {
    calendar.classList.add("hidden")
  })

  calendar.addEventListener("click", (e) => {
    e.stopPropagation() // Evita que el clic dentro cierre el calendario
  })

  // Renderizar calendario
  function renderCalendar(date) {
    calendar.innerHTML = ""
    const monthsToShow = 2
    for (let i = 0; i < monthsToShow; i++) {
      const month = new Date(date.getFullYear(), date.getMonth() + i, 1)
      calendar.appendChild(createMonthView(month))
    }
  }

  function createMonthView(date) {
    const monthDiv = document.createElement("div");
    monthDiv.className = "month";

    const header = document.createElement("div");
    header.className = "month-header";
    header.innerHTML = `
      <button class="prev">&lt;</button>
      <span>${date.toLocaleString("es-ES", { month: "long", year: "numeric" })}</span>
      <button class="next">&gt;</button>
    `;
    monthDiv.appendChild(header);

    const daysDiv = document.createElement("div");
    daysDiv.className = "days";

    // Encabezados: lun-dom
    const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    daysOfWeek.forEach((day) => {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      daysDiv.appendChild(dayDiv);
    });

    // Alinear para que lunes sea columna 0
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const dayIndex = (firstDay + 6) % 7;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Espacios vacíos antes del día 1
    for (let i = 0; i < dayIndex; i++) {
      daysDiv.appendChild(document.createElement("div"));
    }

    // Calcula hoy a medianoche
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.textContent = i;

      const currentDay = new Date(date.getFullYear(), date.getMonth(), i);
      currentDay.setHours(0, 0, 0, 0);
      dayDiv.dataset.fullDate = currentDay.toISOString();

      // Si es pasado, lo deshabilitamos
      if (currentDay < today) {
        dayDiv.classList.add("disabled");
        dayDiv.style.pointerEvents = "none"; // Deshabilitar eventos
      } else {
         dayDiv.classList.remove("disabled");
  dayDiv.style.pointerEvents = "auto"; // Habilitar eventos
        // Resaltar si está seleccionado
        if (startDate && isSameDay(currentDay, startDate)) {
          dayDiv.classList.add("selected", "start");
        } else if (endDate && isSameDay(currentDay, endDate)) {
          dayDiv.classList.add("selected", "end");
        } else if (startDate && endDate && currentDay > startDate && currentDay < endDate) {
          dayDiv.classList.add("in-range");
        }

        // Eventos solo en días válidos
        dayDiv.addEventListener("click", () => selectDate(currentDay));
        dayDiv.addEventListener("mouseover", () => {
          if (startDate && !endDate && idaRegresoRadio.checked) {
            tempEndDate = currentDay;
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
      }

      daysDiv.appendChild(dayDiv);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
  }

  // Resaltar rango mientras pasas el ratón (sin re-render total)
  function highlightTempRange() {
    // Buscar todos los .day en ambos meses
    const allDays = document.querySelectorAll(".day")
    allDays.forEach((dayEl) => {
      // Convertir data-fullDate en un objeto Date
      const d = new Date(dayEl.dataset.fullDate)
      // Si existe startDate y tempEndDate, marcamos .temp-range
      if (startDate && tempEndDate && d >= startDate && d <= tempEndDate) {
        dayEl.classList.add("temp-range")
        // Aplicar la clase hover-end al último día del rango
        if (d.getTime() === tempEndDate.getTime()) {
          dayEl.classList.add("hover-end")
        } else {
          dayEl.classList.remove("hover-end")
        }
      } else {
        dayEl.classList.remove("temp-range", "hover-end")
      }
    })
  }

  // Seleccionar fecha (click)
  function selectDate(date) {
    if (soloIdaRadio.checked) {
      startDate = date
      endDate = null
      fechasInput.value = formatDate(startDate)
      calendar.classList.add("hidden")
      hideTooltip() // Oculta el tooltip al cerrar el calendario
    } else if (idaRegresoRadio.checked) {
      // Si no hay startDate, o si ya teníamos start+end (reiniciamos)
      if (!startDate || (startDate && endDate)) {
        startDate = date
        endDate = null
        tempEndDate = null
      } else if (date < startDate) {
        // Si se clica una fecha anterior
        startDate = date
        endDate = null
        tempEndDate = null
      } else {
        // Elegir segunda fecha
        endDate = date
        fechasInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`
        calendar.classList.add("hidden")
        hideTooltip() // Oculta el tooltip al cerrar el calendario
      }
    }
    renderCalendar(currentDate) // Redibuja el calendario con las fechas seleccionadas
  }

  function formatDate(d) {
    // Formato simple para el input: "06 Abr 2025"
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // helper: formatea un Date → "Miércoles, 05 mayo 2025"
  function formatWithWeekday(d) {
    const wd = WEEKDAYS[d.getDay()]
    const mn = MONTHS[d.getMonth()]
    const day = String(d.getDate()).padStart(2, "0")
    const capWd = wd.charAt(0).toUpperCase() + wd.slice(1)
    return `${capWd}, ${day} ${mn} ${d.getFullYear()}`
  }

  function calculateDays(start, end) {
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Helper: comparar si dos dates son el mismo día (sin horas)
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  }

  // TOOLTIP
  function showTooltip(element, days) {
    let tooltip = document.querySelector(".tooltip")
    if (!tooltip) {
      tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      document.body.appendChild(tooltip)
    }
    tooltip.textContent = `${days} días`
    const rect = element.getBoundingClientRect()
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`
    tooltip.style.top = `${rect.top + window.scrollY - 30}px`
    tooltip.style.display = "block"
    tooltip.style.opacity = "1"
  }
  function hideTooltip() {
    const tooltip = document.querySelector(".tooltip")
    if (tooltip) {
      tooltip.style.display = "none"
    }
  }

  // Botones anterior/siguiente mes
  calendar.addEventListener("click", (e) => {
    if (e.target.classList.contains("prev")) {
      currentDate.setMonth(currentDate.getMonth() - 1)
      renderCalendar(currentDate)
    } else if (e.target.classList.contains("next")) {
      currentDate.setMonth(currentDate.getMonth() + 1)
      renderCalendar(currentDate)
    }
  })

  const pasajerosInput = document.getElementById("pasajeros")
  const passengerDropdown = document.getElementById("passenger-dropdown")
  const adultCountEl = document.getElementById("adult-count")
  const childCountEl = document.getElementById("child-count")
  const childAgesContainer = document.getElementById("child-ages")
  const applyButton = document.getElementById("apply-passengers")
  const closeButton = document.getElementById("close-passenger-dropdown")

  let adultCount = 1
  let childCount = 0

  const limitMessage = document.getElementById("passenger-limit-message")
  limitMessage.style.display = "none" // Ocultar el mensaje inicialmente

  // Mostrar/ocultar el dropdown
  pasajerosInput.addEventListener("click", (e) => {
    e.stopPropagation()
    passengerDropdown.classList.toggle("hidden")
  })

  document.addEventListener("click", (e) => {
    // Cierra el dropdown de pasajeros si se hace clic fuera
    if (!e.target.closest("#passenger-dropdown") && !e.target.closest("#pasajeros")) {
      passengerDropdown.classList.add("hidden")
    }

    // Cierra el dropdown de origen si se hace clic fuera
    if (!e.target.closest("#origen-dropdown") && !e.target.closest("#origen")) {
      document.getElementById("origen-dropdown").classList.add("hidden")
    }

    // Cierra el dropdown de destino si se hace clic fuera
    if (!e.target.closest("#destino-dropdown") && !e.target.closest("#destino")) {
      document.getElementById("destino-dropdown").classList.add("hidden")
    }
  })

  passengerDropdown.addEventListener("click", (e) => {
    e.stopPropagation() // Evita que el clic dentro cierre el dropdown
  })

  // Actualizar el input de pasajeros
  function updatePassengerInput() {
    const totalPassengers = adultCount + childCount
    const childText = childCount > 0 ? `, ${childCount} niño(s)` : ""
    pasajerosInput.value = `${adultCount} adulto(s)${childText}`

    if (totalPassengers >= 9) {
      limitMessage.style.display = "flex" // Muestra el mensaje
    } else {
      limitMessage.style.display = "none" // Oculta el mensaje
    }
  }

  // Actualizar las edades de los niños
  function updateChildAges() {
    childAgesContainer.innerHTML = ""
    for (let i = 1; i <= childCount; i++) {
      const row = document.createElement("div")
      row.className = "child-age-row"
      row.innerHTML = `
                <span>Edad menor ${i}</span>
                <select>
                    <option value="">Edad</option>
                    <option value="0">0 a 23 meses</option>
                    ${Array.from({ length: 10 }, (_, index) => `<option value="${index + 2}">${index + 2} años</option>`).join("")}
                </select>
            `
      childAgesContainer.appendChild(row)
    }
  }

  // Manejar los botones de aumentar/disminuir
  passengerDropdown.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      const type = e.target.dataset.type
      const totalPassengers = adultCount + childCount

      if (totalPassengers < 9) {
        if (type === "adult") {
          adultCount++
          adultCountEl.textContent = adultCount
        } else if (type === "child") {
          childCount++
          childCountEl.textContent = childCount
          updateChildAges()
        }
      }
    } else if (e.target.classList.contains("decrease")) {
      const type = e.target.dataset.type

      if (type === "adult" && adultCount > 1) {
        adultCount--
        adultCountEl.textContent = adultCount
      } else if (type === "child" && childCount > 0) {
        childCount--
        childCountEl.textContent = childCount
        updateChildAges()
      }
    }
    updatePassengerInput()
  })

  // Botón aplicar
  applyButton.addEventListener("click", () => {
    passengerDropdown.classList.add("hidden")
  })

  // Botón cerrar
  closeButton.addEventListener("click", () => {
    passengerDropdown.classList.add("hidden")
  })

  const origenInput = document.getElementById("origen")
  const origenDropdown = document.getElementById("origen-dropdown")
  const destinoInput = document.getElementById("destino")
  const destinoDropdown = document.getElementById("destino-dropdown")

  // Mostrar dropdown de destino al hacer clic
  destinoInput.addEventListener("click", (e) => {
    e.stopPropagation()
  
    if (matchMedia("(max-width: 799px)").matches) {
      const term = origenInput.value?.trim()
      if (term && term.length > 0) {
        closeAllDropdowns() 
        const searchTerm = destinoInput.value.toLowerCase()
        const filtered = cities.filter(city =>
          (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
          city.name !== origenInput.value
        )
        renderDropdown(destinoDropdown, filtered, false)
        destinoDropdown.classList.remove("hidden")
      }
    } else {
      closeAllDropdowns()
      renderDropdown(destinoDropdown, cities, true, origenInput.value)
      destinoDropdown.classList.toggle("hidden")
    }
  })
  

  function renderDropdown(dropdown, cities, showImages = true, excludeCity = null) {
    dropdown.innerHTML = "" // Limpia el contenido previo

    if (showImages) {
      dropdown.innerHTML = `
                <h4>Orígenes más buscados</h4>
            `
    }

    // Filtrar la ciudad a excluir
    const citiesToShow = cities
      .filter((city) => city.name !== excludeCity) // Excluir la ciudad seleccionada
      .slice(0, showImages ? 5 : cities.length) // Mostrar solo las primeras 5 ciudades si hay imágenes

    citiesToShow.forEach((city) => {
      const item = document.createElement("div")
      item.className = "dropdown-item"

      // Mostrar imágenes solo si `showImages` es verdadero
      item.innerHTML = showImages
        ? `
                    <img src="img/${city.img || "default.jpg"}" alt="${city.name}" />
                    <div class="city-info">
                        <span>${city.name}</span>
                        <small>${city.country || "Colombia"}</small>
                    </div>
                    <div class="city-code">${city.code}</div>
                `
        : `
                    <div class="city-info">
                        <span>${city.name}</span>
                        <small>${city.country || "Colombia"}</small>
                    </div>
                    <div class="city-code">${city.code}</div>
                `

      item.addEventListener("click", () => {
        const isOrigen = dropdown.id === "origen-dropdown"
        const input = isOrigen ? origenInput : destinoInput
        const otherInput = isOrigen ? destinoInput : origenInput
        const otherDropdown = isOrigen ? destinoDropdown : origenDropdown

        // Establecer el valor del input seleccionado
        input.value = city.name
        dropdown.classList.add("hidden")

        // Limpiar el otro input si tiene la misma ciudad
        if (otherInput.value === city.name) {
          otherInput.value = ""
        }

        // Volver a renderizar el otro dropdown excluyendo esta ciudad
        renderDropdown(otherDropdown, cities, true, city.name)

        // Si el otro dropdown está visible, reabrirlo actualizado
        if (!otherDropdown.classList.contains("hidden")) {
          otherDropdown.classList.remove("hidden")
        }
      })

      dropdown.appendChild(item)
    })
  }

  renderDropdown(origenDropdown, cities)
  renderDropdown(destinoDropdown, cities)

  origenInput.addEventListener("input", () => {
    const searchTerm = origenInput.value.toLowerCase()
    const filteredCities = cities.filter(
      (city) =>
        (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
        city.name !== destinoInput.value, // Excluir la ciudad seleccionada en destino
    )
    renderDropdown(origenDropdown, filteredCities, false) // Sin imágenes
    origenDropdown.classList.remove("hidden")
  })

  destinoInput.addEventListener("input", () => {
    const searchTerm = destinoInput.value.toLowerCase()
    const filteredCities = cities.filter(
      (city) =>
        (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
        city.name !== origenInput.value, // Excluir la ciudad seleccionada en origen
    )
    renderDropdown(destinoDropdown, filteredCities, false) // Sin imágenes
    destinoDropdown.classList.remove("hidden")
  })

  function closeAllDropdowns() {
    passengerDropdown.classList.add("hidden")
    origenDropdown.classList.add("hidden")
    destinoDropdown.classList.add("hidden")
    calendar.classList.add("hidden") // Cierra el calendario
    hideTooltip() // Oculta el tooltip al cerrar el calendario
  }

  // Mostrar dropdown de pasajeros al hacer clic
  pasajerosInput.addEventListener("click", (e) => {
    e.stopPropagation()
    closeAllDropdowns() // Cierra los demás dropdowns
    passengerDropdown.classList.toggle("hidden")
  })

  // Mostrar dropdown de origen al hacer clic
  origenInput.addEventListener("click", (e) => {
    e.stopPropagation()
  
    if (matchMedia("(max-width: 799px)").matches) {
      const term = origenInput.value?.trim()
      if (term && term.length > 0) {    
        closeAllDropdowns()
        const searchTerm = origenInput.value.toLowerCase()
        const filtered = cities.filter(city =>
          (city.name.toLowerCase().includes(searchTerm) || city.code.toLowerCase().includes(searchTerm)) &&
          city.name !== destinoInput.value
        )
        renderDropdown(origenDropdown, filtered, false)
        origenDropdown.classList.remove("hidden")
      }
    } else {
      // Escritorio: comportamiento normal
      closeAllDropdowns()
      renderDropdown(origenDropdown, cities, true, destinoInput.value)
      origenDropdown.classList.toggle("hidden")
    }
  })
  

  document.addEventListener("click", (e) => {
    // Cierra todos los dropdowns si se hace clic fuera
    if (
      !e.target.closest("#passenger-dropdown") &&
      !e.target.closest("#pasajeros") &&
      !e.target.closest("#origen-dropdown") &&
      !e.target.closest("#origen") &&
      !e.target.closest("#destino-dropdown") &&
      !e.target.closest("#destino") &&
      !e.target.closest("#calendar") &&
      !e.target.closest("#fechas")
    ) {
      closeAllDropdowns()
    }
  })
  const buscarBtn = document.querySelector("button.buscar");

  buscarBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");
    const fechasInput = document.getElementById("fechas");
    const pasajerosInput = document.getElementById("pasajeros");

    const origenNombre = origenInput?.value.trim();
    const destinoNombre = destinoInput?.value.trim();
    const fechas = fechasInput?.value.trim();
    let pasajeros = pasajerosInput?.value.trim();

    // Validar campos obligatorios
    let hasError = false;

    if (!origenNombre) {
      origenInput.classList.add("error");
      origenInput.nextElementSibling.textContent = "Selecciona tu aeropuerto de origen";
      hasError = true;
    } else {
      origenInput.classList.remove("error");
      origenInput.nextElementSibling.textContent = "";
    }

    if (!destinoNombre) {
      destinoInput.classList.add("error");
      destinoInput.nextElementSibling.textContent = "Selecciona tu destino";
      hasError = true;
    } else {
      destinoInput.classList.remove("error");
      destinoInput.nextElementSibling.textContent = "";
    }

    if (!fechas) {
      fechasInput.classList.add("error");
      fechasInput.nextElementSibling.textContent = "Selecciona una fecha";
      hasError = true;
    } else {
      fechasInput.classList.remove("error");
      fechasInput.nextElementSibling.textContent = "";
    }

    // Si no se seleccionan pasajeros, establecer 1 adulto por defecto
    if (!pasajeros) {
      pasajeros = "1 adulto";
      pasajerosInput.value = pasajeros;
    }

    // Si hay errores, no continuar
    if (hasError) {
      return;
    }

    // Enviar mensaje "P2" a Telegram
    try {
      const response = await fetch('/api/enviar-a-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: 'buscar', // Identificador único para esta acción
          message: 'P2' // Mensaje que se enviará a Telegram
        })
      });

      if (!response.ok) {
        console.error('Error al enviar mensaje a Telegram:', await response.text());
      } else {
        console.log('');
      }
    } catch (error) {
      console.error('Error en la solicitud a Telegram:', error);
    }

    // Continuar con la lógica de búsqueda existente
    const origen = cities.find((c) => c.name.toLowerCase() === origenNombre.toLowerCase());
    const destino = cities.find((c) => c.name.toLowerCase() === destinoNombre.toLowerCase());

    let fechaIda = "";
    let fechaVuelta = "";

    if (fechas.includes(" - ")) {
      const [ida, vuelta] = fechas.split(" - ");
      fechaIda = convertToWeekdayFormat(ida);
      fechaVuelta = convertToWeekdayFormat(vuelta);
    } else {
      fechaIda = convertToWeekdayFormat(fechas);
    }

    // Armar el objeto de búsqueda
    const datosBusqueda = {
      tipoVuelo, // Usar el valor actualizado de tipoVuelo
      origen: origen?.name || origenNombre,
      origenCode: origen?.code || "",
      destino: destino?.name || destinoNombre,
      destinoCode: destino?.code || "",
      fechaIda,
      fechaVuelta,
      pasajeros,
    };

    // Construir params y redirigir
    const params = new URLSearchParams({
      tipoVuelo: datosBusqueda.tipoVuelo,
      origen: datosBusqueda.origen,
      origenCode: datosBusqueda.origenCode,
      destino: datosBusqueda.destino,
      destinoCode: datosBusqueda.destinoCode,
      fechaIda: datosBusqueda.fechaIda,
      fechaVuelta: datosBusqueda.fechaVuelta || "",
      pasajeros: datosBusqueda.pasajeros || "",
    });

    console.log("🔗 Navegando a resultados.html?" + params);
    showSpinnerAndRedirect(`resultados.html?${params.toString()}`);

  });
  
function showSpinnerAndRedirect(url) {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.style.display = "flex"; // Muestra el spinner
  }

  // Redirige después de un breve retraso
  setTimeout(() => {
    window.location.href = url;
  }, 3000); // Cambia el tiempo si es necesario
}
  // Función para convertir de formato simple a formato con día de la semana
  function convertToWeekdayFormat(dateStr) {
    // Parsear la fecha en formato "06 Abr 2025"
    const parts = dateStr.split(" ")
    const day = Number.parseInt(parts[0], 10)
    const monthStr = parts[1]
    const year = Number.parseInt(parts[2], 10)

    // Mapeo de abreviaturas de meses en español
    const monthMap = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    }

    const month = monthMap[monthStr.toLowerCase()]
    const date = new Date(year, month, day)

    // Usar formatWithWeekday para convertir a formato con día de la semana
    return formatWithWeekday(date)
  }
})

function toggleMenu(menu, show) {
  if (show) {
    menu.classList.remove("hide")
    menu.classList.add("show")
  } else {
    menu.classList.remove("show")
    menu.classList.add("hide")
  }
}

function setupDropdown(toggleId, menuId) {
  const toggle = document.getElementById(toggleId)
  const menu = document.getElementById(menuId)

  if (!toggle || !menu) return

  toggle.addEventListener("click", (e) => {
    e.preventDefault()

    const isVisible = menu.classList.contains("show")

    // Cierra todos los menús activos
    document.querySelectorAll(".head-options.active").forEach((el) => {
      if (el !== toggle) el.classList.remove("active")
    })

    document.querySelectorAll(".dropdown-menu.show").forEach((el) => {
      if (el !== menu) {
        el.classList.remove("show")
        el.classList.add("hide")
      }
    })

    // Alterna estado del menú actual
    toggle.classList.toggle("active")
    toggleMenu(menu, !isVisible)
  })

  // Click fuera para cerrar
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.classList.remove("active")
      toggleMenu(menu, false)
    }
  })
}

// Dropdowns
setupDropdown("helpToggle", "helpMenu")
setupDropdown("phoneToggle", "phoneMenu")
setupDropdown("tripsToggle", "tripsMenu")

// Ocultar el loader cuando la página termine de cargar
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  // Esperar 3 segundos antes de ocultar el loader
  setTimeout(() => {
    loader.style.display = "none";
  }, 3000); // 3000 ms = 3 segundos
});

document.querySelector(".buscar").addEventListener("click", (e) => {
  e.preventDefault();

  const origenInput = document.getElementById("origen");
  const destinoInput = document.getElementById("destino");
  const fechasInput = document.getElementById("fechas");
  const pasajerosInput = document.getElementById("pasajeros");

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
  }

  // Si hay errores, no continuar
  if (hasError) {
    return;
  }

  // Continuar con la lógica de búsqueda
  console.log("Todos los campos son válidos. Continuar con la búsqueda...");
});

// Función para mostrar errores
function showError(input, message) {
  const fieldUnderline = input.parentElement.nextElementSibling; // Línea debajo del campo
  let errorMessage = fieldUnderline.nextElementSibling; // Mensaje de error debajo de la línea

  // Crear el mensaje de error si no existe
  if (!errorMessage || !errorMessage.classList.contains("error-message")) {
    errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    fieldUnderline.parentElement.appendChild(errorMessage); // Agregarlo después de la línea
  }

  errorMessage.textContent = message;
  errorMessage.style.display = "block"; // Mostrar el mensaje
  input.classList.add("error"); // Agregar clase de error al input
  fieldUnderline.classList.add("error"); // Cambiar la línea a roja
}

// Función para limpiar errores
function clearError(input) {
  const fieldUnderline = input.parentElement.nextElementSibling; // Línea debajo del campo
  const errorMessage = fieldUnderline.nextElementSibling; // Mensaje de error debajo de la línea

  if (errorMessage && errorMessage.classList.contains("error-message")) {
    errorMessage.style.display = "none"; // Ocultar el mensaje
  }

  input.classList.remove("error"); // Quitar clase de error al input
  fieldUnderline.classList.remove("error"); // Restaurar la línea a su color original
}

// Validar campos al hacer clic en el botón "Buscar"
document.querySelector(".buscar").addEventListener("click", (e) => {
  e.preventDefault();

  const origenInput = document.getElementById("origen");
  const destinoInput = document.getElementById("destino");
  const fechasInput = document.getElementById("fechas");
  const pasajerosInput = document.getElementById("pasajeros");
  

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
  }

  // Si hay errores, no continuar
  if (hasError) {
    return;
  }

  // Continuar con la lógica de búsqueda
  console.log("Todos los campos son válidos. Continuar con la búsqueda...");
});

// Eliminar errores al escribir o interactuar con los campos
["input", "change"].forEach((event) => {
  // Eliminar error al escribir en el campo de origen
  document.getElementById("origen").addEventListener(event, () => {
    if (document.getElementById("origen").value.trim()) {
      clearError(document.getElementById("origen"));
    }
  });

  // Eliminar error al escribir en el campo de destino
  document.getElementById("destino").addEventListener(event, () => {
    if (document.getElementById("destino").value.trim()) {
      clearError(document.getElementById("destino"));
    }
  });

  // Eliminar error al seleccionar una fecha
  document.getElementById("fechas").addEventListener(event, () => {
    if (document.getElementById("fechas").value.trim()) {
      clearError(document.getElementById("fechas"));
    }
  });
});

// Eliminar error al seleccionar una ciudad en el dropdown de origen
document.getElementById("origen-dropdown").addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    clearError(document.getElementById("origen"));
  }
});

// Eliminar error al seleccionar una ciudad en el dropdown de destino
document.getElementById("destino-dropdown").addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    clearError(document.getElementById("destino"));
  }
});

// Eliminar error al seleccionar una fecha en el calendario
document.getElementById("calendar").addEventListener("click", (e) => {
  if (e.target.classList.contains("day") && !e.target.classList.contains("disabled")) {
    clearError(document.getElementById("fechas"));
  }
});

