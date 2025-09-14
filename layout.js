
(function(){
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  const headerHTML = `
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur shadow">
    <div class="flex-1"></div> <!-- espacio flexible -->
<a href="checkout.html" id="cartBtn"
   class="relative ml-auto rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-black/5">
  🛒 <span>Carrito</span>
  <span id="cartCount"
        class="absolute -top-2 -right-2 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">0</span>
</a>

      <nav class="hidden md:flex items-center gap-4 text-sm ml-4">
        <a href="catalogo.html" class="hover:underline">Catálogo</a>
        <a href="zapatillas.html" class="hover:underline">Zapatillas</a>
        <a href="cinturones.html" class="hover:underline">Cinturones</a>
        <a href="vender.html" class="hover:underline">Vender</a>
        <a href="feed.html" class="hover:underline">Feed</a>
        <a href="contacto.html" class="hover:underline">Contacto</a>
      </nav>
      <div class="flex-1"></div>
      <a href="cart.html" class="relative ml-3" aria-label="Abrir carrito">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-800 hover:text-orange-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M19 21a2 2 0 11-4 0m4 0a2 2 0 0 0m-6 0a2 2 0 11-4 0m4 0 0 0"/>
        </svg>
        <span id="cartCount" class="absolute -top-2 -right-2 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">0</span>
      </a>
    </div>

    <!-- Mobile menu panel -->
    <div id="mobileMenu" class="md:hidden fixed top-[56px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg translate-y-[-120%] transition-transform duration-200">
      <nav class="px-4 py-3 grid gap-3 text-sm">
        <a href="catalogo.html" class="py-2 border-b">Catálogo</a>
        <a href="zapatillas.html" class="py-2 border-b">Zapatillas</a>
        <a href="cinturones.html" class="py-2 border-b">Cinturones</a>
        <a href="vender.html" class="py-2 border-b">Vender</a>
        <a href="feed.html" class="py-2 border-b">Feed</a>
        <a href="contacto.html" class="py-2">Contacto</a>
      </nav>
    </div>
  </header>`;

  const thisYear = new Date().getFullYear();
  const footerHTML = `
  <footer class="mt-10 border-t border-gray-200 bg-black text-white">
    <div class="max-w-6xl mx-auto px-4 py-8 text-sm flex items-center gap-3">
      <img src="img/logo.jpg" alt="Logo footer" class="h-8 w-8 rounded-full object-cover"/>
      <span>© ${thisYear} GRAILMARKET. Todos los derechos reservados.</span>
      <a href="https://instagram.com/grailmarket_" target="_blank" class="ml-auto hover:underline">@grailmarket_</a>
    </div>
  </footer>`;

  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  // Mobile menu toggle
  const btn = document.getElementById('mobileMenuBtn');
  const panel = document.getElementById('mobileMenu');
  let open = false;
  if (btn && panel){
    btn.addEventListener('click', ()=>{
      open = !open;
      panel.style.transform = open ? 'translateY(0)' : 'translateY(-120%)';
    });
    // close menu on link click
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
      open = false;
      panel.style.transform = 'translateY(-120%)';
    }));
  }

  // Update cart count (shared)
  function updateCartBadge(){
    try {
      const cart = JSON.parse(localStorage.getItem('cart-v1') || '[]');
      const count = cart.reduce((n, i) => n + (i.qty||0), 0);
      const el = document.getElementById('cartCount');
      if (el) el.textContent = String(count);
    } catch(e){ /* ignore */ }
  }
  updateCartBadge();
  window.addEventListener('storage', updateCartBadge);
})();
document.addEventListener('DOMContentLoaded', () => {
  injectCartPanel();
  loadCart();
  renderCart();
  updateBadge();

  // Cerrar / backdrop
  $('#closeCart')?.addEventListener('click', closeCart);
  $('#backdrop')?.addEventListener('click', closeCart);

  // Botón "Proceder al pago" del panel lateral
  $('#checkout')?.addEventListener('click', checkout);

  // Botón del header (id="cartBtn"): si tiene data-slide="true" abre panel; si no, navega al href
  const btn = document.getElementById('cartBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      const wantsSlide = btn.dataset.slide === 'true';
      if (wantsSlide) {
        e.preventDefault();
        openCart();
      }
    });
  }

  // ✅ Paso 2: fallback
  (function ensureCartButton(){
    let btn = document.getElementById('cartBtn');
    if (!btn) {
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <a href="checkout.html" id="cartBtn"
           class="fixed top-4 right-4 z-[120] rounded-full border border-gray-300 bg-white/90 px-4 py-2 shadow">
          🛒 <span>Carrito</span>
          <span id="cartCount"
                class="absolute -top-2 -right-2 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">0</span>
        </a>`;
      document.body.appendChild(wrap.firstElementChild);
    }
  })();
});


// === Badge del carrito en el header ===
function updateCartBadge(){
  try {
    const cart = JSON.parse(localStorage.getItem('cart-v1') || '[]');
    const count = cart.reduce((n, i) => n + (i.qty||0), 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = String(count);
  } catch {}
}
updateCartBadge();
window.addEventListener('storage', updateCartBadge);



// CONTADOR DEL CARRITO EN EL HEADER
function updateCartBadge(){
  try {
    const cart = JSON.parse(localStorage.getItem('cart-v1') || '[]');
    const count = cart.reduce((n, i) => n + (i.qty||0), 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = String(count);
  } catch {}
}
updateCartBadge();
window.addEventListener('storage', updateCartBadge);
<a href="checkout.html" id="cartBtn"
   class="relative ml-3 rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-black/5">
  🛒 <span>Carrito</span>
  <span id="cartCount"
        class="absolute -top-2 -right-2 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">0</span>
</a>
