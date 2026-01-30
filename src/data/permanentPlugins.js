
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
  },
    {
    "id": "plugin-bjIe1r",
    "name": "areact",
    "author": "manjisama1",
    "description": "Auto react to incoming messages",
    "type": "fun",
    "gistLink": "https://gist.github.com/manjisama1/69e6ec7b3580af1b215ff4dd823a7c0a",
    "tags": [
      "auto",
      "reaction"
    ],
    "features": ["auto react"]
  },
  {
  "id": "plugin-VYAYpC",
  "name": "slot",
  "author": "manjisama1",
  "description": "slot game",
  "type": "game",
  "gistLink": "https://gist.github.com/manjisama1/a408014c978a4a599ed601da0de53aa0",
  "tags": [
    "slot"
  ],
  "features": [
    "game"
  ]
},
{
  "id": "plugin-GshBCL",
  "name": "readmore",
  "author": "manjisama1",
  "description": "Make a readmore text message",
  "type": "fun",
  "gistLink": "https://gist.github.com/manjisama1/091b5798c7144e53c5a446cb2d04e819",
  "tags": [
    "read more"
  ],
  "features": [
    "text",
    "read more"
  ]
},
{
  "id": "plugin-vwLLyX",
  "name": "page",
  "author": "manjisama1",
  "description": "Make a page of any dimension and colour",
  "type": "tool",
  "gistLink": "https://gist.github.com/manjisama1/f0ce4f88faf953e62dcb39e567e1b2cd",
  "tags": [
    "edit",
    "page"
  ],
  "features": [
    "edit"
  ]
},
{
  "id": "plugin-1768883897387",
  "name": "T&D",
  "author": "manjisama1",
  "description": "Truth and dare, would you rather, never have I ever.",
  "type": "game",
  "gistLink": "https://gist.github.com/manjisama1/f7bcdf7b508d240b978ccb2b713d1c28",
  "tags": [
    "game",
    "fun",
    "t&d",
    "truth or dare"
  ],
  "features": [
    "truth or dare"
  ],
  "likes": 0,
  "status": "approved",
  "createdAt": "2026-01-20T04:38:17.387Z"
},
{
  "id": "plugin-0N9kqA",
  "name": "interactions",
  "author": "manjisama1",
  "description": "angry, baka, bite, blush, bored, cry, cuddle, dance, facepalm, feed, handhold, handshake, happy, highfive, hug, kick, kiss, laugh, lurk, nod, nom, nope, pat, peck, poke, pout, punch, run, shoot, shrug, slap, sleep, smile, smug, stare, think, thumbsup, tickle, wave, wink, yawn, yeet",
  "type": "fun",
  "gistLink": "https://gist.github.com/manjisama1/a8059a734d72d88d4aac81137ff65033",
  "tags": [
    "react",
    "interaction"
  ],
  "features": [
    "interact"
  ]
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
