const express = require("express");
const path = require("path");
const cors = require("cors");

const sequelize = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

app.use(routes);

const rebuild = process.argv[2] === "--rebuild";
const syncOptions = rebuild
  ? { force: true }
  : process.env.NODE_ENV === "production"
    ? {}
    : { alter: true };

sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});
