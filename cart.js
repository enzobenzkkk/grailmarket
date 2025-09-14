// cart.js — Inyecta el panel lateral, conecta el botón 🛒 y Checkout con Mercado Pago
(function () {
  // === Configuración ===
  const MP_PUBLIC_KEY = 'APP_USR-5bf9ff8a-c192-4c4a-afa4-7e6b326cd0cb'; 
  const BACKEND_URL = 'https://grailmarket.onrender.com'; // 👈 SIN "/" al final

  // Utilidad
  const $ = (s) => document.querySelector(s);
  const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  // Helper para unir URLs sin duplicar "/"
  function joinURL(base, path) {
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const p = path.startsWith('/') ? path : `/${path}`;
    return b + p;
  }

  // ====== (Opcional) Animación linda al abrir ======
  (function injectAnimationCSS(){
    if (document.getElementById('cart-anim-css')) return;
    const st = document.createElement('style');
    st.id = 'cart-anim-css';
    st.textContent = `
      @keyframes cartBounceIn{
        0%{ transform: translateX(100%) scale(.98) }
        60%{ transform: translateX(0) scale(1.01) }
        100%{ transform: translateX(0) scale(1) }
      }
      #cartPanel.opening{ animation: cartBounceIn .36s cubic-bezier(.2,.7,.3,1) }
    `;
    document.head.appendChild(st);
  })();

  // 1) Inyecta el HTML del panel si no existe
  function injectCartPanel() {
    if ($('#cartPanel')) return; // ya existe
    const tpl = document.createElement('template');
    tpl.innerHTML = `
<aside id="cartPanel" class="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white/95 backdrop-blur shadow-2xl translate-x-full transition-transform duration-300 z-[100] flex flex-col border-l border-black/5 rounded-none sm:rounded-l-3xl">
  <div class="px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-400 text-white flex items-center justify-between shadow">
    <h3 class="font-semibold text-lg tracking-wide">Tu carrito</h3>
    <button id="closeCart" class="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition">✕</button>
  </div>

  <div id="cartList" class="flex-1 overflow-y-auto divide-y divide-black/5 p-2"></div>

  <div class="border-t border-black/10 p-5 grid gap-3 bg-white/80">
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Subtotal</span>
      <strong id="subtotal" class="text-lg">—</strong>
    </div>
    <button id="checkout" class="rounded-2xl bg-black text-white px-4 py-3 text-sm font-medium shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Proceder al pago</button>
    <p class="text-xs text-gray-500">100% original · Envíos a todo Chile</p>
  </div>
</aside>
<div id="backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity z-[90]"></div>
    `;
    document.body.appendChild(tpl.content);
  }

  // 2) Estado del carrito
  let cart = [];
  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem('cart-v1') || '[]'); } catch { cart = []; }
  }
  function saveCart() {
    localStorage.setItem('cart-v1', JSON.stringify(cart));
    try { window.dispatchEvent(new StorageEvent('storage', { key: 'cart-v1' })); } catch {}
  }
  function subtotal() { return cart.reduce((t, i) => t + i.price * i.qty, 0); }

  // 3) Fuente de productos (usa tu products.js si está presente)
  function getProducts() {
    if (Array.isArray(window.products) && window.products.length) return window.products;
    return [];
  }

  // 4) Render del panel
  function renderCart() {
    const list = $('#cartList');
    if (!list) return;
    list.innerHTML = '';
    if (!cart.length) {
      list.innerHTML = '<div class="p-6 text-sm text-gray-500">Tu carrito está vacío.</div>';
    } else {
      const PRODUCTS = getProducts();
      cart.forEach((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id) || { name: 'Producto', img: '' };
        const row = document.createElement('div');
        row.className = 'flex items-center gap-3 p-4';
        row.innerHTML = `
          <img src="${p.img || ''}" alt="${p.name}" class="h-14 w-14 rounded-lg object-cover"/>
          <div class="flex-1">
            <div class="font-medium text-sm">${p.name}</div>
            <div class="text-xs text-gray-500">${CLP.format(i.price)}${i.size ? ` · Talla ${i.size}` : ''}</div>
            <div class="mt-2 inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-sm">
              <button class="px-2" data-action="dec" data-id="${i.id}" data-size="${i.size || ''}">−</button>
              <span class="min-w-[2ch] text-center">${i.qty}</span>
              <button class="px-2" data-action="inc" data-id="${i.id}" data-size="${i.size || ''}">+</button>
            </div>
          </div>
          <div class="grid justify-items-end">
            <div class="text-sm font-semibold">${CLP.format(i.qty * i.price)}</div>
            <button class="mt-2 text-xs text-red-600 hover:underline" data-action="rm" data-id="${i.id}" data-size="${i.size || ''}">Quitar</button>
          </div>
        `;
        list.appendChild(row);
      });
    }
    const sub = $('#subtotal');
    if (sub) sub.textContent = CLP.format(subtotal());

    // Delegar acciones
    list.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const size = btn.dataset.size || null;
        const it = cart.find((x) => x.id === id && (x.size || null) === (size || null));
        if (!it) return;
        if (btn.dataset.action === 'inc') it.qty += 1;
        if (btn.dataset.action === 'dec') it.qty -= 1;
        if (btn.dataset.action === 'rm') it.qty = 0;
        cart = cart.filter((x) => x.qty > 0);
        saveCart();
        renderCart();
        updateBadge();
      });
    });
  }

  // 5) Abrir/cerrar
  function openCart() {
    const panel = $('#cartPanel'), bd = $('#backdrop');
    if (!panel || !bd) return;
    panel.classList.add('opening');
    panel.classList.remove('translate-x-full');
    bd.classList.remove('pointer-events-none');
    requestAnimationFrame(() => (bd.style.opacity = 1));
    panel.addEventListener('animationend', ()=> panel.classList.remove('opening'), { once:true });
  }
  function closeCart() {
    const panel = $('#cartPanel'), bd = $('#backdrop');
    if (!panel || !bd) return;
    panel.classList.add('translate-x-full');
    bd.style.opacity = 0;
    bd.addEventListener('transitionend', () => bd.classList.add('pointer-events-none'), { once: true });
  }

  // 6) Badge en el header
  function updateBadge() {
    const count = cart.reduce((n, i) => n + (i.qty || 0), 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = String(count);
  }

  // 7) API global para agregar al carrito
  window.addToCart = function (id, size) {
    const PRODUCTS = getProducts();
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const ex = cart.find((i) => i.id === id && (i.size || null) === (size || null));
    if (ex) ex.qty += 1; else cart.push({ id, qty: 1, price: p.price, name: p.name, size: size || null });
    saveCart(); renderCart(); updateBadge(); openCart();
  };

  // === Checkout con Mercado Pago ===
  async function checkout(){
    try {
      const items = cart.map(i => ({
        title: i.name,
        quantity: i.qty,
        unit_price: i.price
      }));
      if (!items.length) { alert('Tu carrito está vacío.'); return; }

      const url = joinURL(BACKEND_URL, '/api/create_preference');
      console.log('[GM] POST URL:', url); // 👈 DEBUG

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error(`Error al crear preferencia (${res.status})`);
      const { preferenceId } = await res.json();

      if (typeof MercadoPago !== 'function') {
        alert('SDK de Mercado Pago no cargado.');
        return;
      }
      const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CL' });
      mp.checkout({
        preference: { id: preferenceId },
        autoOpen: true,
        redirectMode: 'self',
        theme: { elementsColor: '#FF7A00' }
      });
    } catch (err) {
      console.error('[GM] checkout error:', err);
      alert('No se pudo iniciar el pago. Mira la consola.');
    }
  }
document.addEventListener('click', (e) => {
  const el = e.target.closest('#checkout');
  if (!el) return;
  console.log('[GM] checkout button clicked');
  e.preventDefault();
  checkout();
});

async function checkout(){
  try {
    console.log('[GM] checkout() start');
    const cart = JSON.parse(localStorage.getItem('cart-v1') || '[]');
    console.log('[GM] cart items:', cart);
    const items = cart.map(i => ({ title: i.name, quantity: i.qty, unit_price: i.price }));
    if (!items.length) { alert('Tu carrito está vacío.'); return; }

    const url = `${BACKEND_URL}/api/create_preference`;
    console.log('[GM] POST URL:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ items })
    });

    console.log('[GM] status:', res.status);
    let body; try { body = await res.clone().json(); } catch { body = await res.text(); }
    console.log('[GM] body:', body);
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);

    if (typeof MercadoPago !== 'function') { alert('SDK de Mercado Pago no cargado.'); return; }
    console.log('[GM] MP_PUBLIC_KEY:', MP_PUBLIC_KEY);

    const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CL' });
    mp.checkout({
      preference: { id: body.preferenceId },
      autoOpen: true,
      redirectMode: 'self',
      theme: { elementsColor: '#FF7A00' }
    });
  } catch (err) {
    console.error('[GM] checkout error:', err);
    alert('No se pudo iniciar el pago. Revisa la consola.');
  }
}
  // 8) Wire-up inicial
  document.addEventListener('DOMContentLoaded', () => {
    injectCartPanel();
    loadCart();
    renderCart();
    updateBadge();

    $('#closeCart')?.addEventListener('click', closeCart);
    $('#backdrop')?.addEventListener('click', closeCart);
    $('#checkout')?.addEventListener('click', checkout);

    const btn = document.getElementById('cartBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    }
  });

  // Escucha cambios desde otras pestañas
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart-v1') {
      loadCart(); renderCart(); updateBadge();
    }
  });
})();
