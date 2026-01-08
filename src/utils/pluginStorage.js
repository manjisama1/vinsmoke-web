/**
 * Local storage utilities for managing user-added plugins
 */

const STORAGE_KEY = 'vinsmoke_user_plugins';

// Get all user-added plugins from localStorage
export const getUserPlugins = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading user plugins from localStorage:', error);
    return [];
  }
};

// Save user-added plugins to localStorage
export const saveUserPlugins = (plugins) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
    return true;
  } catch (error) {
    console.error('Error saving user plugins to localStorage:', error);
    return false;
  }
};

// Add a new plugin
export const addUserPlugin = (plugin) => {
  try {
    const existingPlugins = getUserPlugins();
    
    // Check if plugin with same name already exists
    const existingIndex = existingPlugins.findIndex(p => 
      p.name.toLowerCase() === plugin.name.toLowerCase()
    );
    
    if (existingIndex !== -1) {
      // Update existing plugin
      existingPlugins[existingIndex] = {
        ...plugin,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new plugin
      existingPlugins.push({
        ...plugin,
        id: plugin.id || `user-${Date.now()}`,
        createdAt: plugin.createdAt || new Date().toISOString(),
        isUserAdded: true
      });
    }
    
    return saveUserPlugins(existingPlugins);
  } catch (error) {
    console.error('Error adding user plugin:', error);
    return false;
  }
};

// Remove a user plugin
export const removeUserPlugin = (pluginId) => {
  try {
    const existingPlugins = getUserPlugins();
    const filteredPlugins = existingPlugins.filter(p => p.id !== pluginId);
    return saveUserPlugins(filteredPlugins);
  } catch (error) {
    console.error('Error removing user plugin:', error);
    return false;
  }
};

// Update a user plugin
export const updateUserPlugin = (pluginId, updates) => {
  try {
    const existingPlugins = getUserPlugins();
    const pluginIndex = existingPlugins.findIndex(p => p.id === pluginId);
    
    if (pluginIndex === -1) {
      return false;
    }
    
    existingPlugins[pluginIndex] = {
      ...existingPlugins[pluginIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return saveUserPlugins(existingPlugins);
  } catch (error) {
    console.error('Error updating user plugin:', error);
    return false;
  }
};

// Like/unlike a plugin (for user plugins only)
export const toggleUserPluginLike = (pluginId, userId = 'anonymous') => {
  try {
    const existingPlugins = getUserPlugins();
    const pluginIndex = existingPlugins.findIndex(p => p.id === pluginId);
    
    if (pluginIndex === -1) {
      return false;
    }
    
    const plugin = existingPlugins[pluginIndex];
    
    // Initialize likedBy array if it doesn't exist
    if (!plugin.likedBy) {
      plugin.likedBy = [];
    }
    
    const hasLiked = plugin.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      plugin.likedBy = plugin.likedBy.filter(id => id !== userId);
      plugin.likes = Math.max(0, (plugin.likes || 0) - 1);
    } else {
      // Like
      plugin.likedBy.push(userId);
      plugin.likes = (plugin.likes || 0) + 1;
    }
    
    existingPlugins[pluginIndex] = plugin;
    return saveUserPlugins(existingPlugins);
  } catch (error) {
    console.error('Error toggling plugin like:', error);
    return false;
  }
};

// Export all user plugins as JSON
export const exportUserPlugins = () => {
  try {
    const plugins = getUserPlugins();
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      plugins: plugins.map(plugin => ({
        name: plugin.name,
        author: plugin.author,
        description: plugin.description,
        type: plugin.type,
        gistLink: plugin.gistLink,
        tags: plugin.tags || [],
        features: plugin.features || []
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vinsmoke-plugins-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting user plugins:', error);
    return false;
  }
};

// Import plugins from JSON
export const importUserPlugins = (jsonData) => {
  try {
    const importData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (!importData.plugins || !Array.isArray(importData.plugins)) {
      throw new Error('Invalid import format: plugins array not found');
    }
    
    const existingPlugins = getUserPlugins();
    let importedCount = 0;
    let updatedCount = 0;
    
    importData.plugins.forEach(pluginData => {
      // Validate required fields
      if (!pluginData.name || !pluginData.author || !pluginData.description) {
        return;
      }
      
      const existingIndex = existingPlugins.findIndex(p => 
        p.name.toLowerCase() === pluginData.name.toLowerCase()
      );
      
      const plugin = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...pluginData,
        likes: pluginData.likes || 0,
        status: 'approved',
        createdAt: new Date().toISOString(),
        tags: Array.isArray(pluginData.tags) ? pluginData.tags : [],
        features: Array.isArray(pluginData.features) ? pluginData.features : [],
        isPermanent: false,
        isUserAdded: true
      };
      
      if (existingIndex !== -1) {
        existingPlugins[existingIndex] = {
          ...plugin,
          id: existingPlugins[existingIndex].id, // Keep original ID
          updatedAt: new Date().toISOString()
        };
        updatedCount++;
      } else {
        existingPlugins.push(plugin);
        importedCount++;
      }
    });
    
    const success = saveUserPlugins(existingPlugins);
    return { success, importedCount, updatedCount };
  } catch (error) {
    console.error('Error importing user plugins:', error);
    return { success: false, error: error.message };
  }
};

// Clear all user plugins
export const clearUserPlugins = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user plugins:', error);
    return false;
  }
};

// Get plugin statistics
export const getUserPluginStats = () => {
  try {
    const plugins = getUserPlugins();
    return {
      total: plugins.length,
      byType: plugins.reduce((acc, plugin) => {
        acc[plugin.type] = (acc[plugin.type] || 0) + 1;
        return acc;
      }, {}),
      totalLikes: plugins.reduce((sum, plugin) => sum + (plugin.likes || 0), 0),
      averageLikes: plugins.length > 0 ? 
        Math.round(plugins.reduce((sum, plugin) => sum + (plugin.likes || 0), 0) / plugins.length) : 0
    };
  } catch (error) {
    console.error('Error getting user plugin stats:', error);
    return { total: 0, byType: {}, totalLikes: 0, averageLikes: 0 };
  }
};