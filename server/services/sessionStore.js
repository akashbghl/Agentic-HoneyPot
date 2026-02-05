const sessions = new Map();

export function getSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {
      messages: [],
      scamDetected: false,
      callbackSent: false,
    });
  }
  return sessions.get(id);
}

export function addMessage(id, sender, text) {
  const s = getSession(id);
  s.messages.push({ sender, text });
}
