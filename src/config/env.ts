import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT ?? 3000),
    weatherApiUrl: process.env.WEATHER_API_URL ??
        "https://api.open-meteo.com/v1/forecast",
    requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 5000),
    weatherForecastDays: Number(process.env.WEATHER_FORECAST_DAYS ?? 3),
    weatherMaxPrecipitation: Number(process.env.WEATHER_MAX_PRECIPITATION ?? 1),
    weatherMaxWindSpeedKmh: Number(
        process.env.WEATHER_MAX_WIND_SPEED_KMH ?? 30,
    ),
};
