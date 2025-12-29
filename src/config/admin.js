export const ADMIN_CONFIG = {
  adminUserIds: import.meta.env.VITE_ADMIN_USER_IDS
    ? import.meta.env.VITE_ADMIN_USER_IDS.split(',').map(id => id.trim()).filter(Boolean)
    : ['111729787'], // Fallback for production
  adminUsernames: import.meta.env.VITE_ADMIN_USERS
    ? import.meta.env.VITE_ADMIN_USERS.split(',').map(username => username.trim()).filter(Boolean)
    : ['manjisama1'], // Fallback for production
  verificationMethod: 'github-hybrid',
};

// Temporary debug logging
console.log('🔧 Frontend Admin Config Debug:');
console.log('- VITE_ADMIN_USER_IDS env:', import.meta.env.VITE_ADMIN_USER_IDS);
console.log('- VITE_ADMIN_USERS env:', import.meta.env.VITE_ADMIN_USERS);
console.log('- Parsed adminUserIds:', ADMIN_CONFIG.adminUserIds);
console.log('- Parsed adminUsernames:', ADMIN_CONFIG.adminUsernames);

export const isAdmin = (user) => {
  // Temporary debug logging
  console.log('🔍 Frontend Admin Check:');
  console.log('- User:', user);
  console.log('- User ID:', user?.id, 'Type:', typeof user?.id);
  console.log('- User Login:', user?.login);
  console.log('- Admin User IDs:', ADMIN_CONFIG.adminUserIds);
  console.log('- Admin Usernames:', ADMIN_CONFIG.adminUsernames);
  
  if (!user) {
    console.log('❌ No user provided');
    return false;
  }

  if (user.id && ADMIN_CONFIG.adminUserIds.length > 0) {
    console.log('🔢 Checking ID:', user.id, 'against:', ADMIN_CONFIG.adminUserIds);
    console.log('🔢 ID as string:', user.id.toString());
    console.log('🔢 Includes check:', ADMIN_CONFIG.adminUserIds.includes(user.id.toString()));
    
    const isAdminById = ADMIN_CONFIG.adminUserIds.includes(user.id.toString());
    if (isAdminById) {
      console.log('✅ Admin access by ID');
      return true;
    }
  }

  if (user.login && ADMIN_CONFIG.adminUsernames.length > 0) {
    console.log('👤 Checking username:', user.login, 'against:', ADMIN_CONFIG.adminUsernames);
    console.log('👤 Includes check:', ADMIN_CONFIG.adminUsernames.includes(user.login));
    
    const isAdminByUsername = ADMIN_CONFIG.adminUsernames.includes(user.login);
    if (isAdminByUsername) {
      console.log('✅ Admin access by username');
      return true;
    }
  }

  console.log('❌ Admin access denied');
  return false;
};

export default ADMIN_CONFIG;
