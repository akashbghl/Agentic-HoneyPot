export function extractIntel(text = "") {
  const t = String(text);

  // UPI ID (strict pattern)
  const upiRegex = /\b[a-zA-Z0-9._-]+@[a-zA-Z]{2,}\b(?![-.])/g;

  // URL (full capture including query params)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Email address
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  // Indian phone numbers (+91 or 10-digit)
  const phoneRegex = /(\+91[\s-]?\d{10}|\b\d{10}\b)/g;

  // Bank account (11–18 digits but exclude phone numbers)
  const bankRegex = /\b\d{11,18}\b/g;

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


  const phishingUrls = [...new Set(t.match(urlRegex) || [])];

  const phoneNumbers = [...new Set(t.match(phoneRegex) || [])];

  const rawBankMatches = t.match(bankRegex) || [];

  const bankAccounts = [...new Set(
    rawBankMatches.filter(num => {
      // Exclude 10-digit numbers (likely phone numbers)
      if (num.length === 10) return false;

      // Exclude numbers that appear inside phone numbers
      if (phoneNumbers.some(phone => phone.includes(num))) return false;

      return true;
    })
  )];

  const emailMatches = t.match(emailRegex);
  const emailAddresses = emailMatches ? [emailMatches[0]] : [];

  // Extract raw UPI matches
  const rawUpiMatches = t.match(upiRegex) || [];

  // Remove any UPI match that is actually an email
  const upiIds = [...new Set(
    rawUpiMatches.filter(
      upi => !emailAddresses.includes(upi)
    )
  )];
  return {
    upi_ids: upiIds,
    phishing_urls: phishingUrls,
    bank_accounts: bankAccounts,
    phone_numbers: phoneNumbers,
    email_addresses: emailAddresses,
    suspicious_keywords: [...new Set(foundKeywords)],
  };
}