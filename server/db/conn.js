// const { MongoClient } = require("mongodb");
// const Db = process.env.ATLAS_URI;
// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// let _db;

// module.exports = {
//   connectToServer: async function (callback) {
//     try {
//       await client.connect();
//       console.log("Connected to MongoDB");
//     } catch (e) {
//       console.error(e);
//     }

//     _db = client.db("nba-pre-order");

//     return _db === undefined ? false : true;
//   },
//   getDb: function () {
//     return _db;
//   },
// };

const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("nba-pre-order");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
