const COUNTRY_CODE_BY_NATIONALITY = {
  british: "GB",
  german: "DE",
  french: "FR",
  italian: "IT",
  spanish: "ES",
  dutch: "NL",
  finnish: "FI",
  australian: "AU",
  mexican: "MX",
  thai: "TH",
  canadian: "CA",
  danish: "DK",
  monegasque: "MC",
  monacan: "MC",
  japanese: "JP",
  chinese: "CN",
  argentine: "AR",
  austrian: "AT",
  newzealand: "NZ",
  new_zealand: "NZ",
  swiss: "CH",
  belgian: "BE",
  brazilian: "BR",
  american: "US",
  us: "US",
};

function countryCodeToFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "";
  const upperCode = countryCode.toUpperCase();
  const first = upperCode.codePointAt(0) - 65 + 0x1f1e6;
  const second = upperCode.codePointAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(first, second);
}

const KNOWN_2024_DRIVERS = new Set([
  "max verstappen",
  "sergio perez",
  "lewis hamilton",
  "george russell",
  "charles leclerc",
  "carlos sainz",
  "lando norris",
  "oscar piastri",
  "fernando alonso",
  "lance stroll",
  "esteban ocon",
  "pierre gasly",
  "alexander albon",
  "logan sargeant",
  "yuki tsunoda",
  "daniel ricciardo",
  "valtteri bottas",
  "zhou guanyu",
  "kevin magnussen",
  "nico hulkenberg",
]);

const KNOWN_2024_CONSTRUCTORS = [
  "Red Bull",
  "Ferrari",
  "Mercedes",
  "McLaren",
  "Aston Martin",
  "Alpine",
  "Williams",
  "Haas",
  "RB",
  "Kick Sauber",
];

const TEAM_ACCENT_BY_NAME = {
  ferrari: "#4a0c11",
  mercedes: "#1c3b3a",
  "red bull": "#1a2d4f",
  mclaren: "#4d2816",
  "aston martin": "#13342a",
  alpine: "#1c2956",
  williams: "#1b3d5b",
  haas: "#492125",
  rb: "#21274b",
  "kick sauber": "#1b3f21",
};

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  const normalized = normalize(value);
  return ["1", "true", "yes", "y", "active"].includes(normalized);
}

function pickValue(record, keys, fallback = null) {
  for (const key of keys) {
    if (record && record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }
  return fallback;
}

function resolveFlag(nationality) {
  const key = normalize(nationality).replace(/\s+/g, "_");
  const countryCode =
    COUNTRY_CODE_BY_NATIONALITY[key] || COUNTRY_CODE_BY_NATIONALITY[normalize(nationality)] || "UN";

  return countryCodeToFlag(countryCode) || "??";
}

function normalizeDriverRecord(record) {
  const id = String(
    pickValue(record, ["driver_id", "id", "driverId", "driverid", "driver_ref", "driverRef"], ""),
  );
  const firstName = pickValue(record, ["forename", "first_name", "firstName"], "");
  const lastName = pickValue(record, ["surname", "last_name", "lastName"], "");
  const fullName =
    pickValue(record, ["full_name", "driver_name", "name", "fullName"], "") ||
    `${firstName} ${lastName}`.trim();
  const code =
    pickValue(record, ["code", "driver_code", "abbreviation", "short_code"], "") ||
    fullName.split(" ").slice(-1)[0].slice(0, 3).toUpperCase();

  const nationality = String(
    pickValue(record, ["nationality", "country", "country_name", "nation"], "Unknown"),
  );

  const championships = toNumber(
    pickValue(record, ["championships_count", "championships", "wdc_titles", "world_championships"], 0),
  );
  const wins = toNumber(pickValue(record, ["race_wins", "wins", "career_wins"], 0));
  const poles = toNumber(pickValue(record, ["pole_positions", "poles", "career_poles"], 0));
  const points = toNumber(
    pickValue(record, ["points", "career_points", "total_points"], 0),
  );
  const entries = toNumber(
    pickValue(record, ["race_entries", "entries", "starts", "grand_prix_entries", "total_entries"], 0),
  );
  const winRate = toNumber(
    pickValue(record, ["win_rate", "career_win_rate", "wins_rate"], 0),
  );

  const active =
    toBool(pickValue(record, ["is_active", "active", "on_grid", "current_grid_2024"], false)) ||
    KNOWN_2024_DRIVERS.has(normalize(fullName));

  return {
    id: id || slugify(fullName),
    name: fullName,
    code: String(code || "UNK").toUpperCase(),
    nationality,
    flag: resolveFlag(nationality),
    championships,
    wins,
    poles,
    points,
    entries,
    winRate,
    active,
    slug: slugify(fullName),
  };
}

function normalizeConstructorRecord(record) {
  const name = String(pickValue(record, ["name", "constructor_name"], "")).trim();
  const nationality = String(
    pickValue(record, ["nationality", "country", "country_name"], "Unknown"),
  );
  const normalizedName = normalize(name);

  return {
    id: String(pickValue(record, ["constructorid", "constructor_id", "id"], slugify(name))),
    name,
    nationality,
    flag: resolveFlag(nationality),
    slug: slugify(name),
    accentColor: TEAM_ACCENT_BY_NAME[normalizedName] || "#2a1014",
  };
}

function mergeDriverWithStats(driverRows, statsRows) {
  const statsByDriverId = new Map();

  for (const row of statsRows) {
    const key = String(
      pickValue(row, ["driver_id", "driverid", "id", "driver_ref", "driverRef"], ""),
    );
    if (key) statsByDriverId.set(key, row);
  }

  return driverRows.map((driver) => {
    const key = String(
      pickValue(driver, ["driver_id", "driverid", "id", "driver_ref", "driverRef"], ""),
    );
    const stats = statsByDriverId.get(key) || {};
    return { ...driver, ...stats };
  });
}

async function fetchDriverRows(supabase) {
  const viewResult = await supabase.from("v_driver_full").select("*");
  if (!viewResult.error && Array.isArray(viewResult.data) && viewResult.data.length > 0) {
    return viewResult.data;
  }

  const driversResult = await supabase.from("drivers").select("*");
  if (driversResult.error) {
    throw new Error(viewResult.error?.message || driversResult.error.message || "Unable to fetch drivers.");
  }

  const statsResult = await supabase.from("driver_stats").select("*");
  if (!statsResult.error && Array.isArray(statsResult.data)) {
    return mergeDriverWithStats(driversResult.data || [], statsResult.data);
  }

  return driversResult.data || [];
}

async function fetchConstructorRows(supabase) {
  const result = await supabase.from("ergast_constructors").select("*");
  if (result.error) {
    throw new Error(result.error.message || "Unable to fetch constructors.");
  }
  return result.data || [];
}

function buildPayload(driverRows, constructorRows) {
  const drivers = driverRows.map(normalizeDriverRecord).filter((driver) => driver.name);
  const constructors = constructorRows
    .map(normalizeConstructorRecord)
    .filter((team) => team.name)
    .filter((team) =>
      KNOWN_2024_CONSTRUCTORS.some((known) => normalize(known) === normalize(team.name)),
    );

  const uniqueDriverIds = new Set(drivers.map((driver) => driver.id));
  const worldChampions = new Set(
    drivers.filter((driver) => driver.championships > 0).map((driver) => driver.id),
  );

  const currentGrid = drivers
    .filter((driver) => driver.active)
    .sort((a, b) => b.wins - a.wins || b.points - a.points)
    .slice(0, 20)
    .map((driver) => ({
      ...driver,
      profileUrl: `/drivers/${driver.slug}`,
    }));

  const allTimeLeaders = [...drivers]
    .sort((a, b) => b.wins - a.wins || b.poles - a.poles || b.points - a.points)
    .slice(0, 20)
    .map((driver, index) => ({
      rank: index + 1,
      ...driver,
      profileUrl: `/drivers/${driver.slug}`,
    }));

  const constructors2024 = constructors.map((team) => ({
    ...team,
    profileUrl: `/constructors/${team.slug}`,
  }));

  return {
    summary: {
      totalDrivers: uniqueDriverIds.size,
      active2024: currentGrid.length,
      totalConstructors: constructorRows.length,
      worldChampions: worldChampions.size,
    },
    currentGrid,
    allTimeLeaders,
    constructors2024,
  };
}

async function carsDriversData(req, res) {
  let supabase;

  try {
    ({ supabase } = require("../services/supabase"));
  } catch (error) {
    return res.status(503).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const [driverRows, constructorRows] = await Promise.all([
      fetchDriverRows(supabase),
      fetchConstructorRows(supabase),
    ]);

    const payload = buildPayload(driverRows, constructorRows);

    return res.status(200).json({
      status: "ok",
      ...payload,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch Cars & Drivers data.",
    });
  }
}

module.exports = {
  carsDriversData,
};
