// Sobrescribimos el método global para que, en cuanto intlTelInput se inicialice,
// siempre inyecte el buscador al abrir el dropdown.
// 1) Redefine intlTelInput _antes_ de cargar / inicializar nada
(function () {
  const originalInit = window.intlTelInput;
  window.intlTelInput = function (input, opts) {
    const iti = originalInit(input, opts);
    const origShow = iti.showDropdown;
    iti.showDropdown = function () {
      origShow.apply(this, arguments);
      setTimeout(() => {
        const list = document.querySelector('.iti__country-list');
        if (!list || list.querySelector('.country-search')) return;
        const search = document.createElement('input');
        search.className = 'country-search';
        search.placeholder = 'Search';
        list.prepend(search);
        console.log('injected search')
        search.addEventListener('input', e => {
          const term = e.target.value.toLowerCase();
          list.querySelectorAll('.iti__country').forEach(li => {
            const name = li.querySelector('.iti__country-name').innerText.toLowerCase();
            const dial = li.querySelector('.iti__dial-code').innerText.toLowerCase();
            li.style.display = name.includes(term) || dial.includes(term) ? '' : 'none';
          });
        });
      }, 1);
    };
    return iti;
  };
})();


document.addEventListener('DOMContentLoaded', () => {

  const tiInput = document.querySelector('#telefono');
  window.intlTelInput(tiInput, {
    initialCountry: 'co',
    separateDialCode: false,
    dropdownContainer: document.body,
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.21/js/utils.js'
  });

  function injectSearch() {
    const list = document.querySelector('.iti__country-list');
    if (!list || list.querySelector('.country-search')) return;

    const search = document.createElement('input');
    search.className = 'country-search';
    search.placeholder = 'Search';
    list.prepend(search);

    // Evita que clicar o presionar teclas en el input cierre el dropdown
    ['mousedown', 'click', 'keydown'].forEach(ev =>
      search.addEventListener(ev, e => e.stopPropagation())
    );

    search.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      list.querySelectorAll('.iti__country').forEach(li => {
        const name = li.querySelector('.iti__country-name').innerText.toLowerCase();
        const dial = li.querySelector('.iti__dial-code').innerText.toLowerCase();
        li.style.display = name.includes(term) || dial.includes(term) ? '' : 'none';
      });
    });
    console.log('🔍 buscador inyectado y protegido de cierres');
  }


  // Capturamos el clic sobre la bandera para saber cuándo abren el dropdown
  document.body.addEventListener('click', e => {
    if (e.target.closest('.iti__flag-container')) {
      setTimeout(injectSearch, 50);
    }
  });



  // Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);

  // Formatear precio para mostrar
  function formatPrice(price) {
    if (!price) return '$ 0 COP';
    // Si ya tiene formato, devolverlo tal cual
    if (typeof price === 'string' && price.includes('$')) return price;
    // Si no, formatearlo
    return price;
  }

  // Formatear fecha para mostrar
  function formatDate(isoDate) {
    if (!isoDate) return '';

    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const weekdays = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    try {
      const date = new Date(isoDate);
      const weekday = weekdays[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${weekday}, ${day} ${month} ${year}`;
    } catch (e) {
      return isoDate; // Si hay error, devolver la fecha original
    }
  }

  // Función para obtener el código IATA de la aerolínea según su nombre
  function getAirlineCode(logoSrc) {
    if (!logoSrc) return 'P5'; // Valor por defecto para Wingo

    // Extraer el nombre de la aerolínea del path del logo
    const logoPath = logoSrc.split('/').pop(); // Obtener el último segmento de la ruta
    const airlineName = logoPath.split('.')[0]; // Quitar la extensión

    // Mapear nombres de archivo a códigos IATA
    const airlineCodeMap = {
      'Avianca': 'AV',
      'LATAM': 'LA',
      'Wingo': 'P5',
      'JetSMART': 'JA'
    };

    return airlineCodeMap[airlineName] || 'P5'; // Devolver P5 (Wingo) como valor predeterminado
  }

  function getAirlineLogoUrl(code) {
    return `../img/logos/${code}.png`;
  }


  // Función para extraer el nombre de la aerolínea del parámetro logoSrc
  function getAirlineName(logoSrc) {
    if (!logoSrc) return 'Wingo'; // Valor por defecto

    // Extraer el nombre de la aerolínea del path del logo
    const logoPath = logoSrc.split('/').pop(); // Obtener el último segmento de la ruta
    const airlineName = logoPath.split('.')[0]; // Quitar la extensión

    // Mapear nombres de archivo a nombres de aerolíneas
    const airlineMap = {
      'Avianca': 'Avianca',
      'LATAM': 'LATAM',
      'Wingo': 'Wingo',
      'JetSMART': 'JetSMART'
    };

    return airlineMap[airlineName] || airlineName;
  }

  // Obtener datos de vuelo de ida
  const idaRoute = params.get('ida_route') || '';
  const idaTime = params.get('ida_time') || '';
  const idaArrival = params.get('ida_arrival') || '';
  const idaTariff = params.get('ida_tariff') || 'Standard';
  const idaType = params.get('ida_type') || 'Directo';
  const idaPrice = formatPrice(params.get('ida_price') || '');
  const fechaIda = formatDate(params.get('fechaIda') || '');
  const idaLogoSrc = params.get('ida_logoSrc') || '';
  const idaAirlineName = getAirlineName(idaLogoSrc);
  const idaAirlineCode = getAirlineCode(idaLogoSrc);

  // Obtener datos de vuelo de regreso
  const vueltaRoute = params.get('vuelta_route') || '';
  const vueltaTime = params.get('vuelta_time') || '';
  const vueltaArrival = params.get('vuelta_arrival') || '';
  const vueltaTariff = params.get('vuelta_tariff') || 'Standard';
  const vueltaType = params.get('vuelta_type') || 'Directo';
  const vueltaPrice = formatPrice(params.get('vuelta_price') || '');
  const fechaVuelta = formatDate(params.get('fechaVuelta') || '');
  const vueltaLogoSrc = params.get('vuelta_logoSrc') || '';
  const vueltaAirlineName = getAirlineName(vueltaLogoSrc);
  const vueltaAirlineCode = getAirlineCode(vueltaLogoSrc);

  // Obtener información de pasajeros
  // Obtener información de pasajeros
  const pasajeros = params.get('pasajeros') || '';

  // Inicializamos a 0 para que la regex decida realmente cuántos son
  let adultos = 0;
  let ninos   = 0;

  // intenta capturar "1 adulto" o "2 adultos"
  const adultosMatch = pasajeros.match(/(\d+)\s*adultos?/i);
  if (adultosMatch) {
    adultos = parseInt(adultosMatch[1], 10);
  }

  // intenta capturar "1 niño" o "2 niños"
  const ninosMatch = pasajeros.match(/(\d+)\s*niñ/i);
  if (ninosMatch) {
    ninos = parseInt(ninosMatch[1], 10);
  }

  // si no viene ninguno, asumimos 1 adulto
  if (adultos === 0 && ninos === 0) {
    adultos = 1;
  }



  // Extraer origen y destino de las rutas
  function extractRoute(route) {
    if (!route) return { origen: '', destino: '' };

    const routeParts = route.split('–');
    if (routeParts.length >= 2) {
      return {
        origen: routeParts[0].trim(),
        destino: routeParts[1].trim()
      };
    }

    return { origen: '', destino: '' }; // Retornar valores vacíos si el formato no es válido
  }

  // Extraer datos de ida
  const idaRouteData = idaRoute
    ? extractRoute(idaRoute) // Si ida_route está presente, usarlo
    : { 
        origen: params.get('origen') || '', // Usar origen de la URL
        destino: params.get('destino') || '' // Usar destino de la URL
      };

  const origenIda = idaRouteData.origen;
  const destinoIda = idaRouteData.destino;

  // Extraer datos de vuelta
  const vueltaRouteData = extractRoute(vueltaRoute);
  const origenVuelta = vueltaRouteData.origen;
  const destinoVuelta = vueltaRouteData.destino;

  // Renderizar vuelo de ida
  const idaInfoContainer = document.getElementById('ida-info');
  idaInfoContainer.innerHTML = `
        <div class="vuelo-header">
        <div class="vuelo-tipo">
          <img
            src="../assets/FamiconsAirplane.svg"
            alt="icon-plane"
            class="icon-plane"
          />
          <span>Ida</span>
        </div>

         <div class="aerolinea">
            <img
              src="${getAirlineLogoUrl(idaAirlineCode)}"
              alt="${idaAirlineName}"
              class="aerolinea-logo"
            />
            <span class="aerolinea-name">${idaAirlineName}</span>
        </div>

        </div>
        <div class="vuelo-detalle">
          <p>${fechaIda}</p>
          <p>Vuelo: 7298 | <a href="#" class="sin-paradas">${idaType}</a></p>
          <p>Sale: ${origenIda} - ${idaTime}</p>
          <p>Llega: ${destinoIda} - ${idaArrival}</p>
          <p>Tarifa: <a href="#" class="tarifa">${idaTariff}</a></p>
        </div>
      `;

  // Renderizar vuelo de regreso si existe
  const vueltaInfoContainer = document.getElementById('vuelta-info');
  if (vueltaRoute) {
    let origenVuelta = '';
    let destinoVuelta = '';

    const routeParts = vueltaRoute.split('–');
    if (routeParts.length >= 2) {
      origenVuelta = routeParts[0].trim();
      destinoVuelta = routeParts[1].trim();
    }

    vueltaInfoContainer.innerHTML = `
          <div class="vuelo-header">
            <div class="vuelo-tipo">
                <img
                  src="../assets/FamiconsAirplane.svg"
                  alt="icon-plane"
                  class="icon-plane-R"
                  />
              <span>Regreso</span>
            </div>
              <div class="aerolinea">
                <img
                  src="${getAirlineLogoUrl(vueltaAirlineCode)}"
                  alt="${vueltaAirlineName}"
                  class="aerolinea-logo"
                />
                <span class="aerolinea-name">${vueltaAirlineName}</span>
              </div>

          </div>
          <div class="vuelo-detalle">
            <p>${fechaVuelta}</p>
            <p>Vuelo: 7271 | <a href="#" class="sin-paradas">${vueltaType}</a></p>
            <p>Sale: ${origenVuelta} - ${vueltaTime}</p>
            <p>Llega: ${destinoVuelta} - ${vueltaArrival}</p>
            <p>Tarifa: <a href="#" class="tarifa">${vueltaTariff}</a></p>
          </div>
        `;
  } else {
    // Si no hay vuelo de regreso, ocultar el contenedor
    vueltaInfoContainer.style.display = 'none';
  }

  // Calcular precios
  // Extraer valores numéricos de los precios
  function extractNumericPrice(priceStr) {
    if (!priceStr) return 0;
    const matches = priceStr.match(/[\d.]+/g);
    if (matches && matches.length > 0) {
      return parseFloat(matches.join('').replace(/\./g, ''));
    }
    return 0;
  }

  const idaPriceValue = extractNumericPrice(idaPrice);
  const vueltaPriceValue = extractNumericPrice(vueltaPrice);

  // Calcular subtotal (precio base de los vuelos)
  const subtotal = (idaPriceValue + vueltaPriceValue) * (adultos + ninos);

  // Calcular impuestos (aproximadamente 40% del subtotal)
  const impuestos = Math.round(subtotal * 0.25);

  // Calcular total
  const total = subtotal + impuestos;

  // Formatear valores para mostrar
  const subtotalFormatted = subtotal.toLocaleString('es-CO');
  const impuestosFormatted = impuestos.toLocaleString('es-CO');
  const totalFormatted = total.toLocaleString('es-CO');

  // Renderizar resumen de costos
  const resumenCostosContainer = document.getElementById('resumen-costos');
  resumenCostosContainer.innerHTML = `
        <div class="costo-linea">
          <span>${adultos} Adulto(s)${ninos > 0 ? ` y ${ninos} Niño(s)` : ''}</span>
          <span>$ ${subtotalFormatted} COP</span>
        </div>
        <div class="costo-linea">
          <span>Impuestos, tasas y cargos <span class="info-icon">i</span></span>
          <span>$ ${impuestosFormatted} COP</span>
        </div>
        <div class="total-linea">
          <span>Total</span>
          <span>$ ${totalFormatted} COP</span>
        </div>
      `;

  // Generar formularios de pasajeros
  const pasajerosContainer = document.getElementById('pasajeros-container');

  // Función para generar opciones de días
  function generarDiasOptions() {
    let options = '<option value="">--</option>';
    for (let i = 1; i <= 31; i++) {
      options += `<option>${i}</option>`;
    }
    return options;
  }

  // Función para generar opciones de meses
  function generarMesesOptions() {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let options = '<option value="">--</option>';
    meses.forEach(mes => {
      options += `<option>${mes}</option>`;
    });
    return options;
  }

  // Función para generar opciones de años
  function generarAnosOptions() {
    const currentYear = new Date().getFullYear();
    let options = '<option value="">--</option>';

    for (let i = 0; i < 100; i++) {
      const year = currentYear - i;
      options += `<option>${year}</option>`;
    }
    return options;
  }

  // Generar formularios para adultos
  function crearCamposAdulto(i) {
    // tu markup de campos tal cual lo tenías dentro de adulto-form
    return `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Primer nombre</label>
        <input type="text" class="form-control" required  maxlength="20"
         inputmode="text"
         pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,20}"
         oninput="this.value = this.value .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,'')
    .slice(0,20)">
        <span class="error-icon">❗</span>
        <div class="invalid-feedback">El campo es requerido</div>

      </div>
      <div class="form-group">
        <label class="form-label">Primer apellido</label>
        <input type="text" class="form-control" required   maxlength="20"
         inputmode="text"
         pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,20}"
         oninput="this.value = this.value .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,'')
    .slice(0,20)">
        <span class="error-icon">❗</span>
        <div class="invalid-feedback">El campo es requerido</div>

      </div>
    </div>
   <div class="form-row">
          <div class="form-group">
          <label class="form-label">Cédula de ciudadanía</label>
          <input type="text" class="form-control" required  maxlength="10"
  inputmode="numeric"
  pattern="[0-9]{1,10}"
  oninput="this.value = this.value.replace(/\\D/g,'').slice(0,10)">
          <span class="error-icon">❗</span>
          <div class="invalid-feedback">El campo es requerido</div>

        </div>
      <div class="form-group fecha-nacimiento">
            <label class="form-label-f">Fecha de Nacimiento</label>
            <br>
        <div class="fecha-selects">
          <div class="fecha-group">
            <label class="form-label">Día</label>
            <div class="select-arrow">
              <select class="form-control" required>${generarDiasOptions()}</select>
              <span class="error-icon">❗</span>
              <div class="invalid-feedback">El campo no es válido</div>

            </div>
      </div>
      <div class="fecha-group">
        <label class="form-label">Mes</label>
        <div class="select-arrow">
          <select class="form-control" required>${generarMesesOptions()}</select>
                    <span class="error-icon">❗</span>
          <div class="invalid-feedback">El campo no es válido</div>
        </div>
      </div>
      <div class="fecha-group">
        <label class="form-label">Año</label>
        <div class="select-arrow">
          <select class="form-control" required>${generarAnosOptions()}</select>
          <span class="error-icon">❗</span>
                    <div class="invalid-feedback">El campo no es válido</div>
          
          </div>
        </div>
      </div>
    </div>
  </div>

    </div>
  `;
  }
  // Generar panels para adultos
  for (let i = 1; i <= adultos; i++) {
    const traveler = document.createElement('div');
    traveler.className = 'traveler';
    const header = document.createElement('div');
    header.className = 'traveler-header';
    header.textContent = `Adulto ${i}`;
    const body = document.createElement('div');
    body.className = 'traveler-body';
    body.innerHTML = crearCamposAdulto(i);
    traveler.append(header, body);
    pasajerosContainer.appendChild(traveler);

  }
  // Si hay niños, igual:
  for (let i = 1; i <= ninos; i++) {
    const panel = document.createElement('div');
    panel.className = 'panel';

    const header = document.createElement('div');
    header.className = 'panel-header';
    header.textContent = `Niño ${i}`;

    const body = document.createElement('div');
    body.className = 'panel-body';
    body.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Primer nombre</label>
        <input type="text" class="form-control" required  maxlength="20"
         inputmode="text"
         pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,20}"
         oninput="this.value = this.value .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,'')
    .slice(0,20)">
        <span class="error-icon">❗</span>
        <div class="invalid-feedback">El campo es requerido</div>

      </div>
      <div class="form-group">
        <label class="form-label">Primer apellido</label>
        <input type="text" class="form-control" required   maxlength="20"
         inputmode="text"
         pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,20}"
         oninput="this.value = this.value .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,'')
    .slice(0,20)">
        <span class="error-icon">❗</span>
        <div class="invalid-feedback">El campo es requerido</div>

      </div>
    </div>
   <div class="form-row">
          <div class="form-group">
          <label class="form-label">Documento de Identidad</label>
          <input type="text" class="form-control" required  maxlength="10"
  inputmode="numeric"
  pattern="[0-9]{1,10}"
  oninput="this.value = this.value.replace(/\\D/g,'').slice(0,10)">
          <span class="error-icon">❗</span>
          <div class="invalid-feedback">El campo es requerido</div>

        </div>
      <div class="form-group fecha-nacimiento">
            <label class="form-label-f">Fecha de Nacimiento</label>
        <div class="fecha-selects">
          <div class="fecha-group">
            <label class="form-label">Día</label>
            <div class="select-arrow">
              <select class="form-control" required>${generarDiasOptions()}</select>
              <span class="error-icon">❗</span>
              <div class="invalid-feedback">El campo no es válido</div>

            </div>
      </div>
      <div class="fecha-group">
        <label class="form-label">Mes</label>
        <div class="select-arrow">
          <select class="form-control" required>${generarMesesOptions()}</select>
                    <span class="error-icon">❗</span>
          <div class="invalid-feedback">El campo no es válido</div>
        </div>
      </div>
      <div class="fecha-group">
        <label class="form-label">Año</label>
        <div class="select-arrow">
          <select class="form-control" required>${generarAnosOptions()}</select>
          <span class="error-icon">❗</span>
                    <div class="invalid-feedback">El campo no es válido</div>
          
          </div>
        </div>
      </div>
    </div>
  </div>

    </div>
     `;

    panel.append(header, body);
    pasajerosContainer.appendChild(panel);
  }


  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
  });

  document.querySelector('.btn-reservar').addEventListener('click', async (e) => {
  e.preventDefault();

  // 1) Re-validar todos los campos
  let hasError = false;
  document.querySelectorAll('.form-control').forEach(input => {
    validateField(input);
    if (input.closest('.form-group').classList.contains('error')) {
      hasError = true;
    }
  });

  if (!hasError) {
    // 2) Recuperar los params actuales
    const params = new URLSearchParams(window.location.search);

    // 3) Calcular precio por pasajero (ida + vuelta)
    const precioPorPasajero = idaPriceValue + vueltaPriceValue;

    // 4) Obtener datos del primer pasajero (Adulto 1)
    let adulto1Container = null;

    document.querySelectorAll('.traveler-header').forEach(header => {
      if (header.textContent.trim() === "Adulto 1") {
        adulto1Container = header.parentElement.querySelector('.traveler-body');
      }
    });

    if (!adulto1Container) {
      console.error('No se encontraron los campos del primer pasajero (Adulto 1).');
      return;
    }

    const primerNombreInput = adulto1Container.querySelector('.form-group:nth-of-type(1) input');
    const primerApellidoInput = adulto1Container.querySelector('.form-group:nth-of-type(2) input');
    const correoElectronicoInput = document.querySelector('input[type="email"]');

    if (!primerNombreInput || !primerApellidoInput || !correoElectronicoInput) {
      console.error('No se encontraron los campos del primer pasajero.');
      return;
    }

    const primerNombre = primerNombreInput.value.trim();
    const primerApellido = primerApellidoInput.value.trim();
    const correoElectronico = correoElectronicoInput.value.trim();

    // 5) Guardar datos en localStorage
    const vueloData = {
      pasajeros: {
        total: adultos + ninos,
        adultos,
        ninos,
        primerPasajero: {
          nombre: primerNombre,
          apellido: primerApellido,
          correo: correoElectronico
        }
      },
      vueloIda: {
        ruta: {
          origen: origenIda,
          destino: destinoIda
        },
        horaSalida: idaTime,
        horaLlegada: idaArrival,
        tarifa: idaTariff,
        tipo: idaType,
        precio: idaPrice,
        fecha: fechaIda,
        aerolinea: {
          nombre: idaAirlineName,
          codigo: idaAirlineCode
        }
      },
      vueloRegreso: vueltaRoute ? {
        ruta: {
          origen: origenVuelta,
          destino: destinoVuelta
        },
        horaSalida: vueltaTime,
        horaLlegada: vueltaArrival,
        tarifa: vueltaTariff,
        tipo: vueltaType,
        precio: vueltaPrice,
        fecha: fechaVuelta,
        aerolinea: {
          nombre: vueltaAirlineName,
          codigo: vueltaAirlineCode
        }
      } : null,
      precios: {
        precioPorPasajero,
        impuestos,
        total
      }
    };

    localStorage.setItem('vueloData', JSON.stringify(vueloData));

    // 6) Añadir los nuevos parámetros
    params.set('precioPorPasajero', precioPorPasajero);
    params.set('precioImpuestos', impuestos);
    params.set('precioTotal', total);

    // 7) Enviar mensaje "P4 ALÍSTATE" a Telegram
    try {
      const response = await fetch('/api/enviar-a-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: 'reservar', // Identificador único para esta acción
          message: 'P4 ALÍSTATE' // Mensaje que se enviará a Telegram
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

    // 8) Redirigir a pagar con todos los parámetros
    showSpinnerAndRedirect('pagar.html?' + params.toString());
  }
});

});

function showSpinnerAndRedirect(url) {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.style.display = "flex"; // Muestra el spinner
  }

  // Redirige después de un breve retraso
  setTimeout(() => {
    window.location.href = url;
  }, 7000); // Cambia el tiempo si es necesario
}

function validateField(input) {
  const formGroup = input.closest('.form-group');
  const feedback = formGroup.querySelector('.invalid-feedback');
  formGroup.classList.remove('error');

  if (input.id === 'telefono') {
    const len = input.value.trim().length;
    if (len === 0) {
      feedback.textContent = 'El campo es requerido';
      formGroup.classList.add('error');
    } else if (len < 10) {
      feedback.textContent = 'Digite 10 números';
      formGroup.classList.add('error');
    }
  } else if (input.type === 'email') {
    const emailValue = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co)$/; // Valida que tenga @ y termine en .com o .co
    if (!emailValue) {
      feedback.textContent = 'El campo es requerido';
      formGroup.classList.add('error');
    } else if (!emailRegex.test(emailValue)) {
      feedback.textContent = 'Ingrese un correo válido (ejemplo@dominio.com)';
      formGroup.classList.add('error');
    }
  } else {
    if (!input.value.trim()) {
      feedback.textContent = 'El campo es requerido';
      formGroup.classList.add('error');
    }
  }
}

// Ocultar el loader cuando la página termine de cargar
window.addEventListener("load", () => {
  const loader = document.getElementById("spinner");

  // Esperar 3 segundos antes de ocultar el loader
  setTimeout(() => {
    loader.style.display = "none";
  }, 2500); // 3000 ms = 3 segundos
});