// routes/player.js
const express = require("express");
const conn = require("../db/conn");

const playerRoutes = express.Router();

playerRoutes.get("/randomPlayers/:count?/:type?", async (req, res) => {
  try {
    const count = req.params.count || 11;
    const type = req.params.type || "PTS";
    const numberOfEntries = parseInt(count, 10);

    const db = conn.getDb();
    const randomPlayers = await db
      .collection("player-stats")
      .aggregate([{ $sample: { size: numberOfEntries } }])
      .toArray();

    const filteredPlayer = randomPlayers.map((player) => ({
      player_name: player.player_name,
      player_id: player.player_id,
      rating: player.stats[type] ?? null,
    }));
    res.json(filteredPlayer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = playerRoutes;
