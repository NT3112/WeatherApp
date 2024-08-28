import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const weatherBackgrounds = {
  Clear: "url('/sunny.webp')",
  Clouds: "url('/cloudy.jpg')",
  Rain: "url('/rainy.jpeg')",
  Snow: "url('/snowy.jp')",
  Thunderstorm: "url('/SEI_189745988.webp')",
  Drizzle: "url('/drizzle.jpg')",
  Mist: "url('/blue-mist.jpg')",
};
function capitalizeWord(string)
{
  return string.charAt(0).toUpperCase()+string.slice(1);
}
function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [cardSize, setCardSize] = useState('medium');
  const [background, setBackground] = useState(null);
  const apiKey = 'af076e96e49d6d027386cd392f84567d';

  useEffect(() => {
    if (weatherData) {
      const condition = weatherData.weather[0].main;
      setBackground(weatherBackgrounds[condition] || weatherBackgrounds.Clear);
    } else {
      setBackground(null);
    }
  }, [weatherData]);

  const getCityWeather = async () => {
    if (city.trim()) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        setWeather(response.data);
        setError(null);
        setCardSize('large');
      } catch (err) {
        setError('City not found. Please enter a valid city.');
        setWeather(null);
      }
    } else {
      setError('Please enter a city name.');
      setWeather(null);
    }
  };

  return (
    <div className="app-container">
      <div
        id="card"
        style={{
          backgroundImage: background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Card style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Card.Img variant="top" className='img-weather' src={`${process.env.PUBLIC_URL}/images.png`} />
          <Card.Body>
            <Card.Title>
              <h1 className='img-weather'>Weather App</h1>
            </Card.Title>
            <Card.Text>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter the city"
                className="city-input"
              />
            </Card.Text>
            <Button variant="dark" onClick={getCityWeather} className="get-weather-btn">
              Get Weather
            </Button>
          </Card.Body>

          {error && <p className="error-message">{error}</p>}

          {weatherData && (
            <div className="weather-info">
              <h2>{weatherData.name}</h2>
              <h3>{capitalizeWord(weatherData.weather[0].description)}</h3>
              <h3>Temperature: {weatherData.main.temp}°C</h3>
              <h3>Humidity: {weatherData.main.humidity}%</h3>
              <h3>Wind Speed: {weatherData.wind.speed} m/s</h3>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
