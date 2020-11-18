const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const uid2 = require("uid2");
const md5 = require("md5");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

app.get("/comics", async (req, res) => {
  const ts = uid2(16);
  const publicApiKey = process.env.MARVEL_PUBLIC_APIKEY;
  const privateApiKey = process.env.MARVEL_PRIVATE_APIKEY;
  const hash = md5(ts + privateApiKey + publicApiKey);
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicApiKey}&hash=${hash}`
    );

    res.status(200).json(response.data.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post("/characters", async (req, res) => {
  const ts = uid2(16);
  const publicApiKey = process.env.MARVEL_PUBLIC_APIKEY;
  const privateApiKey = process.env.MARVEL_PRIVATE_APIKEY;
  const hash = md5(ts + privateApiKey + publicApiKey);
  try {
    const { limit, skip } = req.fields;

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${skip}&ts=${ts}&apikey=${publicApiKey}&hash=${hash}`
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.all("*", (req, res) => {});

app.listen(process.env.PORT, () => {
  console.log("Server has started ...");
});
