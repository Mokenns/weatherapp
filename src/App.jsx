import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';

const icons = {
	thunderstorm: '⛈️',
	drizzle: '🌦️',
	rain: '🌧️',
	snow: '❄️',
	atmosphere: '〰️',
	clear: '☀️',
	clouds: '☁️',
};

const codes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

function App() {
	const [coords, setCoords] = useState(null);
	const [weather, setWeather] = useState(null);
	const [isCelsius, setIsCelsius] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		try {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCoords({
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					});
				},
				(err) => {},
			);
		} catch (error) {
			console.log('[geo api]', error);
		}
	}, []);

	useEffect(() => {
		if (coords) getWeatherData(coords);
	}, [coords]);

	const getWeatherData = async ({ lat, lon }) => {
		try {
			const res = await axios.get(
				baseUrl +
					`lat=${lat}&lon=${lon}&appid=6f19cdb875654da0c16bf22c2c4efee0`,
			);
			const codeId = res.data.weather[0].id;
			const codeKeys = Object.keys(codes);

			setWeather({
				city: res.data.name,
				country: res.data.sys.country,
				temperature: res.data.main.temp,
				main: res.data.weather[0].main,
				description: res.data.weather[0].description,
				clouds: res.data.clouds.all,
				wind: res.data.wind.speed,
				pressure: res.data.main.pressure,
				icon: icons[
					Object.keys(codes).find((key) => codes[key].includes(codeId))
				],
			});
		} catch (error) {
			console.log('[weather api]', error);
		}
	};

	if (error) return <h1>{error}</h1>;

	if (!weather) return <h1>Loading...</h1>;

	const temp = isCelsius
		? (weather.temperature - 273.15).toFixed() + '°C'
		: (((weather.temperature - 273.15) * 9) / 5 + +32).toFixed() + '°F';

	return (
		<div className="weather">
			<h1 className="weather__title">Weather App</h1>
			<p className="weather__location">
				{weather.city}, {weather.country}
			</p>

			<div className="weather__content">
				<span
					className="weather__icon"
					role="img"
					aria-label={weather.description}
					aria-hidden
				>
					{weather.icon}
				</span>
				<div className="weather__info">
					<h2 className="weather__info-item item--temp">{temp}</h2>
					<p className="weather__info-item">{weather.main}</p>
					<p className="weather__info-item">"{weather.description}"</p>
				</div>
			</div>
			<div className="weather__details">
				<p className="weather__details-item">Nubosidad {weather.clouds} %</p>
				<p className="weather__details-item">Viento {weather.wind} m/s</p>
				<p className="weather__details-item">Presión {weather.pressure} hPa</p>
			</div>
			<button
				type="button"
				className="btn"
				onClick={() => setIsCelsius(!isCelsius)}
			>
				Change to {isCelsius ? 'Fahrenheit' : 'Celsius'}
			</button>
		</div>
	);
}
export default App;
