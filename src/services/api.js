// AltAmino Web Client API Service
// Connects to AltAmino REST backend with fallback data

const DEFAULT_SERVER_URL = "http://localhost:33333/api/v1";

export const initialCommunities = [
  {
    id: 101,
    ndcId: 101,
    name: "AltAmino Central",
    aminoId: "altamino",
    tagline: "The official home for AltAmino developers, creators & fans.",
    icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    membersCount: 4820,
    onlineCount: 312,
    themeColor: "#6366f1",
    tags: ["Official", "Community", "Updates", "ACM"]
  },
  {
    id: 102,
    ndcId: 102,
    name: "Anime & Manga Universe",
    aminoId: "animeuniverse",
    tagline: "Discussions, fanart, seasonal reviews & watch parties.",
    icon: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    membersCount: 18450,
    onlineCount: 940,
    themeColor: "#ec4899",
    tags: ["Anime", "Manga", "Cosplay", "Art"]
  },
  {
    id: 103,
    ndcId: 103,
    name: "Cyber & Tech Lounge",
    aminoId: "cybertech",
    tagline: "Programming, reverse-engineering, open-source & gadgets.",
    icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    membersCount: 7120,
    onlineCount: 420,
    themeColor: "#06b6d4",
    tags: ["Coding", "Python", "Linux", "Security"]
  },
  {
    id: 104,
    ndcId: 104,
    name: "Gaming Nexus",
    aminoId: "gamingnexus",
    tagline: "Find squad mates, share gameplay clips & game discussions.",
    icon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    membersCount: 12300,
    onlineCount: 680,
    themeColor: "#10b981",
    tags: ["Gaming", "Esports", "Clips", "Guides"]
  }
];

export const initialBlogs = [
  {
    id: "blog-1",
    ndcId: 101,
    title: "Welcome to AltAmino Web! 🚀",
    content: "[BC]Official Web Client Launch!\n[C]Empowering decentralized communities everywhere\n\n[B]We are thrilled to launch the new AltAmino social web experience![/B]\nYou can now browse community feeds, connect with leaders, read posts, vote on polls, and chat with members straight from modern desktop and mobile browsers without emulators.\n\n[I]Drop your thoughts and comments below![/I]",
    author: {
      uid: "user-dev-1",
      nickname: "shaderw0lf",
      aminoId: "shader",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      level: 16,
      role: "Leader",
      frame: "/assets/amino/ic_default_avatar_frame.png"
    },
    createdTime: "2 hours ago",
    likesCount: 142,
    hasLiked: false,
    commentsCount: 3,
    mediaList: [
      { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" }
    ],
    tags: ["Announcement", "AltAmino", "Web"],
    comments: [
      {
        id: "c-1",
        author: { nickname: "alx0rr", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80", level: 14, role: "Curator" },
        content: "[B]Huge milestone![/B] The WebSocket live sync is running smooth.",
        time: "1 hour ago",
        likes: 12
      },
      {
        id: "c-2",
        author: { nickname: "Kira_San", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80", level: 12, role: "Member" },
        content: "Love the avatar frame store! Already picked up the Cyber frame ✨",
        time: "45m ago",
        likes: 8
      }
    ]
  },
  {
    id: "blog-poll-1",
    ndcId: 101,
    title: "📊 Community Poll: Which feature should we prioritize next?",
    content: "[C]Vote for the upcoming AltAmino development sprint!\n\nHelp our open-source team decide what tools to build next for community curators and members. Cast your vote below:",
    author: {
      uid: "user-dev-2",
      nickname: "alx0rr",
      aminoId: "alx",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
      level: 14,
      role: "Curator",
      frame: null
    },
    createdTime: "4 hours ago",
    likesCount: 96,
    hasLiked: false,
    commentsCount: 15,
    mediaList: [],
    tags: ["Poll", "Feedback", "Community"],
    poll: {
      id: "poll-feature-1",
      question: "Which AltAmino feature do you want next?",
      daysLeft: 4,
      totalVotes: 324,
      hasVoted: false,
      userVote: null,
      options: [
        { id: "opt-1", text: "Screening Room Video Sync 🎬", votes: 142 },
        { id: "opt-2", text: "Custom Sticker Pack Creator 🎨", votes: 98 },
        { id: "opt-3", text: "Quiz Maker & Leaderboards 🏆", votes: 84 }
      ]
    },
    comments: []
  },
  {
    id: "blog-3",
    ndcId: 102,
    title: "Top 5 Anime of the Season: What are you watching?",
    content: "[B]The seasonal anime lineup has been incredible![/B]\n[C]From mind-bending psychological thrillers to high-octane fantasy action, there is so much to discuss.\n\nJoin our Voice Hangout room tonight where we will be streaming the best OSTs and discussing episode premieres!",
    author: {
      uid: "user-anime-1",
      nickname: "Kira_San",
      aminoId: "kira",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      level: 12,
      role: "Member",
      frame: null
    },
    createdTime: "1 day ago",
    likesCount: 230,
    hasLiked: true,
    commentsCount: 2,
    mediaList: [
      { url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80" }
    ],
    tags: ["Anime", "SeasonTop", "Watchlist"],
    comments: [
      {
        id: "c-3",
        author: { nickname: "shaderw0lf", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80", level: 16, role: "Leader" },
        content: "I will be tuning into the voice stage for sure! 🎙",
        time: "18h ago",
        likes: 15
      }
    ]
  }
];

export const initialChats = [
  {
    id: "chat-1",
    ndcId: 101,
    title: "💬 Global Tavern (Lounge)",
    description: "Casual hangout chat for AltAmino members. Be respectful and follow community guidelines!",
    icon: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150&auto=format&fit=crop&q=80",
    background: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80",
    membersCount: 412,
    onlineCount: 68,
    channelType: 0, // Text
    host: "shaderw0lf",
    lastMessage: {
      author: "alx0rr",
      content: "The WebSocket gateway updates are live!",
      time: "10m ago"
    }
  },
  {
    id: "chat-2",
    ndcId: 101,
    title: "🛠 Developer Hub & Bot Builders",
    description: "Discuss API integrations, altamino.py bots, and client development.",
    icon: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80",
    background: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80",
    membersCount: 185,
    onlineCount: 34,
    channelType: 0,
    host: "shaderw0lf",
    lastMessage: {
      author: "Sagar",
      content: "Call-state signalling is tested and working.",
      time: "25m ago"
    }
  },
  {
    id: "chat-3",
    ndcId: 102,
    title: "🎙 Anime Voice Hangout & Music",
    description: "Hop on stage, share your favorite anime OSTs, and relax with friends.",
    icon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80",
    background: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80",
    membersCount: 890,
    onlineCount: 115,
    channelType: 1, // Voice stage
    host: "Kira_San",
    lastMessage: {
      author: "Kira_San",
      content: "Voice room is open, feel free to request speaking permission!",
      time: "1m ago"
    }
  }
];

export const initialMessages = {
  "chat-1": [
    {
      id: "msg-1",
      authorId: "user-dev-1",
      authorName: "shaderw0lf",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      authorLevel: 16,
      authorRole: "Leader",
      content: "Welcome everyone to the new AltAmino Web chat! Everything syncs directly with the API.",
      timestamp: "10:14 AM",
      isMine: false
    },
    {
      id: "msg-2",
      authorId: "user-dev-2",
      authorName: "alx0rr",
      authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80",
      authorLevel: 14,
      authorRole: "Curator",
      content: "Tested live message dispatching and real-time tipping. Looking slick! ✨",
      timestamp: "10:15 AM",
      isMine: false
    },
    {
      id: "msg-3",
      authorId: "current-user",
      authorName: "AltExplorer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      authorLevel: 11,
      authorRole: "Member",
      content: "So awesome to finally have a desktop browser client for this! 🎉",
      timestamp: "10:18 AM",
      isMine: true
    },
    {
      id: "msg-4",
      authorId: "user-dev-1",
      authorName: "shaderw0lf",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      authorLevel: 16,
      authorRole: "Leader",
      type: "audioNote",
      audioDuration: 8,
      timestamp: "10:20 AM",
      isMine: false
    },
    {
      id: "msg-5",
      authorId: "user-anime-1",
      authorName: "Kira_San",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      authorLevel: 12,
      authorRole: "Member",
      type: "sticker",
      stickerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&auto=format&fit=crop&q=80",
      timestamp: "10:22 AM",
      isMine: false
    }
  ]
};

export const defaultUser = {
  uid: "current-user",
  nickname: "AltExplorer",
  aminoId: "explorer",
  email: "explorer@altamino.top",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80",
  bio: "Exploring the decentralized Amino ecosystem. AltAmino enthusiast & tester.",
  level: 11,
  reputation: 3450,
  nextLevelRep: 5000,
  coins: 480,
  streak: 14,
  hasCheckedInToday: false,
  role: 0,
  joinedCommunities: [101, 102, 103]
};
