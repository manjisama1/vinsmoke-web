
export const PERMANENT_PLUGINS = [
  {
    "id": "plugin-A7x9Kp",
    "name": "nowa",
    "author": "manji<3",
    "description": "Check who is not in whatsapp from a list of numbers",
    "type": "tool",
    "gistLink": "https://gist.github.com/manjisama1/c754223fcc5ec2fbc0b36d7211730610",
    "tags": ["WhatsApp checker"],
    "features": ["checker"]
  }

];

// Get all plugin types from permanent plugins
export const getPermanentPluginTypes = () => {
  const types = [...new Set(PERMANENT_PLUGINS.map(plugin => plugin.type))];
  return ['all', ...types.sort()];
};

// All available plugin categories
export const PLUGIN_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'download', label: 'Download' },
  { value: 'game', label: 'Game' },
  { value: 'AI', label: 'AI' },
  { value: 'API', label: 'API' },
  { value: 'scrape', label: 'Scrape' },
  { value: 'data', label: 'Data' },
  { value: 'info', label: 'Info' },
  { value: 'tool', label: 'Tool' }
];

// Search permanent plugins
export const searchPermanentPlugins = (query) => {
  if (!query || query.trim().length < 2) return PERMANENT_PLUGINS;
  
  const lowercaseQuery = query.toLowerCase();
  return PERMANENT_PLUGINS.filter(plugin => 
    plugin.name.toLowerCase().includes(lowercaseQuery) ||
    plugin.description.toLowerCase().includes(lowercaseQuery) ||
    plugin.author.toLowerCase().includes(lowercaseQuery) ||
    plugin.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Filter permanent plugins by type
export const filterPermanentPluginsByType = (type) => {
  if (!type || type === 'all') return PERMANENT_PLUGINS;
  return PERMANENT_PLUGINS.filter(plugin => plugin.type === type);
};

// Sort permanent plugins
export const sortPermanentPlugins = (plugins, sortBy) => {
  const sorted = [...plugins];
  
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'old':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'liked':
      return sorted.sort((a, b) => b.likes - a.likes);
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// Get plugin statistics
export const getPermanentPluginStats = () => {
  return {
    total: PERMANENT_PLUGINS.length,
    byType: PERMANENT_PLUGINS.reduce((acc, plugin) => {
      acc[plugin.type] = (acc[plugin.type] || 0) + 1;
      return acc;
    }, {}),
    totalLikes: PERMANENT_PLUGINS.reduce((sum, plugin) => sum + plugin.likes, 0),
    averageLikes: Math.round(PERMANENT_PLUGINS.reduce((sum, plugin) => sum + plugin.likes, 0) / PERMANENT_PLUGINS.length)
  };
};