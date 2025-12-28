// Permanent FAQs - These are hardcoded in the frontend and always available
// They don't require API calls and will always be displayed first

export const PERMANENT_FAQS = [
  {
    id: 'perm-1',
    question: "What is Vinsmoke WhatsApp Bot?",
    answer: "Vinsmoke is a versatile red`WhatsApp bot` built on the blue`Baileys library`. Think of it as your personal digital assistant you can use it to yellow`manage groups` effortlessly, create green`stickers` in seconds, or convert various blue`media files`. If you're feeling creative, you can even build yellow`custom commands` tailored to your own needs. Don't worry if you blue`don't have coding knowledge`; just head over to our red`support page` to seek help from the team or our amazing community members who are always ready to guide you.",
    category: "Getting Started",
    tags: ["introduction", "overview", "baileys", "stickers", "groups"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-2',
    question: "How can I start a new WhatsApp session?",
    answer: "Setting up your bot is simple and offers two flexible ways to get connected. Pick the one that works best for you:\n\nblue`QR Code Method`:\nHead to the Sessions page and click red`'Generate QR Code'`. Just open WhatsApp on your phone, go to Linked Devices, and scan the code. Your session will spin up automatically.\n\ngreen`Pairing Code Method`:\nIf you can't scan a code, click red`'Generate Pairing Code'`. Enter your yellow`phone number` with the country code. We use a stable blue`Safari-based handshake` for this just wait a few seconds, then enter the yellow`8-digit code` into your phone's Linked Devices settings.\n\nred`Final Step`:\nOnce linked, the website will generate a unique ID like blue`VINSMOKE@blabla`. Copy this and paste it into your yellow`config.env` file under the key red`SESSION_ID`. Before you run blue`npm start`, make sure to delete any folder named yellow`session` in your root directory (where the lib and plugins folders are) to ensure a fresh, clean start!",
    category: "Sessions",
    tags: ["session", "qr code", "pairing code", "setup", "vinsmoke-id"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-3',
    question: "Which one should I choose: QR Code or Pairing Code?",
    answer: "Both methods are great, and honestly, you'll end up with the blue`exact same bot` no matter which you pick! It really just depends on how you prefer to connect.\n\nblue`QR Code Method`\nThis is the yellow`fastest way` to get started. If you have your phone handy, just scan the code and you are done. It is green`super convenient` and highly recommended for most users because it's almost instant.\n\ngreen`Pairing Code Method`\nThis is a life-saver if you are on the same device as your bot or if your yellow`camera isn't working`. It uses an red`8-digit code` that you type in manually. It takes a few extra seconds, but it is just as secure and stable as scanning.\n\nNo matter which path you take, your session will have the red`full power` of Vinsmoke once it's linked!",
    category: "Sessions",
    tags: ["qr code", "pairing code", "difference", "comparison", "methods"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-4',
    question: "How do I install or share my own plugins?",
    answer: "Plugins are what make your bot truly yours! Our blue`Plugins page` is a community hub where everyone can share their custom-coded commands. \n\nred`Installing Plugins`:\nTo add a feature, simply use the command green`.plugin <gist link>` in your WhatsApp chat. If you want to remove one, use blue`.plugout <command name>`. If the new command doesn't show up right away, try a quick yellow`.reboot`. If it still isn't working, the file might not have loaded correctly usually because of a red`structure error` or missing imports. You should double-check your code against our yellow`Readme structure` to make sure everything is perfect.\n\ngreen`Sharing Your Own`:\nWant to contribute? Just create a blue`GitHub account`, host your command script in a yellow`Gist`, and upload it through our Plugins page for others to enjoy! \n\nDon't worry if you get stuck; our red`support team` and community are always there to help you debug your code.",
    category: "Plugins",
    tags: ["plugins", "gist", "installation", "coding", "community"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-5',
    question: "Is my WhatsApp account safe when using Vinsmoke?",
    answer: "Your security is a partnership between us and you. We store your session with a blue`unique ID` on our server so you can use your bot again and again without scanning every time. \n\ngreen`Is it safe?` \nThat mostly depends on you! If you keep your red`Session ID` private, you are completely safe. However, if you share that ID with anyone else, they can run your bot on their own computer and potentially yellow`misuse your account`. \n\nblue`Best Practices`:\nTreat your Session ID like a password. Never share it, and never post it in public groups. If you ever have a doubt that someone else has your ID, you should immediately red`log out` from your phone's Linked Devices and create a yellow`fresh session` here. This kills the old connection and keeps your account secure.",
    category: "Security",
    tags: ["security", "privacy", "safety", "session-id", "account-protection"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-6',
    question: "Why is my session not connecting and how do I fix it?",
    answer: "If you're having trouble, first check if our blue`server is under maintenance`. When we are updating the system, connections won't work, so always check the red`support group and channels` for status updates.\n\ngreen`Manual Connection Method` \nIf the website is down, you can create a session manually in your own server by editing the yellow`config.env` file:\n\n1. Set red`SESSION_ID=null` \n2. Set blue`QR=true` if you want to scan a code, or yellow`QR=false` for a pairing code. \n3. Add your number to red`BOT_NUM=91xxxxxxxxxx`. If you prefer to enter it via terminal, set this to blue`null`.\n\nyellow`Critical Cleanup` \nBefore restarting, you must delete the folder named red`session` if it exists in your root directory (the main folder where blue`lib` and green`plugins` are located). Once cleaned, run your bot and follow the terminal prompts to link up!",
    category: "Troubleshooting",
    tags: ["connection", "maintenance", "manual-setup", "config", "session-error"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-7',
    question: "Is there a limit to how many sessions I can create?",
    answer: "Good news! You can create blue`unlimited sessions` using our platform as long as the server isn't under maintenance. We don't believe in strict quotas, so feel free to link as many accounts as you need.\n\n**yellow`Data Cleanup`**\nTo keep our servers running fast and smooth, we do perform red`periodic cleanups` to remove old or inactive session data. If your session ever gets cleared, don't worry it’s green`not a big deal`! You can easily hop back onto the site and create a fresh session in just a few seconds.\n\n**green`Pro Tip`**\nSince creating a session is so yellow`quick and easy`, we recommend only keeping the ones you actively use. This helps ensure the best performance for your bot and our community.",
    category: "Sessions",
    tags: ["limits", "unlimited", "session-management", "cleanup", "quota"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-8',
    question: "What are the main features of Vinsmoke?",
    answer: "Vinsmoke is packed with tools designed for both power users and casual group owners. Here is a look at what you can do:\n\nblue`Group Management`:\nYou have full control over your groups. You can yellow`promote, demote, or kick` members and update group settings like the name or description instantly. We also include red`Anti-Link, Anti-Word, and Anti-Status` features to keep your groups clean. \n\nred`A Note on Adding Members`:\nWe have yellow`disabled the 'Add' command` for your own safety to prevent your account from being banned. If you are feeling brave, you can technically re-enable it in blue`root/plugins/group.js`, but please do so at your own risk!\n\ngreen`Media & Downloader Tools`:\nThis is where the fun starts! You can create green`stickers` instantly, download blue`songs and videos`, or grab content from red`Instagram and YouTube` with simple commands. One of our best features is the ability to download yellow`View Once` media so you never miss a thing.\n\nyellow`Owner Privileges`:\nAs the owner, the bot is your personal assistant. You can change the bot's red`profile picture or bio` via commands, download any message, and manage the bot's core settings directly from your chat. \n\nThere is so much more to explore, and we are constantly red`building new commands` for the future. If you have a cool idea, head to the support page and suggest it to the community!",
    category: "Features",
    tags: ["features", "group-management", "downloader", "stickers", "view-once"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-9',
    question: "How can I get help or report bugs?",
    answer: "Since Vinsmoke is a red`new bot`, it might behave differently across various platforms. If it's not working for you or you run into a blue`strange error`, please don't keep it to yourself let me know so I can fix it!\n\n**yellow`Where to find me`**\nHead over to our blue`Support Page` on the website. There, you'll find my direct email and social media handles. I’ve also set up green`Community Channels` on both Telegram and WhatsApp where you can chat with me and other users directly.\n\n**red`Reporting Issues`**\nWhether it’s a tiny bug or a major crash, just report it through any of those channels. Every piece of feedback helps make the bot better for everyone. I’m always open to your blue`queries and suggestions`, so feel free to reach out anytime!",
    category: "Support",
    tags: ["support", "help", "contact", "community", "bugs", "feedback"],
    isPermanent: true,
    isHardcoded: true
  },
  {
    id: 'perm-10',
    question: "How do I change my bot's prefix or other settings?",
    answer: "You can customize your bot's behavior instantly using the red`var` command. This is the easiest way to update your settings without editing files manually.\n\nblue`Setting a Variable`:\nTo change a setting, use the command red`var set KEY = value`. For example, if you want to change your prefix to '!', just type blue`var set prefix = !`.\n\ngreen`Automatic Uppercase`:\nDon't worry about being precise with your typing. Our system is smart enough to yellow`automatically convert your keys to UPPERCASE` (so 'prefix' becomes 'PREFIX') before saving them.\n\nred`Applying Changes`:\nWhile many settings update on the fly, some core changes might not show up immediately. If the bot doesn't seem to recognize your new setting, simply use the yellow`.reboot` command. This will restart the bot and force it to load your fresh configuration.",
    category: "Configuration",
    tags: ["variable", "prefix", "settings", "var", "reboot"],
    isPermanent: true,
    isHardcoded: true
  },
];

// Get all categories from permanent FAQs
export const getPermanentCategories = () => {
  const categories = [...new Set(PERMANENT_FAQS.map(faq => faq.category))];
  return categories.sort();
};

// Search permanent FAQs
export const searchPermanentFAQs = (query) => {
  if (!query || query.trim().length < 2) return PERMANENT_FAQS;
  
  const lowercaseQuery = query.toLowerCase();
  return PERMANENT_FAQS.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery) ||
    faq.category.toLowerCase().includes(lowercaseQuery) ||
    faq.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Filter permanent FAQs by category
export const filterPermanentFAQsByCategory = (category) => {
  if (!category || category === 'All') return PERMANENT_FAQS;
  return PERMANENT_FAQS.filter(faq => faq.category === category);
};