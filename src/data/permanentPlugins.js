// Gist URL for permanent plugins - update this Gist to add new plugins without redeploying
// Raw URL format: https://gist.githubusercontent.com/manjisama1/GIST_ID/raw/plugins.json
const PLUGINS_GIST_URL = 'https://gist.githubusercontent.com/manjisama1/bdf1ecc0d9f96c24c154d03e232adecf/raw/71c66568c55c122129941786ef5381ce3df5d808/plugins.json';

const CACHE_KEY = 'vinsmoke_permanent_plugins';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Fallback plugins (used if Gist is unreachable)
const FALLBACK_PLUGINS = [
  {
    id: 'plugin-A7x9Kp',
    name: 'nowa',
    author: 'manji<3',
    description: 'Check who is not in whatsapp from a list of numbers',
    type: 'tool',
    gistLink: 'https://gist.github.com/manjisama1/c754223fcc5ec2fbc0b36d7211730610',
    tags: ['WhatsApp checker'],
    features: ['checker']
  },
  {
    id: 'plugin-bjIe1r',
    name: 'areact',
    author: 'manjisama1',
    description: 'Auto react to incoming messages',
    type: 'fun',
    gistLink: 'https://gist.github.com/manjisama1/69e6ec7b3580af1b215ff4dd823a7c0a',
    tags: ['auto', 'reaction'],
    features: ['auto react']
  }
];

// In-memory cache to avoid repeated localStorage reads
let memoryCache = null;

const getFromCache = () => {
  if (memoryCache) return memoryCache;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    memoryCache = data;
    return data;
  } catch {
    return null;
  }
};

const saveToCache = (data) => {
  try {
    memoryCache = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage might be full, ignore
  }
};

// Fetch plugins from Gist - call this in your component
export const fetchPermanentPlugins = async () => {
  // Return cached version if available
  const cached = getFromCache();
  if (cached) return cached;

  // Skip fetch if Gist URL hasn't been configured yet
  if (PLUGINS_GIST_URL.includes('REPLACE_WITH_YOUR_GIST_ID')) {
    return FALLBACK_PLUGINS;
  }

  try {
    const res = await fetch(`${PLUGINS_GIST_URL}?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid format');
    saveToCache(data);
    return data;
  } catch {
    // Return fallback if fetch fails
    return FALLBACK_PLUGINS;
  }
};

// Static export for components that haven't migrated yet
export const PERMANENT_PLUGINS = FALLBACK_PLUGINS;

// All available plugin categories
export const PLUGIN_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'download', label: 'Download' },
  { value: 'game', label: 'Game' },
  { value: 'fun', label: 'Fun' },
  { value: 'AI', label: 'AI' },
  { value: 'API', label: 'API' },
  { value: 'scrape', label: 'Scrape' },
  { value: 'data', label: 'Data' },
  { value: 'info', label: 'Info' },
  { value: 'tool', label: 'Tool' },
  { value: 'utility', label: 'Utility' },
  { value: 'social', label: 'Social' },
  { value: 'media', label: 'Media' },
  { value: 'admin', label: 'Admin' },
  { value: 'sticker', label: 'Sticker' }
];

export const getPermanentPluginTypes = () => {
  const types = [...new Set(FALLBACK_PLUGINS.map(p => p.type))];
  return ['all', ...types.sort()];
};

export const searchPermanentPlugins = (query) => {
  if (!query || query.trim().length < 2) return FALLBACK_PLUGINS;
  const q = query.toLowerCase();
  return FALLBACK_PLUGINS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q))
  );
};

export const filterPermanentPluginsByType = (type) => {
  if (!type || type === 'all') return FALLBACK_PLUGINS;
  return FALLBACK_PLUGINS.filter(p => p.type === type);
};

export const sortPermanentPlugins = (plugins, sortBy) => {
  const sorted = [...plugins];
  switch (sortBy) {
    case 'liked': return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case 'az': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default: return sorted;
  }
};
