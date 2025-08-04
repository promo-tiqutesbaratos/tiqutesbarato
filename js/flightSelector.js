// flightSelector.js
export function createFlightSelector(options) {
  const {
    logoSrc,
    logoAlt,
    route,
    date,
    fares,
    tariffs,
    primaryColor = 'rgb(218, 41, 28)',
    accentColor = '#0066ff',
    soldOutColor = 'rgba(200,200,200,0.2)'  // color de fondo para “Agotado”
  } = options;

  const container = document.createElement('div');
  container.className = 'flight-selector';

  // Variables CSS dinámicas
  container.style.setProperty('--primary_color', primaryColor);
  container.style.setProperty('--accent_color',  accentColor);
  container.style.setProperty('--soldout_color', soldOutColor);
  

  container.innerHTML = `
    <div class="fs-header">
      <div class="fs-logo-wrapper"> 
        <img src="${logoSrc}" alt="${logoAlt}" class="fs-logo" />
      </div>
      <div class="fs-route">${route}</div>
    </div>
    <div class="fs-toolbar">
      <button class="fs-tab active">✈ Vuelos de ida</button>
      <div class="fs-date">${date}</div>
      <a href="#" class="fs-info">
        ¿Qué incluye cada tarifa?
        <span><i class="fas fa-info-circle"></i></span>
      </a>
    </div>
  <div class="fs-table-container">
    <table class="fs-table">
      <thead>
        <tr>
          <th></th><th></th><th></th><th></th><th></th><th></th>
          ${tariffs.map(t => `<th>${t}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${fares.map((fare, rowIdx) => `
          <tr>
            <td class="time">${fare.time}</td>
            <td class="leg">
              <div class="fs-leg-wrapper">
                <div class="fs-duration">${fare.duration}</div>
                <div class="fs-leg-inner">
                  <span class="fs-circle"></span>
                  <span class="fs-line"></span>
                  <span class="fs-plane">✈︎</span>
                </div>
              </div>
            </td>
            <td class="arrival">${fare.arrival}</td>
            <td class="type">${fare.type}</td>
            <td class="flight-no">${fare.flightNo}</td>
            <td></td>
            ${fare.prices.map((price, colIdx) => 
              price === 'Agotado'
              ? `<td class="fare soldout">
                   <span class="soldout-text">${price}</span>
                 </td>`
              : `<td class="fare">
                   <input
                     type="radio"
                     name="tarifa"
                     id="t-${rowIdx}-${colIdx}"
                   >
                   <label for="t-${rowIdx}-${colIdx}">
                     <span class="price">${price}</span>
                   </label>
                 </td>`
            ).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>

  </div>
  `;
  return container;
}
