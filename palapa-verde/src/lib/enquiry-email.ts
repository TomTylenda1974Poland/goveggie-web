export function enquiryEmailHref(email: string, subject: string, message = "") {
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  return message.trim() ? `${href}&body=${encodeURIComponent(message)}` : href;
}
