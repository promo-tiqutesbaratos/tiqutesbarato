// ../js/pagar.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  // Mapeo nombre → código IATA
  const airlineCodeMap = {
    'Avianca': 'AV',
    'LATAM': 'LA',
    'Wingo': 'P5',
    'JetSMART': 'JA'
  };

  function getAirlineCode(name) {
    return airlineCodeMap[name] || 'P5';
  }

  function getLogoUrl(name) {
    const code = getAirlineCode(name);
    return `../img/logos/${code}.png`;
  }

  // Básicos
  const tipoVuelo = params.get('tipoVuelo') || '';
  const origen = params.get('origen') || '';
  const destino = params.get('destino') || '';
  const fechaIdaIso = params.get('fechaIda') || '';
  const fechaVueltaIso = params.get('fechaVuelta') || '';
  const pasajeros = params.get('pasajeros') || '';

  // Ida
  const idaAirlineName = params.get('ida_airline') || '';
  const idaLogoUse = getLogoUrl(capitalize(idaAirlineName));
  const idaTime = params.get('ida_time') || '';
  const idaArrival = params.get('ida_arrival') || '';
  const idaTariff = params.get('ida_tariff') || '';
  const idaTypeRaw = params.get('ida_type') || '';

  // Regreso
  const vueltaAirlineName = params.get('vuelta_airline') || '';
  const vueltaLogoUse = getLogoUrl(capitalize(vueltaAirlineName));
  const vueltaTime = params.get('vuelta_time') || '';
  const vueltaArrival = params.get('vuelta_arrival') || '';
  const vueltaTariff = params.get('vuelta_tariff') || '';
  const vueltaTypeRaw = params.get('vuelta_type') || '';

  // Costos
  const precioPorPasajero = parseInt(params.get('precioPorPasajero') || '0', 10);
  const precioImpuestos = parseInt(params.get('precioImpuestos') || '0', 10);
  const precioTotal = parseInt(params.get('precioTotal') || '0', 10);
  const formatoNum = n => n.toLocaleString('es-CO');

  // Abreviaciones de meses
  const months = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];

  // Capitaliza primera letra
  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  // Fecha ISO → "17 jun. 2025"
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Escalas
  function stopsLabel(type) {
    return type.toLowerCase() === 'directo'
      ? 'Sin escalas'
      : type;
  }

  // Detalle de vuelo
  function renderResumenDetalle() {
    const c = document.getElementById('resumen-detalle');
    if (!c) return;

    const fechaIda = formatDate(fechaIdaIso);
    const fechaVuelta = formatDate(fechaVueltaIso);

    let html = `
      <div class="vuelo-resumen">
        <div class="vuelo-tipo">Vuelo de ida</div>
        <div class="vuelo-body">
          <img src="${idaLogoUse}" class="res-logo" alt="${idaAirlineName}">
          <div class="res-main">
            <div class="res-route">
              ${origen} › ${destino}
              <span class="res-date">${fechaIda}</span>
            </div>
            <div class="res-times">
              ${idaTime} – ${idaArrival} – ${stopsLabel(idaTypeRaw)}
            </div>
            <div class="res-tarifa">Tarifa: ${idaTariff}</div>
          </div>
        </div>
      </div>
      <div class="vuelo-resumen">
        <div class="vuelo-tipo">Vuelo de regreso</div>
        <div class="vuelo-body">
          <img src="${vueltaLogoUse}" class="res-logo" alt="${vueltaAirlineName}">
          <div class="res-main">
            <div class="res-route">
              ${destino} › ${origen}
              <span class="res-date">${fechaVuelta}</span>
            </div>
            <div class="res-times">
              ${vueltaTime} – ${vueltaArrival} – ${stopsLabel(vueltaTypeRaw)}
            </div>
            <div class="res-tarifa">Tarifa: ${vueltaTariff}</div>
          </div>
        </div>
      </div>
      <div class="resumen-costo">
        <div class="costo-linea">
          <span> </span>
          <span>$ ${formatoNum(precioPorPasajero)} COP</span>
        </div>
        <div class="costo-linea">
          <span>Impuestos</span>
          <span>$ ${formatoNum(precioImpuestos)} COP</span>
        </div>
        <div class="costo-linea total">
          <span>Total:</span>
          <span>$ ${formatoNum(precioTotal)} COP</span>
        </div>
      </div>
    `;

    c.innerHTML = html;
  }

  renderResumenDetalle();
});


// ../js/pagar.js
document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('couponContent');
  const couponInput = document.getElementById('couponInput');
  const applyBtn = document.getElementById('applyCouponBtn');
  if (!contentDiv || !couponInput || !applyBtn) return;

  // 1) Arranca deshabilitado
  applyBtn.disabled = true;

  // 2) Al escribir en el input, habilita / deshabilita el botón
  couponInput.addEventListener('input', () => {
    applyBtn.disabled = !couponInput.value.trim();
    // Borra mensaje previo si lo hubiera
    contentDiv.querySelectorAll('.coupon-error, .coupon-success')
      .forEach(el => el.remove());
  });

  // 3) Al click en “Aplicar”
  applyBtn.addEventListener('click', () => {
    // Deshabilita de nuevo y guarda valor
    applyBtn.disabled = true;
    const code = couponInput.value.trim();

    // Borra texto del input
    couponInput.value = '';

    // Borra mensajes anteriores
    contentDiv.querySelectorAll('.coupon-error, .coupon-success')
      .forEach(el => el.remove());

    // Decidir aleatoriamente: 1 de cada 10 → correcto
    const isValid = Math.random() < 0.1;

    // Crear mensaje
    const msg = document.createElement('div');
    if (isValid) {
      msg.className = 'coupon-success';
      msg.textContent = '¡Cupón válido! Descuento aplicado.';
    } else {
      msg.className = 'coupon-error';
      msg.textContent = 'El cupón no es válido. Intente con otro.';
    }
    contentDiv.appendChild(msg);
  });



  const optionsContainer = document.querySelector('.payment-options');
  const radios = optionsContainer.querySelectorAll('input[name="payment-method"]');
  const formsContainer = document.querySelector('.payment-forms');
  const forms = formsContainer.querySelectorAll('.form-block');

  // Muestra el form correcto
  function updateForms() {
    const checked = document.querySelector('input[name="payment-method"]:checked');
    if (!checked) return;
    const target = 'form-' + checked.id.replace('pm-', '');
    forms.forEach(f => {
      f.style.display = (f.id === target) ? 'block' : 'none';
    });
  }

  // Al elegir un método: ocultar lista y mostrar su form
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateForms();
      optionsContainer.style.display = 'none';
    });
  });

  // Botón “volver” en cada formulario
  forms.forEach(form => {
    const backBtn = form.querySelector('.back-arrow');
    backBtn.addEventListener('click', () => {
      form.style.display = 'none';
      optionsContainer.style.display = 'flex';   // ← aquí
      radios.forEach(r => r.checked = false);
    });
  });




  const cardInput = document.getElementById('card-number');

  cardInput.addEventListener('input', () => {
    let value = cardInput.value.replace(/\D/g, ''); // solo números
    value = value.substring(0, 16); // máx 16 dígitos
    // Agrupar en bloques de 4
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    cardInput.value = formatted;
  });


  function isValidCardNumber(number) {
    const digits = number.replace(/\s/g, '').split('').reverse().map(Number);
    const sum = digits.reduce((acc, digit, i) => {
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      return acc + digit;
    }, 0);
    return sum % 10 === 0;
  }

  // Ejemplo de uso:
  cardInput.addEventListener('blur', () => {
    const raw = cardInput.value.replace(/\s/g, '');
    if (raw.length === 16 && !isValidCardNumber(raw)) {
      alert('El número de tarjeta no es válido');
    }
  });

  const cardInputt = document.getElementById('card-number');
  const logo = document.getElementById('card-logo');

  function getCardType(number) {
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6/.test(number)) return 'discover';
    return '';
  }

  cardInputt.addEventListener('input', () => {
    let value = cardInputt.value.replace(/\D/g, '').substring(0, 16);
    cardInputt.value = value.replace(/(.{4})/g, '$1 ').trim();

    const type = getCardType(value);
    logo.className = 'icon'; // resetea
    if (type) logo.classList.add(type);
    else logo.className = 'icon'; // solo clase base, sin ícono

  });



  const monthSelect = document.getElementById('month-select');
  const maxMonth = 12;

  for (let y = 1; y <= maxMonth; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    monthSelect.appendChild(option);
  }

  const yearSelect = document.getElementById('year-select');
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 19;

  for (let y = currentYear; y <= maxYear; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  const cuotasSelect = document.getElementById('cuotas-select');
  const maxCuota = 36;

  for (let y = 1; y <= maxCuota; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    if (y === 36) option.selected = true; // selecciona 36 por defecto
    cuotasSelect.appendChild(option);
  }

  const input_cvv = document.querySelector('#cvv');
  input_cvv.addEventListener('input', () => {
    input_cvv.value = input_cvv.value.replace(/[^0-9]/g, '');
  });


  const input_cc = document.querySelector('#cc');
  input_cc.addEventListener('input', () => {
    input_cc.value = input_cc.value.replace(/[^0-9]/g, '');
  });

  const tel = document.querySelector('#tel');
  tel.addEventListener('input', () => {
    tel.value = tel.value.replace(/[^0-9]/g, '');
  });


  document.querySelector(".card-form-submit").addEventListener("click", (e) => {
  e.preventDefault(); // Evita el envío del formulario si hay errores

  // Campos a validar
  const cardNumber = document.getElementById("card-number");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const cardHolderName = document.querySelector("input[placeholder='Tal como aparece en la tarjeta']");
  const cvv = document.getElementById("cvv");
  const cc = document.getElementById("cc");
  const tel = document.getElementById("tel");

  let hasError = false;

  // Función para mostrar errores
  function showError(input, message) {
    input.classList.add("error");

    // Si el input está dentro de la expiry-group, usar el contenedor de error específico
    const errorContainer = input.closest(".expiry-group")?.querySelector(".error-container");

    if (errorContainer) {
      // Crear el mensaje de error si no existe
      let errorMessage = errorContainer.querySelector(".error-message");
      if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorContainer.appendChild(errorMessage);
      }

      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    } else {
      // Para otros campos, usar el contenedor padre del input
      let errorMessage = input.parentElement.querySelector(".error-message");
      if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        input.parentElement.appendChild(errorMessage);
      }

      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
  }

  // Función para limpiar errores
  function clearError(input) {
    input.classList.remove("error");

    // Si el input está dentro de la expiry-group, limpiar el contenedor de error específico
    const errorContainer = input.closest(".expiry-group")?.querySelector(".error-container");

    if (errorContainer) {
      const errorMessage = errorContainer.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
    } else {
      // Para otros campos, limpiar el contenedor padre del input
      const errorMessage = input.parentElement.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
    }
  }

  // Validar número de tarjeta
  if (!cardNumber.value.trim()) {
    showError(cardNumber, "Escribe el número de tarjeta");
    hasError = true;
  } else {
    clearError(cardNumber);
  }

  // Validar mes y año
  if (monthSelect.value === "Mes" || yearSelect.value === "Año") {
    showError(monthSelect, "Selecciona el mes y/o año de vencimiento de la tarjeta");
    showError(yearSelect, "Selecciona el mes y/o año de vencimiento de la tarjeta");
    hasError = true;
  } else {
    clearError(monthSelect);
    clearError(yearSelect);
  }

  // Validar nombre del titular
  if (!cardHolderName.value.trim()) {
    showError(cardHolderName, "Escribe el nombre del titular");
    hasError = true;
  } else {
    clearError(cardHolderName);
  }

  // Validar CVV
  if (!cvv.value.trim()) {
    showError(cvv, "Ingresa el código de seguridad");
    hasError = true;
  } else {
    clearError(cvv);
  }

  // Validar cédula de ciudadanía
  if (!cc.value.trim()) {
    showError(cc, "Ingresa un número de documento válido");
    hasError = true;
  } else {
    clearError(cc);
  }

  // Validar número de teléfono
  if (!tel.value.trim()) {
    showError(tel, "Ingresa un número de teléfono válido");
    hasError = true;
  } else {
    clearError(tel);
  }

  // Si no hay errores, continuar con el proceso de pago
  if (!hasError) {
    console.log("Todos los campos son válidos. Procesando el pago...");
    // Aquí puedes agregar la lógica para procesar el pago
  }
  
// Corrección: usar textContent en lugar de value
const locatorCode = document.getElementById("locator-code");

// Verificar que el elemento existe antes de intentar acceder a su contenido
if (locatorCode) {
  localStorage.setItem("locatorCode", locatorCode.textContent);
  console.log("Código guardado:", locatorCode.textContent);
} else {
  console.error("No se encontró el elemento locator-code");
}
});

});


