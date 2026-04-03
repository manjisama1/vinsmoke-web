export const PERMANENT_PLUGINS = [
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
  },
  {
    "id": "plugin-xPrNVA",
    "name": "dld",
    "author": "manjisama1",
    "description": "download any youtube video, trim yt videos, or download as audio",
    "type": "download",
    "gistLink": "https://gist.github.com/manjisama1/dd26f21dd56da3cd99732816067fb863",
    "tags": [
      "download",
      "media"
    ],
    "features": [
      "youtube"
    ]
  }
];

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
  const types = [...new Set(PERMANENT_PLUGINS.map(p => p.type))];
  return ['all', ...types.sort()];
};

export const searchPermanentPlugins = (query) => {
  if (!query || query.trim().length < 2) return PERMANENT_PLUGINS;
  const q = query.toLowerCase();
  return PERMANENT_PLUGINS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q))
  );
};

export const filterPermanentPluginsByType = (type) => {
  if (!type || type === 'all') return PERMANENT_PLUGINS;
  return PERMANENT_PLUGINS.filter(p => p.type === type);
};

export const sortPermanentPlugins = (plugins, sortBy) => {
  const sorted = [...plugins];
  switch (sortBy) {
    case 'liked': return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case 'az': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default: return sorted;
  }
};
