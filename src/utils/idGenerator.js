/**
 * Generate a unique 6-character ID using A-Z, a-z, 0-9
 */
export const generateUniqueId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a plugin ID with prefix
 */
export const generatePluginId = () => {
  return `plugin-${generateUniqueId()}`;
};

/**
 * Generate a FAQ ID with prefix
 */
export const generateFAQId = () => {
  return `faq-${generateUniqueId()}`;
};