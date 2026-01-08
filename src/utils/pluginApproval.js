/**
 * Plugin approval utilities for manual Git-based workflow
 */

// Format plugin data for manual addition to repository
export const formatPluginForRepository = (plugin) => {
  // Clean up the plugin data for repository addition
  const cleanPlugin = {
    id: `plugin-${Date.now()}`,
    name: plugin.name,
    author: plugin.author,
    description: plugin.description,
    type: plugin.type,
    gistLink: plugin.gistLink,
    tags: plugin.tags || [],
    features: plugin.features || [],
    likes: 0, // Will be fetched from GitHub
    status: 'approved',
    createdAt: new Date().toISOString()
  };
  
  return cleanPlugin;
};

// Generate JSON for copying to clipboard
export const generatePluginJSON = (plugin) => {
  const formattedPlugin = formatPluginForRepository(plugin);
  return JSON.stringify(formattedPlugin, null, 2);
};

// Copy plugin JSON to clipboard
export const copyPluginToClipboard = async (plugin) => {
  try {
    const jsonData = generatePluginJSON(plugin);
    await navigator.clipboard.writeText(jsonData);
    return { success: true, data: jsonData };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, error: error.message };
  }
};

// Generate instructions for manual repository addition
export const generateRepositoryInstructions = (plugin) => {
  const instructions = `
Manual Plugin Addition Instructions:

1. Copy the JSON data below
2. Navigate to: frontend/src/data/permanentPlugins.js
3. Add the plugin object to the PERMANENT_PLUGINS array
4. Commit and push the changes

Plugin JSON:
${generatePluginJSON(plugin)}

File Location: frontend/src/data/permanentPlugins.js
Array: PERMANENT_PLUGINS

Note: Make sure to add a comma after the previous plugin entry before adding this new one.
  `.trim();
  
  return instructions;
};

// Download plugin as JSON file
export const downloadPluginJSON = (plugin) => {
  try {
    const jsonData = generatePluginJSON(plugin);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `plugin-${plugin.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading plugin JSON:', error);
    return { success: false, error: error.message };
  }
};

// Validate plugin data before approval
export const validatePluginForApproval = (plugin) => {
  const errors = [];
  
  if (!plugin.name || plugin.name.trim().length < 3) {
    errors.push('Plugin name must be at least 3 characters long');
  }
  
  if (!plugin.author || plugin.author.trim().length < 2) {
    errors.push('Author name must be at least 2 characters long');
  }
  
  if (!plugin.description || plugin.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!plugin.type) {
    errors.push('Plugin type is required');
  }
  
  if (!plugin.gistLink || !isValidGistUrl(plugin.gistLink)) {
    errors.push('Valid GitHub Gist URL is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate gist URL (imported from githubIntegration)
const isValidGistUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'gist.github.com';
  } catch (error) {
    return false;
  }
};

// Generate approval workflow summary
export const generateApprovalSummary = (plugin) => {
  const validation = validatePluginForApproval(plugin);
  
  return {
    plugin: formatPluginForRepository(plugin),
    validation,
    instructions: generateRepositoryInstructions(plugin),
    timestamp: new Date().toISOString()
  };
};

// Create approval notification data
export const createApprovalNotification = (plugin, action = 'approved') => {
  return {
    type: 'plugin_approval',
    action, // 'approved', 'rejected', 'pending'
    plugin: {
      name: plugin.name,
      author: plugin.author,
      type: plugin.type
    },
    timestamp: new Date().toISOString(),
    message: `Plugin "${plugin.name}" by ${plugin.author} has been ${action}`
  };
};