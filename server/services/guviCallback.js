import fetch from "node-fetch";

export async function sendFinalResult(payload) {
  try {
    await fetch("https://hackathon.guvi.in/api/updateHoneyPotFinalResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      timeout: 5000,
    });
  } catch (err) {
    console.error("GUVI callback failed:", err.message);
  }
}
