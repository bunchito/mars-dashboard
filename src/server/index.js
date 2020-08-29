require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

const nasaAPI = `https://api.nasa.gov/mars-photos/api/v1`

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/rovers/manifests', (req, res) => {
  console.log(`Fetching from NASA > Manifest`)
  const {
    rovers
  } = req.query

  // Don't want to cast the previous string into an array directly
  const roversArr = rovers.split(',')
  console.log(roversArr)


  try {
    // let manifest = roversArr.map(async (eachRover) => {
    //   console.log(eachRover)
    //   let data = await fetch(`${nasaAPI}/manifests/${eachRover}?api_key=${process.env.API_KEY}`)
    //   .then(response => response.json())
    //   manifest.push({ data })

    let manifest = []

    // Promise.all(
    //   roversArr.map(eachRover => {
    //     return fetch(`${nasaAPI}/manifests/${eachRover}?api_key=${process.env.API_KEY}`)
    //       .then(response => response.json())
    //   })
    // )
    //   .then((manifests) => {
    //     //console.log(values);
    //     return manifests.map(eachManifest => {
    //       console.log(manifest)
    //       manifest.push(1)
    //       const { name, landing_date } = eachManifest.photo_manifest
    //       const newElement = {
    //         name,
    //         landing_date
    //       }
    //       console.log(name, landing_date)
    //       return manifest
    //     })
    // });

    // const promises = roversArr.map(eachRover => {
    //   return fetch(`${nasaAPI}/manifests/${eachRover}?api_key=${process.env.API_KEY}`)
    //   .then(response => response.json())
    // })

    // Promise.all(promises).then(results => {
    //  console.log(results)
    // });

    res.send({
      data: [1,2]
    })


  } catch (err) {
    console.log('error:', err);
  }
})


app.get('/rovers/:rover', async (req, res) => {
  const {
    rover
  } = req.params
  console.log(`Fetching from NASA > Rovers > ${rover}`)
  try {
    // Since rubric says later, I will using `latest_photos`. I could do it more user friendly adding a parameter to handle this.
    const data = await fetch(`${nasaAPI}/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
      .then(response => response.json())

    // I want my back-end to JUST retrieve 10 results from the original payload
    //console.log(data)
    const {
      latest_photos
    } = data
    res.send({
      data: latest_photos.slice(0, 10)
    })
  } catch (err) {
    console.log('error:', err);
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))