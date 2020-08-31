require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

const nasaAPI = `https://api.nasa.gov/mars-photos/api/v1`;

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/rovers/manifests', async (req, res) => {
  const { rovers } = req.query;

  // Don't want to cast the previous string into an array directly
  const roversArr = rovers.split(',');

  try {
    const promises = roversArr.map(eachRover => {
      return fetch(
        `${nasaAPI}/manifests/${eachRover}?api_key=${process.env.API_KEY}`
      )
        .then(response => response.json())
        .catch(err => console.log(err));
    });

    const manifests = await Promise.all(promises).then(results => {
      return results;
    });

    const parsedManifests = manifests.reduce((acc, item) => {
      const {
        name,
        landing_date,
        launch_date,
        status,
        total_photos
      } = item.photo_manifest;
      acc[name] = {
        landing_date,
        launch_date,
        status,
        total_photos
      };
      return acc;
    }, {});

    res.send({
      data: parsedManifests
    });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/rovers/:rover', async (req, res) => {
  const { rover } = req.params;
  try {
    // Since rubric says later, I will using `latest_photos`. I could do it more user friendly adding a parameter to handle this.
    const data = await fetch(
      `${nasaAPI}/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
    ).then(response => response.json());

    // I want my back-end to JUST retrieve 10 results from the original payload
    const { latest_photos } = data;
    res.send({
      data: latest_photos.slice(0, 9)
    });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, listening);

function listening () {
  console.log(`Example app listening on port ${port}!`);
}