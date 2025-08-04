
  // Esperar a que todo el DOM esté cargado
  window.onload = function() {
    console.log("Página cargada completamente");
    
    // Obtener referencias a los elementos
    var menuToggle = document.getElementById('menuToggle');
    var closeMenu = document.getElementById('closeMenu');
    var mobileMenu = document.getElementById('mobileMenu');
    var menuOverlay = document.getElementById('menuOverlay');
    
    console.log("Menú toggle:", menuToggle);
    console.log("Menú móvil:", mobileMenu);
    console.log("Botón cerrar:", closeMenu);
    console.log("Overlay:", menuOverlay);
    
    // Verificar que los elementos existan
    if (!menuToggle || !mobileMenu) {
      console.error("No se encontraron los elementos necesarios para el menú móvil");
      return;
    }
    
    // Función para abrir el menú
    menuToggle.onclick = function(e) {
      console.log("Clic en botón hamburguesa");
      if (e) e.preventDefault();
      mobileMenu.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    
    // Función para cerrar el menú
    if (closeMenu) {
      closeMenu.onclick = function() {
        console.log("Cerrando menú");
        mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };
    }
    
    // Cerrar al hacer clic en el overlay
    if (menuOverlay) {
      menuOverlay.onclick = function() {
        console.log("Clic en overlay");
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };
    }
  };
