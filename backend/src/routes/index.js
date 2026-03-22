const express = require("express");
const {
  healthCheck,
  supabaseHealthCheck,
} = require("../controllers/healthController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/health", healthCheck);
router.get("/health/supabase", supabaseHealthCheck);

module.exports = router;
