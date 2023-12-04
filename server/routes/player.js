// routes/player.js
const express = require("express");
const { ObjectId } = require("mongodb");
const conn = require("../db/conn");

const playerRoutes = express.Router();

playerRoutes.get("/randomPlayers/:count?", async (req, res) => {
  try {
    const count = req.params.count || 11;
    const numberOfEntries = parseInt(count, 10);

    const db = conn.getDb();
    const randomPlayers = await db
      .collection("players")
      .aggregate([{ $sample: { size: numberOfEntries } }])
      .toArray();
    res.json(randomPlayers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = playerRoutes;
