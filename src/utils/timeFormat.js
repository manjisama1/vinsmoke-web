/**
 * Time formatting utilities for Asia/Kolkata timezone
 */

// Format date to Asia/Kolkata timezone with 12-hour format
export const formatDateIST = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format time remaining in a human-readable format (25d 45h 7m)
export const formatTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry - now;
  
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
  
  return parts.join(' ');
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'Unknown';
  
  // Add + prefix if not present
  const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  
  // Format common country codes for better readability
  if (formatted.startsWith('+91')) {
    // Indian numbers: +91 XXXXX XXXXX
    const number = formatted.slice(3);
    if (number.length === 10) {
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
  }
  
  return formatted;
};

// Get current time in Asia/Kolkata
export const getCurrentTimeIST = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};