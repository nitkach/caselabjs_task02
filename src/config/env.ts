import dotenv from "dotenv";

dotenv.config();

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
    port: Number(process.env.PORT ?? 3000),
    corsOrigins,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
    jsonBodyLimit: process.env.JSON_BODY_LIMIT ?? "2mb",
    urlEncodedBodyLimit: process.env.URL_ENCODED_BODY_LIMIT ?? "10kb",
    weatherApiUrl: process.env.WEATHER_API_URL ??
        "https://api.open-meteo.com/v1/forecast",
    requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 5000),
    weatherForecastDays: Number(process.env.WEATHER_FORECAST_DAYS ?? 3),
    weatherMaxPrecipitation: Number(process.env.WEATHER_MAX_PRECIPITATION ?? 1),
    weatherMaxWindSpeedKmh: Number(
        process.env.WEATHER_MAX_WIND_SPEED_KMH ?? 30,
    ),
};
