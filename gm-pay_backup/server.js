// gm-pay_backup/server.js — Mercado Pago SDK v2 (sin BOM)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

import cors from 'cors';

// CORS para producción y dev
app.use(cors({
  origin: [
    'https://grailmarket.shop',
    'https://www.grailmarket.shop',
    // (opcional: para pruebas locales)
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// por si algún proxy hace preflight manual
app.options('*', cors());

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});
const preference = new Preference(mpClient);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, sdk: 'v2', mpTokenLoaded: !!process.env.MP_ACCESS_TOKEN });
});

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
    })).filter(i => i.unit_price > 0 && i.quantity > 0);

    const FRONT_BASE = process.env.FRONT_BASE || 'https://grailmarket.onrender.com';
    const prefBody = {
      items,
      back_urls: {
        success: `${FRONT_BASE}/success.html`,
        pending: `${FRONT_BASE}/pending.html`,
        failure: `${FRONT_BASE}/failure.html`
      }
      // Luego de comprobar que esas URLs cargan, puedes activar:
      // ,auto_return: 'approved'
    };

    const result = await preference.create({ body: prefBody });
    res.json({ preferenceId: result.id, init_point: result.init_point });
  } catch (e) {
    console.error('Error MP create_preference:', e?.message);
    res.status(500).json({ error: 'No se pudo crear la preferencia', details: e?.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`✅ gm-pay-backup (SDK v2) corriendo en http://localhost:${PORT}`);
});
