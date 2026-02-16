export function extractIntel(text = "") {
  const t = String(text);

  // UPI ID (strict pattern)
  const upiRegex = /\b[a-zA-Z0-9._-]+@[a-zA-Z]{2,}\b/g;

  // URL (full capture including query params)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Email address
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  // Indian phone numbers (+91 or 10-digit)
  const phoneRegex = /(\+91[\s-]?\d{10}|\b\d{10}\b)/g;

  // Bank account (9–18 digits but exclude phone numbers)
  const bankRegex = /\b\d{9,18}\b/g;

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
    "otp",
  ];

  const foundKeywords = keywordsList.filter((k) =>
    t.toLowerCase().includes(k)
  );

  const upiIds = [...new Set(t.match(upiRegex) || [])];

  const phishingUrls = [...new Set(t.match(urlRegex) || [])];

  const phoneNumbers = [...new Set(t.match(phoneRegex) || [])];

  const bankAccounts = [...new Set(
    (t.match(bankRegex) || []).filter(
      (num) => !phoneNumbers.includes(num) // avoid duplicating phone as bank
    )
  )];

  const emailMatches = t.match(emailRegex);
  const emailAddresses = emailMatches ? [emailMatches[0]] : [];

  return {
    upi_ids: upiIds,
    phishing_urls: phishingUrls,
    bank_accounts: bankAccounts,
    phone_numbers: phoneNumbers,
    email_addresses: emailAddresses,
    suspicious_keywords: [...new Set(foundKeywords)],
  };
}