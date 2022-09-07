const axios = require('axios');
const baseURL = "https://api.openweathermap.org/data/2.5/weather";

const gettingWeather = async (req,res)=>{
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
                console.log(error)
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
}

module.exports = {
    gettingWeather
}