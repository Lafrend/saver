const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/getImage', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(blob);
  } catch (error) {
    console.error('Ошибка при получении изображения:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
