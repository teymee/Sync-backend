import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { APIs } from "./api.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:9000",
      "https://localhost:9000",
      "http://127.0.0.1:9000",
      "https://127.0.0.1:9000",
      "https://sync-frontend-26il.vercel.app",
    ],
    credentials: true,
  }),
);

// 🚨 Variables
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

// 🚨 Requests
const proxyDomian = async (req, endpoint, params) => {
  const token = req.headers.authorization?.split(" ")[1];
  const queryParams = new URLSearchParams(params || {}).toString();
  const url = `${BASE_URL}/${endpoint}${queryParams ? `?${queryParams}` : ""}`;


  const res = await fetch(
    `${BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ""}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      params: new URLSearchParams(params || {}),
    },
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

// 🚨 ARTIST ALBUM
app.get(APIs.artistAlbums.base, async (req, res) => {
  console.log(req.query, "there");
 
  const { id } = req.query;
  const params ={
    include_groups:'album'
  }
  

  try {
    const data = await proxyDomian(req, APIs.artistAlbums.api(id), params);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});


// 🚨 ARTIST DETAILS
app.get(APIs.artistDetails.base, async (req, res) => {
  console.log(req.query, "there");
 
  const { id } = req.query;

  

  try {
    const data = await proxyDomian(req, APIs.artistDetails.api(id));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

// 🚨 TOP TRACKS
app.get(APIs.topUserItems.base, async (req, res) => {
  const items = req.query;
  const params = {
    time_range: items?.time_range,
    limit:50
  };

  try {
    const data = await proxyDomian(req, APIs.topUserItems.api(items), params);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

//////////////

// 🚨 AUDIO 🚨
app.get(APIs.audioFeature.base, async (req, res) => {
  const { trackId } = req.query;
  try {
    const data = await proxyDomian(req, APIs.audioFeature.api(trackId));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
