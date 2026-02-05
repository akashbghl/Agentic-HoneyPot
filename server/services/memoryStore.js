const conversations = {};

export function getHistory(id) {
  if (!conversations[id]) conversations[id] = [];
  return conversations[id];
}

export function saveMessage(id, userMsg, agentReply) {
  conversations[id].push({
    user: userMsg,
    agent: agentReply,
  });
}

