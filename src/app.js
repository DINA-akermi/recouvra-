const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");


const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));


const app = express();


app.use(cors());
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clients", require("./routes/clients.routes"));
app.use("/api/factures", require("./routes/factures.routes"));
app.use("/api/paiements", require("./routes/paiements.routes"));
app.use("/api/stats", require("./routes/stats.routes"));
app.use("/api/actions", require("./routes/actions.routes"));


app.get("/", (req, res) => {
  res.send(
    "  <br><a href='/api-docs'>Voir la documentation Swagger</a>"
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    message: "Erreur serveur",
    error: err.message || err,
  });
});


module.exports = app;