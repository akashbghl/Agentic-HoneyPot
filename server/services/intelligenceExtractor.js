export function extractIntel(text = "") {
  const t = String(text);

  const upiRegex = /\b[\w.-]+@[\w]+\b/gi;

  const urlRegex = /(https?:\/\/[^\s]+)/gi;

  const bankRegex = /\b\d{9,18}\b/g;

  const phoneRegex = /(\+91[\s-]?\d{10}|\b\d{10}\b)/g;

  const keywordsList = [
    "urgent",
    "verify",
    "suspend",
    "blocked",
    "kyc",
    "update",
    "immediately",
    "reward",
    "lottery",
    "prize",
    "click",
    "link",
    "account",
    "payment",
  ];

  const foundKeywords = keywordsList.filter((k) =>
    t.toLowerCase().includes(k)
  );

  return {
    upi_ids: [...new Set(t.match(upiRegex) || [])],
    phishing_urls: [...new Set(t.match(urlRegex) || [])],
    bank_accounts: [...new Set(t.match(bankRegex) || [])],
    phone_numbers: [...new Set(t.match(phoneRegex) || [])],
    suspicious_keywords: [...new Set(foundKeywords)],
  };
}
