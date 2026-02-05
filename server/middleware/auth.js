export function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key || key !== process.env.HONEYPOT_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
