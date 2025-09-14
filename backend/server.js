// backend/server.js — Mercado Pago SDK v2
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

// CORS: permite llamadas desde tu front con Live Server
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));
app.use(express.json());

// Cliente Mercado Pago (SDK v2) con ACCESS TOKEN de TEST desde .env
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // ej: TEST-xxxxxxxx...
  options: { timeout: 5000 }
});
const preference = new Preference(mpClient);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    sdk: 'v2',
    mpTokenLoaded: !!process.env.MP_ACCESS_TOKEN
  });
});

// Crear preferencia
app.post('/api/create_preference', async (req, res) => {
  try {
    let { items } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'items vacío o inválido' });
    }

    // Normaliza items
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
        pending: `${FRONT_BASE}/pending.html`,
        failure: `${FRONT_BASE}/failure.html`
      }
      // Cuando confirmes que esas URLs existen y cargan, puedes sumar:
      // ,auto_return: 'approved'
    };

    const result = await preference.create({ body });
    // result trae { id, init_point, ... }
    res.json({ preferenceId: result.id, init_point: result.init_point });
  } catch (e) {
    console.error('Error MP create_preference:');
    console.error('message:', e?.message);
    console.error('cause:', e?.cause);
    console.error('error:', e?.error);
    console.error('response:', e?.response?.data || e?.response);
    res.status(500).json({
      error: 'No se pudo crear la preferencia',
      details: e?.response?.data || e?.cause || e?.message
    });
  }
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend de MP (SDK v2) corriendo en http://localhost:${PORT}`);
});