// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

// ===== CORS (incluye tus dominios) =====
const corsOptions = {
  origin: [
    'https://grailmarket.shop',
    'https://www.grailmarket.shop',
    // (opcional: desarrollo local)
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// 👇 añadir este bloque aquí
app.use((req, _res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});


app.use(express.json());

// Ruta raíz amistosa
app.get('/', (_req, res) => {
  res.type('text').send('GrailMarket backend OK. Use /api/health');
});

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    sdk: 'v2',
    mpTokenLoaded: !!process.env.MP_ACCESS_TOKEN,
    front: process.env.FRONT_BASE || null
  });
});

// ===== Mercado Pago SDK v2 (NO usar mercadopago.configure) =====
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? '', // TEST-... o LIVE-...
  options: { timeout: 8000 }
});
const preference = new Preference(mpClient);
// Normaliza // a / (por si el front vuelve a mandar doble slash)
app.use((req, _res, next) => {
  if (req.url.includes('//')) req.url = req.url.replace(/\/{2,}/g, '/');
  next();
});
app.all('/api/create_preference', (req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204); // preflight
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  return next();
});

// Tu POST real debajo:
app.post('/api/create_preference', async (req, res) => {
  // ...
});
// Log mínimo de lo que entra (método y ruta)
app.use((req, _res, next) => {
  console.log('[REQ]', req.method, req.url);
  next();
});
// Crear preferencia
app.post('/api/create_preference', async (req, res) => {
  try {
    let { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'items vacío o inválido' });
    }

    items = items.map(i => ({
      title: String(i.title ?? 'Producto').slice(0, 250),
      unit_price: Number(i.unit_price),
      quantity: Number(i.quantity) || 1,
      currency_id: 'CLP'
    })).filter(i => i.unit_price > 0 && i.quantity > 0);

    const FRONT_BASE = process.env.FRONT_BASE || 'http://127.0.0.1:5500';
    const body = {
      items,
      back_urls: {
        success: `${FRONT_BASE}/success.html`,
        pending:  `${FRONT_BASE}/pending.html`,
        failure:  `${FRONT_BASE}/failure.html`
      }
      // auto_return lo puedes activar luego:
      // ,auto_return: 'approved'
    };

    const result = await preference.create({ body });
    res.json({ preferenceId: result.id, init_point: result.init_point });
  } catch (e) {
    console.error('Error MP create_preference:', e?.message || e);
    res.status(500).json({
      error: 'No se pudo crear la preferencia',
      details: e?.response?.data || e?.message || 'unknown'
    });
  }
});

// Puerto (Render setea PORT)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend MP v2 corriendo en :${PORT}`);
});
// 404 handler al final, después de todas las rutas
app.use((req, res) => {
  console.warn('[404]', req.method, req.url);
  res.status(404).json({ error: 'Not found', path: req.url, method: req.method });
});