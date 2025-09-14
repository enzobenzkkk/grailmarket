// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

// —— CORS: incluye tus dominios ——
const corsOptions = {
  origin: [
    'https://grailmarket.shop',
    'https://www.grailmarket.shop',
    // (opcional para desarrollo local)
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

app.use(express.json());

// Ruta raíz “amistosa”
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

// —— Mercado Pago SDK v2 (NO usar mercadopago.configure) ——
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? '', // TEST-... o LIVE-...
  options: { timeout: 8000 }
});
const preference = new Preference(mpClient);

// Crear preferencia
app.post('/api/create_preference', async (req, res) => {
  try {
    let { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'items vacío o inválido' });
    }

    // Sanitiza/valida items
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
      // Puedes activar luego:
      // ,auto_return: 'approved'
    };

    const result = await preference.create({ body });
    // result contiene { id, init_point, ... }
    res.json({ preferenceId: result.id, init_point: result.init_point });
  } catch (e) {
    console.error('Error MP create_preference:', e?.message || e);
    res.status(500).json({
      error: 'No se pudo crear la preferencia',
      details: e?.response?.data || e?.message || 'unknown'
    });
  }
});

// Puerto (Render inyecta PORT)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend MP v2 corriendo en :${PORT}`);
});
