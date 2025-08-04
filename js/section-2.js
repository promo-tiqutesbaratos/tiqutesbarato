const carousel = document.getElementById('carousel');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const slides = [
  { src: 'img/DESCUBRE-VUELOS-EN-OFERTA-C1.avif', text: '¡Vuela a reservar!', alt: 'Oferta 1' },
  { src: 'img/DESTINOS-A-IMPULSAR-CTG-C1.avif', text: 'Hasta 33% de descuento', alt: 'Semana Santa Cartagena' },
  { src: 'img/ULTIMAS-HABITACIONES-C1.avif', text: 'Hasta 55% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-CUN-C1.avif', text: 'Hasta 55% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/PLAYAS-INTERNACIONALES-C1.avif', text: 'Hasta 55% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-PUJ-C1.avif', text: 'Hasta 55% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/PLAYAS-NACIONALES-C1.avif', text: 'Hasta 44% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-AUA-C1.avif', text: 'Hasta 45% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/CIUDADES-INTERNACIONALES-C1.avif', text: 'Hasta 55% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-BOG-C1.avif', text: 'Hasta 30% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/CIUDADES-NACIONALES-C1.avif', text: 'Hasta 32% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-EJE-C1.avif', text: 'Hasta 40% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/DESTINOS-A-IMPULSAR-EJE-C1.avif', text: 'Hasta 40% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/VAMONOS-DE-PUENTE-C1.avif', text: 'Hasta 45% de descuento', alt: 'Semana Santa Piscina' },
  { src: 'img/empaquetados-usa-card1.avif', text: 'Hasta 30% de descuento', alt: 'Semana Santa Cartagena' },
];

// Renderiza las tarjetas
slides.forEach(slide => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${slide.src}" alt="${slide.alt}" title="${slide.text}" />
    <div class="card-text">${slide.text}</div>
  `;
  carousel.appendChild(card);
});

// Función para ajustar el ancho de las tarjetas según el dispositivo
function adjustCardWidths() {
  const isMobile = window.innerWidth <= 799;

  if (!isMobile) {
    document.querySelectorAll('.card, .card-2').forEach(card => {
      card.style.flex = '0 0 300px';
      card.style.minWidth = '300px';
    });

    document.querySelector('.carousel').style.gap = '10px';
    document.querySelector('.carousel-2').style.gap = '10px';
  }
}


function updateButtons() {
  const scrollLeft = Math.round(carousel.scrollLeft);
  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

  // Mostrar/ocultar prev
  if (scrollLeft <= 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
  }

  // Mostrar/ocultar next
  if (scrollLeft >= maxScrollLeft - 5) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'flex';
  }
}

function scrollByCard(direction = 1) {
  const isMobile = window.innerWidth <= 768;
  
  // En móvil, el ancho de la tarjeta es el ancho del contenedor
  const cardWidth = isMobile ? carousel.clientWidth : 300 + 10;
  
  // Determinar cuántas tarjetas desplazar según el ancho de la pantalla
  const cardsToScroll = isMobile ? 1 : 3;
  const scrollAmount = cardWidth * cardsToScroll;

  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  let newScrollLeft = carousel.scrollLeft + direction * scrollAmount;

  // Asegurar que el desplazamiento se alinee con los límites de las tarjetas
  if (isMobile) {
    // En móvil, alinear exactamente con cada tarjeta
    newScrollLeft = Math.round(newScrollLeft / cardWidth) * cardWidth;
  }

  newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

  carousel.scrollTo({ left: newScrollLeft, behavior: 'smooth' });

  setTimeout(updateButtons, 400);
}

// Eventos
nextBtn.addEventListener('click', () => scrollByCard(1));
prevBtn.addEventListener('click', () => scrollByCard(-1));
carousel.addEventListener('scroll', () => {
  clearTimeout(carousel._scrollTimer);
  carousel._scrollTimer = setTimeout(updateButtons, 100);
});

window.addEventListener('load', () => {
  adjustCardWidths();
  updateButtons();
});
window.addEventListener('resize', adjustCardWidths);

// Segundo carrusel
const carousel2 = document.getElementById('carousel-2');
const nextBtn2 = document.getElementById('nextBtn-2');
const prevBtn2 = document.getElementById('prevBtn-2');

const slides2 = [
  {
    src: 'img/adz-empaquetados-card3.avif',
    title: 'San Andrés',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'San Andrés'
  },
  {
    src: 'img/smr-empaquetados-card3.avif',
    title: 'Santa Marta',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Santa Marta'
  },
  {
    src: 'img/ctg-empaquetados-card3.avif',
    title: 'Cartagena',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Cartagena'
  },
  {
    src: 'img/aua-empaquetados-card3.avif',
    title: 'Aruba',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Aruba'
  },
  {
    src: 'img/puj-empaquetados-card3.avif',
    title: 'Punta Cana',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Punta Cana'
  },
  {
    src: 'img/cun-empaquetados-card3.avif',
    title: 'Cancún',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Cancún'
  },
  {
    src: 'img/TB-Card destinos 03-Florida-2025 s10.avif',
    title: 'Florida',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Florida'
  },
  {
    src: 'img/TB-Card destinos-SPORT COAST+VF-2025 s10.avif',
    title: 'St. Pete/Clearwater',
    subtitleSmall: '¡En paquete es más barato!',
    subtitleBold: 'Ahorra hasta un 30%',
    alt: 'Sport Coast'
  },
];

// Renderiza las tarjetas con título + subtítulo
slides2.forEach(({ src, title, subtitleSmall, subtitleBold, alt }) => {
  const card = document.createElement('div');
  card.classList.add('card-2');
  card.innerHTML = `
    <img src="${src}" alt="${alt}" />
    <div class="card-text-2">
      <p style="font-size: 1.1rem; font-weight: bold;">${title}</p>
      <p style="font-size: 0.85rem; margin-top: 2px;">${subtitleSmall}</p>
      <p style="font-size: 0.9rem; font-weight: bold; margin-top: 2px;">${subtitleBold}</p>
    </div>
  `;
  carousel2.appendChild(card);
});

function updateButtons2() {
  const scrollLeft = Math.round(carousel2.scrollLeft);
  const maxScrollLeft = carousel2.scrollWidth - carousel2.clientWidth;

  prevBtn2.style.display = scrollLeft <= 0 ? 'none' : 'flex';
  nextBtn2.style.display = scrollLeft >= maxScrollLeft - 5 ? 'none' : 'flex';
}

function scrollByCard2(direction = 1) {
  const isMobile = window.innerWidth <= 768;
  
  // En móvil, el ancho de la tarjeta es el ancho del contenedor
  const cardWidth = isMobile ? carousel2.clientWidth : 300 + 10;
  
  // Determinar cuántas tarjetas desplazar según el ancho de la pantalla
  const cardsToScroll = isMobile ? 1 : 3;
  const scrollAmount = cardWidth * cardsToScroll;

  const maxScrollLeft = carousel2.scrollWidth - carousel2.clientWidth;
  let newScrollLeft = carousel2.scrollLeft + direction * scrollAmount;

  // Asegurar que el desplazamiento se alinee con los límites de las tarjetas
  if (isMobile) {
    // En móvil, alinear exactamente con cada tarjeta
    newScrollLeft = Math.round(newScrollLeft / cardWidth) * cardWidth;
  }

  newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

  carousel2.scrollTo({ left: newScrollLeft, behavior: 'smooth' });

  setTimeout(updateButtons2, 400);
}

nextBtn2.addEventListener('click', () => scrollByCard2(1));
prevBtn2.addEventListener('click', () => scrollByCard2(-1));
carousel2.addEventListener('scroll', () => {
  clearTimeout(carousel2._scrollTimer);
  carousel2._scrollTimer = setTimeout(updateButtons2, 100);
});

window.addEventListener('load', () => {
  adjustCardWidths();
  updateButtons2();
});