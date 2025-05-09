const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIENT_ID = 'ASWo4qldedPcohVu-2l1tN3CLpSWaOQRA5J9U5RqC-ihJO7JtiO3JZqAFV5xwionKCLP000Nm6LaGSWZ';
const SECRET = 'EEzNIyaSi4R9scuSLh0eoroYcxbFaj4OIz2oZcZqVWAvhLSzQb8oY0iVg_iUYHW-rwX9V8aazCvhlCRX';
const baseURL = 'https://api-m.sandbox.paypal.com'; // Cambia a live para producción

// Obtener token de acceso
async function getAccessToken() {
  const response = await axios({
    url: `${baseURL}/v1/oauth2/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: CLIENT_ID,
      password: SECRET,
    },
    data: 'grant_type=client_credentials',
  });
  return response.data.access_token;
}

// Obtener historial de transacciones
router.get('/get-transactions', async (req, res) => {
  const { startDate, endDate } = req.query;  // Fechas de inicio y fin (ej. 2023-01-01)

  try {
    const accessToken = await getAccessToken();

    // Llamamos al endpoint de PayPal para obtener las transacciones
    const response = await axios.get(
      `${baseURL}/v1/reporting/transactions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          start_date: startDate,  // Fecha de inicio en formato ISO 8601
          end_date: endDate,  // Fecha de fin en formato ISO 8601
        }
      }
    );

    // Enviar las transacciones al frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener transacciones:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener el historial de transacciones' });
  }
});

module.exports = router;