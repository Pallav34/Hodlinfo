require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const { Client } = require('pg');
const app = express();
const port = 3000;
const cors = require('cors');


const pgclient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});


pgclient.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

  app.use(cors());


app.get('/update-cryptos', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    
    await pgclient.query('DELETE FROM top_cryptos');

    for (const ticker of tickers) {
      await pgclient.query(
        'INSERT INTO top_cryptos (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit]
      );
    }

    res.send('Data updated successfully');
  } catch (error) {
    console.error('Error fetching or storing data', error);
    res.status(500).send('Error fetching or storing data');
  }
});


app.get('/cryptos', async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM top_cryptos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).send('Error fetching data');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
