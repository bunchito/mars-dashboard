require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/', async (req, res) => {
    const { rover } = req.query
    console.log(rover)
    try {
        //let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2020-08-26&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            console.log(image)
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})


app.get('/rovers', async (req, res) => {
    const { rover } = req.query
    try {
        // Since rubric says later, I will using `latest_photos`. I could do it more user friendly adding a parameter to handle this.
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(response => response.json())

        // I want my back-end to JUST retrieve 10 results from the original payload
        //console.log(data)
        const { latest_photos}  = data
        res.send({ data: latest_photos.slice(0,10) })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))