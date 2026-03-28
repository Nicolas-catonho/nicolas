// api/db.js — Banco de dados permanente via Vercel KV (Redis)
// Documentação: https://vercel.com/docs/storage/vercel-kv

const { kv } = require("@vercel/kv");

// Prefixo para isolar as chaves da loja
const PREFIX = "guerreiros:";

module.exports = async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── Autenticação simples por header (opcional, para segurança extra) ──────
  // Se quiser ativar, defina a env var API_SECRET no Vercel e
  // adicione o header "Authorization: Bearer <seu-segredo>" nas chamadas.
  const secret = process.env.API_SECRET;
  if (secret) {
    const auth = req.headers["authorization"] || "";
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    // ── GET ?key=<chave> ───────────────────────────────────────────────────
    if (req.method === "GET") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "Parâmetro 'key' obrigatório" });

      const value = await kv.get(PREFIX + key);
      return res.status(200).json({ value: value ?? null });
    }

    // ── POST { key, value } ────────────────────────────────────────────────
    if (req.method === "POST") {
      const { key, value } = req.body ?? {};
      if (!key) return res.status(400).json({ error: "Campo 'key' obrigatório" });

      // TTL: 365 dias (renovado a cada escrita)
      await kv.set(PREFIX + key, value, { ex: 60 * 60 * 24 * 365 });
      return res.status(200).json({ ok: true });
    }

    // ── DELETE ?key=<chave> ────────────────────────────────────────────────
    if (req.method === "DELETE") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "Parâmetro 'key' obrigatório" });

      await kv.del(PREFIX + key);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Método não permitido" });

  } catch (err) {
    console.error("[api/db] Erro:", err);
    // Retorna erro 500 mas não expõe detalhes sensíveis
    return res.status(500).json({ error: "Erro interno. Verifique se o Vercel KV está configurado." });
  }
};
