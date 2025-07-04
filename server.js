import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { APIs } from "../api/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:9000",
      "https://localhost:9000",
      "http://127.0.0.1:9000",
      "https://127.0.0.1:9000",
    ],
    credentials: true,
  })
);

// 🚨 Variables
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

// 🚨 Requests
const proxyDomian = async (req, endpoint, params) => {
  const token = req.headers.authorization?.split(" ")[1];
  const queryParams = new URLSearchParams(params || {}).toString();
  const url =  `${BASE_URL}/${endpoint}${queryParams ? `?${queryParams}` : ""}`

  console.log(url, 'jjj')

  const res = await fetch(
    `${BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ""}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      params: new URLSearchParams(params || {}),
    }
  );

  const data = await res.json(); // parse the response body

  if (!res.ok) {
    // Pass actual error message and status from Wakatime
    const error = new Error(data?.error || "WakaTime API error");
    error.status = res.status;
    error.details = data;
    throw error;
  }

  return data;
};

const handleError = (res, err) => {
  console.error("Spotify error:", err.details || err.message);
  return res.status(err.status || 500).json({
    error: err.message,
    details: err.details || null,
  });
};

// 🚨 USER 🚨

// 🚨 TOP TRACKS
app.get(APIs.topUserTracks, async (req, res) => {
  try {
    const data = await proxyDomian(req, APIs.topUserTracks);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

//////////////

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
