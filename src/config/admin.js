export const ADMIN_CONFIG = {
  adminUserIds: import.meta.env.VITE_ADMIN_USER_IDS
    ? import.meta.env.VITE_ADMIN_USER_IDS.split(',').map(id => id.trim()).filter(Boolean)
    : ['111729787'], // Fallback for production
  adminUsernames: import.meta.env.VITE_ADMIN_USERS
    ? import.meta.env.VITE_ADMIN_USERS.split(',').map(username => username.trim()).filter(Boolean)
    : ['manjisama1'], // Fallback for production
  verificationMethod: 'github-hybrid',
};

export const isAdmin = (user) => {
  if (!user) return false;

  if (user.id && ADMIN_CONFIG.adminUserIds.length > 0) {
    const isAdminById = ADMIN_CONFIG.adminUserIds.includes(user.id.toString());
    if (isAdminById) {
      return true;
    }
  }

  if (user.login && ADMIN_CONFIG.adminUsernames.length > 0) {
    const isAdminByUsername = ADMIN_CONFIG.adminUsernames.includes(user.login);
    if (isAdminByUsername) {
      return true;
    }
  }

  return false;
};

export default ADMIN_CONFIG;
