// index.js - Servidor leve apenas com a rota /verificar-tempo

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
moment.locale('pt-br');

const app = express();
const PORT = process.env.PORT;


console.log('🟢 Iniciando servidor leve para filtro de tempo...');
process.on('uncaughtException', (err) => {
  console.error('🚨 Erro não tratado (uncaughtException):', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('🚨 Erro de promessa não tratada (unhandledRejection):', reason);
});

app.use(bodyParser.json());

// Rota simples para teste no navegador
app.get('/', (req, res) => {
  res.send('Servidor de filtro de tempo rodando!');
});

// Rota principal: /verificar-tempo
app.post('/verificar-tempo', (req, res) => {
  const timestampRecebido = req.body.timestamp;

  if (!timestampRecebido) {
    return res.status(400).json({ erro: 'Timestamp não fornecido' });
  }

  try {
    const dataComentario = moment.tz(timestampRecebido, "D [de] MMMM [de] YYYY [às] H:mm", 'America/Sao_Paulo');
    const agora = moment.tz('America/Sao_Paulo');
    const limite = agora.subtract(10, 'minutes');

    const podeResponder = dataComentario.isAfter(limite);

    console.log(`[${new Date().toISOString()}] ⏱️ Timestamp recebido: ${timestampRecebido}`);
    console.log(`🧠 Interpretado como: ${dataComentario.format()}`);
    console.log(`🔎 Pode responder? ${podeResponder}`);

    res.json({ podeResponder });
  } catch (err) {
    console.error('Erro ao processar timestamp:', err);
    res.status(500).json({ erro: 'Erro ao processar timestamp' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de tempo rodando na porta ${PORT}`);
  setInterval(() => {}, 1000 * 60 * 60); // Mantém Railway ativo
});
