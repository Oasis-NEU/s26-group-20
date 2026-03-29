const express = require("express");
const {
  healthCheck,
  supabaseHealthCheck,
} = require("../controllers/healthController");
const { carsDriversData } = require("../controllers/carsDriversController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/health", healthCheck);
router.get("/health/supabase", supabaseHealthCheck);
router.get("/cars-drivers", carsDriversData);

module.exports = router;
