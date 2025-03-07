const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async (req, res) => {
  try {
    // Petición a la API interna (nombre del contenedor = 'api')
    const response = await axios.get('http://api:5000');
    res.send(`Respuesta desde API: ${response.data.mensaje}`);
  } catch (error) {
    res.send('Error conectándose a la API');
  }
});

app.listen(3000, () => console.log('Frontend corriendo en puerto 3000'));
