const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const app = express();
const path = require('path');

const baseURL = "https://api.openweathermap.org/data/2.5/weather";

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(express.static(path.join(__dirname, "frontend", "build")))

// app.get("/", (req, res) => {
//     res.sendFile(__dirname, "frontend", "build", "index.html")
// });


//Weather data based on cords
// app.post("/", async (req,res)=>{
//     const {long,lat} = req.body;
//     console.log("On request to / :" + long,lat);

//     try {
//              https://api.openweathermap.org/data/2.5/weather?lat=75.53&lon=31.33&appid=3601743b42e8a72e1ebd7e130951aea7&units=metric
//         const {data} = await axios.get(`${baseURL}?lat=${lat}&lon=${long}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
//         console.log(data.name)
//         console.log(data.main);
//         const fData = {
//             sky : data.weather[0].main,
//             temp : data.main.temp,
//         }
//         res.status(200).json(fData)
//     } catch (error) {
//         console.log(error.code);
//         if (error.code == "ERR_UNESCAPED_CHARACTERS") {
//             console.log(error.code);
//             res.status(401).json({ msg: "Error! Unescaped characters" })
//         }else{
//             res.status(500).json({msg: `${error.code}`})
//         }
//         if (error.response.data) {
//             if (error.response.data.cod == 404) {
//                 console.log(error.response.data.cod)
//                 res.status(404).json({ msg: 'City not found' })
//             } else {
//                 res.status(500).json({ msg: "Server error" });
//             }
//         }
//     }
// })

// On searching a city
app.post("/weather", async (req, res) => {
    const { input:city } = req.body;
    if (city === "") {
        res.status(400).json({ msg: "Cannot be blank" })
        return;
    }
    try {
        const { data } = await axios.get(`${baseURL}?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        const fData = {
            sky: data.weather[0].main,
            temp: data.main.temp,
            name: data.name
        }
        res.status(200).json(fData)
    } catch (error) {
        if (!error.response) {
            if (error.code == "ERR_UNESCAPED_CHARACTERS") {
                console.log(error.code);
                res.status(401).json({ msg: "Error! Unescaped characters" })
            } else {
                res.status(500).json({ msg: `${error.code}` });
            }
            return;
        }
        if (error.response.data) {
            if (error.response.data.cod == 404) {
                console.log(error.response.data.cod)
                res.status(404).json({ msg: 'City not found' })
            } else {
                res.status(500).json({ msg: "Server error" });
            }
        }
    }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})