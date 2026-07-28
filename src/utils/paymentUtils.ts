// Utility functions for payment processing

export const formatCardNumber = (value: string): string => {
  // Remove all non-digit characters
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  // Add space every 4 digits
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

export const formatExpiryDate = (value: string): string => {
  // Remove all non-digit characters
  const v = value.replace(/\D/g, '');
  
  // Add slash after 2 digits
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  
  return v;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and check if it's 13-19 digits
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

export const validateExpiryDate = (expiry: string): boolean => {
  // Check format MM/YY
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(expiry)) return false;
  
  // Check if date is in the future
  const [month, year] = expiry.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

export const validateCVC = (cvc: string): boolean => {
  // CVC should be 3 or 4 digits
  return /^\d{3,4}$/.test(cvc);
};
