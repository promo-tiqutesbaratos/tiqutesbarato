// main.js
import { createFlightSelector } from './flightSelector-regreso.js';

// ——————————————————————————————————————————————
// Constantes globales para formateo de fechas
// ——————————————————————————————————————————————
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

// ——————————————————————————————————————————————
// Tu lista de ciudades (para nombre ↔ código)
// ——————————————————————————————————————————————
const citiesList = [
  { name: "Bogotá", code: "BOG" },
  { name: "Medellín", code: "MEDE" },
  { name: "Cali", code: "CLO" },
  { name: "Barranquilla", code: "BAQ" },
  { name: "Cartagena de Indias", code: "CTG" },
  { name: "Bucaramanga", code: "BGA" },
  { name: "Pereira", code: "PEI" },
  { name: "Santa Marta", code: "SMR" },
  { name: "San Andrés", code: "ADZ" },
  { name: "Leticia", code: "LET" },
  { name: "Cúcuta", code: "CUC" },
  { name: "Manizales", code: "MZL" },
  { name: "Neiva", code: "NVA" },
  { name: "Armenia", code: "AXM" },
  { name: "Montería", code: "MTR" },
  { name: "Sincelejo", code: "CVE" },
  { name: "Valledupar", code: "VUP" },
  { name: "Tuluá", code: "TUL" },
  { name: "Villavicencio", code: "VVC" },
  { name: "Popayán", code: "PPN" }
];

// ——————————————————————————————————————————————
// Coordenadas IATA → lat/lon
// ——————————————————————————————————————————————
const cityCoords = {
  BOG: { lat: 4.7016, lon: -74.1469 }, MEDE: { lat: 6.2442, lon: -75.5812 },
  CLO: { lat: 3.4516, lon: -76.5320 }, BAQ: { lat: 10.9639, lon: -74.7964 },
  CTG: { lat: 10.3910, lon: -75.4794 }, BGA: { lat: 7.1275, lon: -73.1848 },
  PEI: { lat: 4.8140, lon: -75.6946 }, SMR: { lat: 11.2408, lon: -74.1990 },
  ADZ: { lat: 12.5833, lon: -81.7111 }, LET: { lat: -4.2153, lon: -69.9433 },
  CUC: { lat: 7.9275, lon: -72.5113 }, MZL: { lat: 5.0689, lon: -75.5178 },
  NVA: { lat: 2.9273, lon: -75.2819 }, AXM: { lat: 4.4528, lon: -75.7664 },
  MTR: { lat: 8.7470, lon: -75.8438 }, CVE: { lat: 9.3042, lon: -75.3978 },
  VUP: { lat: 10.4608, lon: -73.2595 }, TUL: { lat: 3.4058, lon: -76.1379 },
  VVC: { lat: 4.1561, lon: -73.6136 }, PPN: { lat: 2.4442, lon: -76.6069 }
};

// ——————————————————————————————————————————————
// Cálculo de distancia y duración
// ——————————————————————————————————————————————
const toRad = x => x * Math.PI / 180;
function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat),
    dLon = toRad(b.lon - a.lon),
    la1 = toRad(a.lat), la2 = toRad(b.lat),
    h = Math.sin(dLat / 2) ** 2
      + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
function stopsByDistance(km) {
  if (km < 1200) return 0;
  if (km < 1500) return 1;
  if (km < 3000) return 2;
  return 3;
}
function computeRealisticDuration(km, stops) {
  const airH = km / 800,
    layH = stops * 0.75,
    totalH = airH + layH + 0.1,
    H = Math.floor(totalH),
    M = Math.round((totalH - H) * 60 / 15) * 15;
  return `${H}h ${M}m`;
}

// ——————————————————————————————————————————————
// Helpers aleatorios
// ——————————————————————————————————————————————
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function pickRandom(arr, n) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, n)
    .map(x => x.v);
}
function randomTime() {
  const h = randInt(5, 23),
    m = [0, 15, 30, 45][randInt(0, 3)];
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function randomFlightNo(air) {
  let [min, max] = [4000, 9999];
  switch (air.toLowerCase()) {
    case 'avianca': [min, max] = [4800, 9900]; break;
    case 'latam': [min, max] = [4100, 9000]; break;
    case 'wingo': [min, max] = [7200, 7999]; break;
    case 'jetsmart': [min, max] = [5100, 7999]; break;
  }
  return 'Vuelo ' + randInt(min, max);
}
function randomPricesSorted(count) {
  // El primer precio siempre será 75.900, los demás aleatorios
  const vals = [75900, ...Array.from({ length: count - 1 }, () => randInt(150000, 750000))]
    .sort((a, b) => a - b);

  // Asegura que el primer precio sea 75.900
  vals[0] = 75900;

  return vals.map((v, i) =>
    i < count - 1 && Math.random() < 0.2
      ? 'Agotado'
      : '$ ' + v.toLocaleString('es-CO')
  );
}
function soldOutColorFrom(rgb) {
  const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  return m
    ? `rgba(${m[1]},${m[2]},${m[3]},0.2)`
    : 'rgba(200,200,200,0.2)';
}

// ——————————————————————————————————————————————

function parseDateStr(str) {
  const cleaned = str.replace(/\bde\b/gi, '').replace(/\./g, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length !== 3) return null;
  const [dd, monRaw, yyyy] = parts;
  const months = {
    ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6,
    jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12
  };
  const m = months[monRaw.toLowerCase()];
  return m
    ? `${yyyy}-${String(m).padStart(2, '0')}-${dd.padStart(2, '0')}`
    : null;
}

// ——————————————————————————————————————————————
// Formatear ISO → "Miércoles, 05 mayo 2025"

function formatWithWeekday(iso) {
  const [yyyy, mm, dd] = iso.split('-').map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  if (isNaN(d)) return iso;
  const wd = WEEKDAYS[d.getDay()];
  const mn = MONTHS[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  const cap = wd.charAt(0).toUpperCase() + wd.slice(1);
  return `${cap}, ${day} ${mn} ${d.getFullYear()}`;
}

// ——————————————————————————————————————————————
// Estado global de filtros y selección

let currentFilters = { stops: 'all', airlines: [] };
let selectedFlight = null;

// ——————————————————————————————————————————————
// Construye params y redirige
function saveSearch() {
  // 1) Recoge valores del formulario
  const tipo = document.querySelector('input[name="tipoVuelo"]:checked').value;
  const oriName = document.getElementById('input-origen').value.trim();
  const desName = document.getElementById('input-destino').value.trim();
  const fechas = document.getElementById('input-fechas').value.trim();
  const pax = document.getElementById('input-pasajeros').value.trim();

  const oriObj = citiesList.find(c => c.name === oriName) || {};
  const desObj = citiesList.find(c => c.name === desName) || {};

  let idaIso = '', vueltaIso = '';
  if (fechas.includes(' - ')) {
    [idaIso, vueltaIso] = fechas.split(' - ').map(parseDateStr);
  } else {
    idaIso = parseDateStr(fechas);
  }

  // 2) Construye UN NUEVO objeto de params (no partir de los viejos)
  const params = new URLSearchParams();
  params.set('tipoVuelo', tipo);
  params.set('origen', oriName);
  params.set('origenCode', oriObj.code || '');
  params.set('destino', desName);
  params.set('destinoCode', desObj.code || '');
  params.set('fechaIda', idaIso || '');
  params.set('fechaVuelta', vueltaIso || '');
  params.set('pasajeros', pax || '');

  // 3) Actualiza la URL SIN los parámetros de selección previa
  history.replaceState(null, '', `?${params.toString()}`);

  // 4) Actualiza el título **ahora mismo**
  const O = oriName.charAt(0).toUpperCase() + oriName.slice(1).toLowerCase();
  const D = desName.charAt(0).toUpperCase() + desName.slice(1).toLowerCase();
  document.title = `Vuelos a ${D} desde ${O} | Tiquetes Baratos`;

  // 5) Arranca la renderización y oculta el footer
  selectedFlight = null;
  initFlights();
}

// ——————————————————————————————————————————————
// Pintar pie fijo con el vuelo seleccionado

function updateFooter() {
  const footer = document.getElementById('selected-footer');
  const params = new URLSearchParams(window.location.search);
  const vueltaRoute = params.get('vuelta_route');

  // 1) Si no hay regreso, oculto todo
  if (!vueltaRoute) {
    document.body.classList.remove('has-selection');
    footer.style.display = 'none';
    return;
  }

  // 2) Muestro footer
  document.body.classList.add('has-selection');
  footer.style.display = '';

  // 3) Extraigo datos de ida y vuelta
  const idaRoute = params.get('ida_route');
  const idaTime = params.get('ida_time');
  const idaArrival = params.get('ida_arrival');
  const idaPrice = params.get('ida_price');
  const vueltaTime = params.get('vuelta_time');
  const vueltaArrival = params.get('vuelta_arrival');
  const vueltaPrice = params.get('vuelta_price');

  // 4) Renderizo siempre "Reservar"
  footer.innerHTML = `
    <div class="footer-content ida-regreso">
      <div class="footer-info">
        <strong>Ida:</strong> ${idaRoute} — ${idaTime} → ${idaArrival}<br>
        <strong>Regreso:</strong> ${vueltaRoute} — ${vueltaTime} → ${vueltaArrival}
      </div>
      <div class="footer-price">
        Ida: ${idaPrice}  |  Regreso: ${vueltaPrice}
      </div>
      <a class="btn-reserve" href="./reservar?${params.toString()}">
        Reservar <i class="fas fa-chevron-right"></i>
      </a>
    </div>
  `;
}






// ——————————————————————————————————————————————
// Renderizado de vuelos con filtros y selección

function initReturnFlights() {
  const params = new URLSearchParams(window.location.search);

  // Datos de búsqueda (origen, destino, fechas, pasajeros…)
  const datos = {
    tipoVuelo: params.get('tipoVuelo'),
    origen: params.get('origen'),
    origenCode: params.get('origenCode'),
    destino: params.get('destino'),
    destinoCode: params.get('destinoCode'),
    fechaIda: params.get('fechaIda'),
    fechaVuelta: params.get('fechaVuelta'),
    pasajeros: params.get('pasajeros')
  };

  // Datos previos de ida (para mostrar resumen)
  const idaFlight = {
    route: params.get('ida_route'),
    time: params.get('ida_time'),
    arrival: params.get('ida_arrival'),
    tariff: params.get('ida_tariff'),
    type: params.get('ida_type'),
    price: params.get('ida_price')
  };

  // Aquí pintas en el sidebar el bloque "Ida" usando `idaFlight`
  // …
}


function initFlights() {
  // 1) Recuperar datos de búsqueda desde URL params
  const params = new URLSearchParams(window.location.search);
  const datos = {
    tipoVuelo: params.get('tipoVuelo'),
    origen: params.get('origen'),
    origenCode: params.get('origenCode'),
    destino: params.get('destino'),
    destinoCode: params.get('destinoCode'),
    fechaIda: params.get('fechaIda'),
    fechaVuelta: params.get('fechaVuelta'),
    pasajeros: params.get('pasajeros')
  };

  // 2) Inicializar selectedFlight si ya existe en params
  const selTime = params.get('time');
  if (selTime) {
    selectedFlight = {
      logoSrc: params.get('logoSrc'),
      route: params.get('route'),
      time: params.get('time'),
      arrival: params.get('arrival'),
      tariff: params.get('tariff'),
      type: params.get('type'),
      price: params.get('price')
    };
  } else {
    selectedFlight = null;
  }

  updateFooter();

  // 3) Preparar contenedor de vuelos
  const cont = document.getElementById('flights');
  cont.innerHTML = '';

  // 4) Aerolíneas base
  const raw = [
    { logoSrc: '../img/logos/Avianca.png', logoAlt: 'avianca', primaryColor: '#da291c', accentColor: '#0066ff', tariffs: ['Basic', 'Clasic', 'Flex'] },
    { logoSrc: '../img/logos/LATAM.png', logoAlt: 'latam', primaryColor: 'rgb(0,41,122)', accentColor: '#00b1ea', tariffs: ['Basic', 'Light', 'Full', 'Premium'] },
    { logoSrc: '../img/logos/Wingo.png', logoAlt: 'wingo', primaryColor: '#63c', accentColor: '#00b1ea', tariffs: ['Basic', 'Standar', 'Plus', 'Extra'] },
    { logoSrc: '../img/logos/JetSMART.png', logoAlt: 'jetsmart', primaryColor: '#366086', accentColor: '#00b1ea', tariffs: ['Básico', 'Travel', 'Standard', 'Premium'] },
  ];

  // 5) Dedupe y elegir 3 aleatorias
  const unique = [];
  const seen = new Set();
  raw.forEach(f => {
    if (!seen.has(f.logoAlt)) {
      seen.add(f.logoAlt);
      unique.push({ ...f });
    }
  });
  let chosen = pickRandom(unique, 3);

  // 6) Aplicar filtro de aerolíneas si existe
  if (currentFilters.airlines.length) {
    chosen = chosen.filter(f => currentFilters.airlines.includes(f.logoAlt));
  }

  // 7) Calcular distancia y duración
  const coordA = cityCoords[datos.origenCode];
  const coordB = cityCoords[datos.destinoCode];
  const distKm = coordA && coordB ? haversine(coordA, coordB) : 800;
  const stopsCnt = stopsByDistance(distKm);
  const dur = computeRealisticDuration(distKm, stopsCnt);

  // 8) Renderizar cada aerolínea y sus fares
  chosen.forEach(f => {
    if (datos.destino && datos.origen) {
      f.route = `${datos.destino} (${datos.destinoCode}) – ${datos.origen} (${datos.origenCode})  `;
    }
    f.soldOutColor = soldOutColorFrom(f.primaryColor);

    const N = randInt(2, 10);
    f.fares = Array.from({ length: N }).map(() => {
      const t0 = randomTime();
      const [hD, mD] = dur.match(/(\d+)h\s+(\d+)m/).slice(1).map(Number);
      const [h0, m0] = t0.split(':').map(Number);
      let mins = (h0 * 60 + m0 + hD * 60 + mD) % (24 * 60);
      const h1 = Math.floor(mins / 60), m1 = mins % 60;
      const arrival = `${String(h1).padStart(2, '0')}:${String([0, 15, 30, 45].includes(m1) ? m1 : 0).padStart(2, '0')}`;
      const type = stopsCnt === 0 ? 'Directo' : `${stopsCnt} parada${stopsCnt > 1 ? 's' : ''}`;
      const prices = randomPricesSorted(f.tariffs.length);
      return { time: t0, arrival, duration: dur, type, flightNo: randomFlightNo(f.logoAlt), prices };
    });

    // 9) Filtrar por paradas
    if (currentFilters.stops === 'direct') {
      f.fares = f.fares.filter(x => x.type === 'Directo');
    } else if (currentFilters.stops === 'withStops') {
      f.fares = f.fares.filter(x => x.type !== 'Directo');
    }
    if (!f.fares.length) return;

    f.date = datos.fechaIda ? formatWithWeekday(datos.fechaIda) : '';
    const el = createFlightSelector(f);

    // 10) Listener al click en precio
    // Dentro del handler de click (o change) de tu return page:
    el.querySelectorAll('.fare-price').forEach((priceEl, i) => {
      priceEl.addEventListener('click', () => {
        const sel = f.fares[i];
        const returnFlight = {
          logoSrc: f.logoSrc,
          route: f.route,
          time: sel.time,
          arrival: sel.arrival,
          tariff: sel.tariff,
          type: sel.type,
          price: sel.price
        };

        // 1) clonar params
        const newParams = new URLSearchParams(window.location.search);

        // 2) añadir los campos de "vuelta_…"
        Object.entries(returnFlight).forEach(([k, v]) => {
          newParams.set(`vuelta_${k}`, v);
        });
        
        // Mantener los parámetros originales de time y arrival
        newParams.set('time', sel.time);
        newParams.set('arrival', sel.arrival);
        
        // Añadir también los parámetros con nombres específicos para el vuelo de regreso
        newParams.set('vuelta_time', sel.time);
        newParams.set('vuelta_arrival', sel.arrival);
        
        // Guardar logoSrc con el nombre original y también con un nombre específico para el vuelo de regreso
        newParams.set('logoSrc', f.logoSrc);
        newParams.set('vuelta_logoSrc', f.logoSrc);
        
        newParams.set('vuelta_route', returnFlight.route);

        // 3) aplicar al history y repintar
        history.replaceState(null, '', `?${newParams.toString()}`);
        updateFooter();
      });
    });


    // 12) Listener al cambio de radio de tarifa
    const radios = el.querySelectorAll('input[name="tarifa"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Vuelvo a extraer índices…
        const [, rowIdx, colIdx] = radio.id.split('-').map(Number);
        const selFare = f.fares[rowIdx];

        // 🆕 Construyo de nuevo el objeto returnFlight
        const returnFlight = {
          logoSrc: f.logoSrc,
          route: f.route,
          time: selFare.time,
          arrival: selFare.arrival,
          tariff: f.tariffs[colIdx],
          type: selFare.type,
          price: selFare.prices[colIdx]
        };

        const newParams = new URLSearchParams(window.location.search);
        
        // Añadir los parámetros con prefijo vuelta_
        Object.entries(returnFlight).forEach(([k, v]) =>
          newParams.set(`vuelta_${k}`, v)
        );
        
        // Mantener los parámetros originales de time y arrival
        newParams.set('time', selFare.time);
        newParams.set('arrival', selFare.arrival);
        
        // Añadir también los parámetros con nombres específicos para el vuelo de regreso
        newParams.set('vuelta_time', selFare.time);
        newParams.set('vuelta_arrival', selFare.arrival);
        
        // Guardar logoSrc con el nombre original y también con un nombre específico para el vuelo de regreso
        newParams.set('logoSrc', f.logoSrc);
        newParams.set('vuelta_logoSrc', f.logoSrc);
        
        newParams.set('vuelta_route', returnFlight.route);

        history.replaceState(null, '', `?${newParams.toString()}`);
        updateFooter();
      });
    });



    cont.appendChild(el);
  });

  // 13) Finalmente pintar footer según selección
  updateFooter();
}

// ——————————————————————————————————————————————
// Arranque, Buscar y Filtros

document.addEventListener('DOMContentLoaded', () => {
  // ya no filtramos por nombre de fichero, lo hacemos por el parámetro "tipoVuelo"
  const params = new URLSearchParams(window.location.search);
  if (params.get('tipoVuelo') === 'idaRegreso') {
    initReturnFlights();
  }
  initFlights();
  // Delegación global: siempre cogerá los radios nuevos
  document.addEventListener('change', e => {
    if (e.target.matches('input[name="tarifa"]')) {
      const footer = document.querySelector('.selected-footer');
      // reiniciamos cualquier clase previa por si acaso
      footer.classList.remove('animate');
      // forzamos reflow para poder volver a animar
      void footer.offsetWidth;
      footer.classList.add('animate');
      footer.addEventListener('animationend', () => {
        footer.classList.remove('animate');
      }, { once: true });
    }
  });


  // botón Buscar
  document.querySelector('button.buscar-2')
    .addEventListener('click', e => {
      e.preventDefault();
      saveSearch();
      // Tras guardar los params, redirigimos a la página de resultados
      window.location.href = `resultados.html${window.location.search}`;
    });



  // filtros
  const dialog = document.getElementById("filtersDialog");
  const applyBtn = dialog.querySelector(".btn--primary");
  const radioStops = [...dialog.querySelectorAll('input[name="parada"]')];
  const chkAero = [...dialog.querySelectorAll('input[name="aerolinea"]')];

  applyBtn.addEventListener("click", e => {
    e.preventDefault();

    // stops
    const selStop = radioStops.find(r => r.checked);
    currentFilters.stops = selStop.value || 'all';

    // airlines
    const allChk = chkAero.find(c => c.value === 'all');
    if (allChk && allChk.checked) {
      currentFilters.airlines = [];
    } else {
      currentFilters.airlines = chkAero
        .filter(c => c.value !== 'all' && c.checked)
        .map(c => c.value.toLowerCase());
    }

    initFlights();
    dialog.close();
  });
});