import fetch from "node-fetch";

export async function sendFinalResult(payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      "https://hackathon.guvi.in/api/updateHoneyPotFinalResult",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("GUVI callback responded with status:", response.status);
    }

  } catch (err) {
    console.error("GUVI callback failed:", err.message);
  }
}