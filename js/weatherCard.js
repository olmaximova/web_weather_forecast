import { createElement } from './createElement.js';
import { dayNames } from './weather_data.js';

export class WeatherCard {
    constructor(weatherData, locationName, isCurrentLocation) {
        this.weatherData = weatherData;
        this.locationName = locationName;
        this.isCurrentLocation = isCurrentLocation;
        this.element = this.createCard();
        this.removeCallback = null;
    }

    createCard() {
        const card = createElement({ tag: 'div', className: 'weather-card' })

        card.appendChild(this.createHeader());

        if (this.weatherData.current) {
            card.appendChild(this.createCurrentWeather());
        } else {
            card.appendChild(this.createNoDataMessage());
        }

        if (this.weatherData.dailyForecasts && this.weatherData.dailyForecasts.length >= 3) {
            card.appendChild(this.createForecast());
        }

        return card;
    }

    createHeader() {
        const header = createElement({ tag: 'div', className: 'weather-header' })

        const cityNameElement = createElement({ tag: 'h2', className: 'city-name', text: this.locationName })

        header.appendChild(cityNameElement);

        if (!this.isCurrentLocation) {
            const removeBtn = createElement({
                tag: 'button',
                className: 'remove-btn',
                text: 'x',
                attributes: {
                    'aria-label': `Удалить ${this.locationName}`
                }
            })

            removeBtn.addEventListener('click', () => {
                if (this.removeCallback) {
                    this.removeCallback();
                }
            });

            header.appendChild(removeBtn);
        }

        return header;
    }

    createCurrentWeather() {
        const currentWeather = createElement({ tag: 'div', className: 'current-weather' });

        const temperature = createElement({
            tag: 'div',
            className: 'temperature',
            text: this.weatherData.current?.formattedTemperature || '—'
        });

        const details = createElement({ tag: 'div', className: 'weather-details' });

        const description = createElement({
            tag: 'div',
            className: 'weather-description',
            text: this.weatherData.current?.isDaytime ? 'День' : 'Ночь'
        });

        const info = createElement({ tag: 'div', className: 'weather-info' });

        const humidity = createElement({
            tag: 'span',
            text: `Влажность: ${this.weatherData.current?.humidity ?? '—'}%`
        });

        const feelsLike = createElement({
            tag: 'span',
            text: `Ощущается: ${this.weatherData.current?.formattedFeelsLike || '—'}`
        });

        const todayForecast = this.weatherData.todayForecast || [];

        if (todayForecast) {
            const windSpeed = createElement({
                tag: 'span',
                text: `Ветер: ${todayForecast.formattedWindSpeed}`
            });

            const windDir = createElement({
                tag: 'span',
                text: `Направление: ${todayForecast.formattedWindDirection}`
            });

            const precipProb = createElement({
                tag: 'span',
                text: `Вероятность осадков: ${todayForecast.formattedPrecipProbability}`
            });

            const uvIndex = createElement({
                tag: 'span',
                text: `УФ: ${todayForecast.formattedUVIndex}`
            });

            info.appendChild(humidity);
            info.appendChild(feelsLike);
            info.appendChild(windSpeed);
            info.appendChild(windDir);
            info.append(precipProb, uvIndex);
        } else {
            info.appendChild(humidity);
            info.appendChild(feelsLike);
        }

        details.appendChild(description);
        details.appendChild(info);
        currentWeather.appendChild(temperature);
        currentWeather.appendChild(details);

        return currentWeather;
    }

    createForecast() {
        const forecast = createElement({ tag: 'div', className: 'forecast' });
        const forecastTitle = createElement({ tag: 'h3', className: 'forecast-title', text: 'Прогноз на 4 дня' });
        forecast.appendChild(forecastTitle);

        const forecastDays = createElement({ tag: 'div', className: 'forecast-days' });
        const threeDayForecast = this.weatherData.threeDayForecast || [];

        threeDayForecast.forEach((dayForecast, index) => {
            const day = createElement({ tag: 'div', className: 'forecast-day' });

            const dayName = createElement({ tag: 'div', className: 'day-name', text: dayNames[index] });

            const dayTemperatures = createElement({ tag: 'div', className: 'day-temperatures' });

            const dayTempMax = createElement({
                tag: 'div',
                className: 'day-temp',
                text: `Макс. темп: ${dayForecast.formattedMaxTemperature}`
            });

            const dayTempMin = createElement({
                tag: 'div',
                className: 'day-temp',
                text: `Мин. темп: ${dayForecast.formattedMinTemperature}`
            });

            const dayInfo = createElement({ tag: 'div', className: 'day-info' });

            const precip = createElement({
                tag: 'span',
                text: `Осадки: ${dayForecast.formattedPrecipProbability}`
            });

            const windSpeed = createElement({
                tag: 'span',
                text: `Ветер: ${dayForecast.formattedWindSpeed}`
            });

            const windDir = createElement({
                tag: 'span',
                text: `Направление: ${dayForecast.formattedWindDirection}`
            });

            const uvIndex = createElement({
                tag: 'span',
                text: `УФ: ${dayForecast.formattedUVIndex}`
            });

            dayTemperatures.appendChild(dayTempMax);
            dayTemperatures.appendChild(dayTempMin);

            dayInfo.appendChild(precip);
            dayInfo.appendChild(windSpeed);
            dayInfo.appendChild(windDir);
            dayInfo.appendChild(uvIndex);

            day.appendChild(dayName);
            day.appendChild(dayTemperatures);
            day.appendChild(dayInfo);

            forecastDays.appendChild(day);
        });

        forecast.appendChild(forecastDays);
        return forecast;
    }


    createNoDataMessage() {
        const noData = createElement({ tag: 'div', className: 'no-data', text: 'Неи данных о погоде' });
        return noData;
    }

    getElement() {
        return this.element;
    }

    setRemoveCallback(callback) {
        this.removeCallback = callback;
    }
}