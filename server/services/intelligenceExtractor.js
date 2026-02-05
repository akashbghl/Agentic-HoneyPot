export function extractIntel(text) {
  const upiRegex = /\b[\w.-]+@[\w]+\b/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const bankRegex = /\b\d{9,18}\b/g;

  return {
    upi_ids: text.match(upiRegex) || [],
    phishing_urls: text.match(urlRegex) || [],
    bank_accounts: text.match(bankRegex) || [],
  };
}

