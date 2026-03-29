const healthCheck = (req, res) => {
  res.status(200).json({ status: "ok" });
};

const supabaseHealthCheck = async (req, res) => {
  let supabase;

  try {
    ({ supabase } = require("../services/supabase"));
  } catch (error) {
    return res.status(503).json({
      status: "error",
      service: "supabase",
      message: error.message,
    });
  }

  try {
    const { error } = await supabase
      .from("ergast_constructors")
      .select("id", { head: true, count: "exact" });

    if (error) {
      return res.status(503).json({
        status: "error",
        service: "supabase",
        message: error.message,
      });
    }

    return res.status(200).json({
      status: "ok",
      service: "supabase",
      message: "Supabase connection is valid.",
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      service: "supabase",
      message: error.message,
    });
  }
};

module.exports = { healthCheck, supabaseHealthCheck };
