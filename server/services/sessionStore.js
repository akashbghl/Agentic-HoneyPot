const sessions = new Map();

const MAX_MESSAGES_PER_SESSION = 20; // safety cap

export function getSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {
      messages: [],
      scamDetected: false,
      callbackSent: false,
      startTime: Date.now(),
      collectedIntel: {
        bank_accounts: [],
        upi_ids: [],
        phishing_urls: [],
        phone_numbers: [],
        email_addresses: [],
        suspicious_keywords: [],
      }
    });
  }
  return sessions.get(id);
}

export function addMessage(id, sender, text) {
  const session = getSession(id);

  // Prevent uncontrolled memory growth
  if (session.messages.length >= MAX_MESSAGES_PER_SESSION) {
    session.messages.shift(); // remove oldest
  }

  session.messages.push({ sender, text });
}

export function updateCollectedIntel(id, partialIntel) {
  const session = getSession(id);

  Object.keys(session.collectedIntel).forEach((key) => {
    if (partialIntel[key]) {
      session.collectedIntel[key] = [
        ...new Set([
          ...session.collectedIntel[key],
          ...partialIntel[key]
        ])
      ];
    }
  });
}

export function clearSession(id) {
  sessions.delete(id);
}