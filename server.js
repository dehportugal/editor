const express = require('express');
const path = require('path');
const app = express();

// Serve os arquivos estáticos do diretório build
app.use(express.static(path.join(__dirname, 'build')));

// Manipula qualquer pedido que não corresponda aos anteriores
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta: ${port}`);
});
