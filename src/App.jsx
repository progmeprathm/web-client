import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquare, 
  Flame, 
  Coins, 
  Heart, 
  Send, 
  Plus, 
  Settings, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Search, 
  Smile, 
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  initialCommunities, 
  initialBlogs, 
  initialChats, 
  initialMessages, 
  defaultUser 
} from './services/api';
import './App.css';

export default function App() {
  const [communities, setCommunities] = useState(initialCommunities);
  const [activeCommunity, setActiveCommunity] = useState(initialCommunities[0]);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'chats' | 'explore'
  const [feedType, setFeedType] = useState('featured'); // 'featured' | 'latest' | 'following'
  
  const [blogs, setBlogs] = useState(initialBlogs);
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState(initialChats[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  
  const [user, setUser] = useState(defaultUser);
  const [checkInReward, setCheckInReward] = useState(null);
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [selectedBlogForTip, setSelectedBlogForTip] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:33333/api/v1');

  // New Blog form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');

  // Daily Check-In Logic
  const handleCheckIn = () => {
    if (user.hasCheckedInToday) return;
    
    // AltAmino random daily reward: 1, 2, 3, or 10 coins
    const rewards = [1, 2, 3, 10];
    const coinWon = rewards[Math.floor(Math.random() * rewards.length)];
    
    setUser(prev => ({
      ...prev,
      hasCheckedInToday: true,
      coins: prev.coins + coinWon,
      streak: prev.streak + 1,
      reputation: prev.reputation + 20
    }));

    setCheckInReward(coinWon);
    setTimeout(() => setCheckInReward(null), 3500);
  };

  // Like Blog
  const handleLike = (blogId) => {
    setBlogs(prev => prev.map(b => {
      if (b.id === blogId) {
        return {
          ...b,
          hasLiked: !b.hasLiked,
          likesCount: b.hasLiked ? b.likesCount - 1 : b.likesCount + 1
        };
      }
      return b;
    }));
  };

  // Tip Coins
  const handleTip = (amount) => {
    if (user.coins < amount) {
      alert("Not enough coins in your wallet!");
      return;
    }
    setUser(prev => ({ ...prev, coins: prev.coins - amount }));
    if (selectedBlogForTip) {
      setBlogs(prev => prev.map(b => 
        b.id === selectedBlogForTip.id 
          ? { ...b, likesCount: b.likesCount + 1 } 
          : b
      ));
    }
    setIsTipOpen(false);
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      authorId: user.uid,
      authorName: user.nickname,
      authorAvatar: user.avatar,
      authorLevel: user.level,
      authorRole: "Member",
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    const currentChatId = activeChat.id;
    setMessages(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMsg]
    }));

    setChatInput('');

    // Realistic community member simulated reply
    setTimeout(() => {
      const botReplies = [
        "Welcome to the room! Make yourself at home.",
        "Glad to see you on the web client! 🚀",
        "Checked the latest community feed? Great discussions today.",
        "Remember to tip great posts with daily check-in coins! 🪙"
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
      const botMsg = {
        id: `bot-msg-${Date.now()}`,
        authorId: "member-bot",
        authorName: "Aiko_Chii",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80",
        authorLevel: 13,
        authorRole: "Curator",
        content: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: false
      };
      setMessages(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), botMsg]
      }));
    }, 1200);
  };

  // Create Blog
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `blog-${Date.now()}`,
      ndcId: activeCommunity.id,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: {
        uid: user.uid,
        nickname: user.nickname,
        aminoId: user.aminoId,
        avatar: user.avatar,
        level: user.level,
        role: "Member",
        frame: null
      },
      createdTime: "Just now",
      likesCount: 0,
      hasLiked: false,
      commentsCount: 0,
      mediaList: [],
      tags: newTag ? newTag.split(',').map(t => t.trim()) : ["General"]
    };

    setBlogs([newPost, ...blogs]);
    setNewTitle('');
    setNewContent('');
    setNewTag('');
    setIsCreateOpen(false);
  };

  // Filter blogs by active community
  const communityBlogs = blogs.filter(b => b.ndcId === activeCommunity.id);
  const communityChats = chats.filter(c => c.ndcId === activeCommunity.id);

  return (
    <div className="app-container">
      {/* 1. Leftmost Community Navigation Rail */}
      <aside className="community-rail">
        <div 
          className="rail-logo" 
          title="AltAmino Hub" 
          onClick={() => setActiveTab('explore')}
          id="btn-rail-explore"
        >
          <img src="/assets/amino/amino_logo_white.png" alt="AltAmino" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        </div>
        <div className="rail-divider"></div>

        {communities.map(comm => (
          <div 
            key={comm.id}
            id={`comm-rail-${comm.id}`}
            className={`rail-item ${activeCommunity.id === comm.id && activeTab !== 'explore' ? 'active' : ''}`}
            onClick={() => {
              setActiveCommunity(comm);
              if (activeTab === 'explore') setActiveTab('feed');
            }}
            title={comm.name}
          >
            <img src={comm.icon} alt={comm.name} />
          </div>
        ))}

        <div className="rail-divider"></div>
        <button 
          className="rail-action-btn" 
          title="Explore Communities" 
          onClick={() => setActiveTab('explore')}
          id="btn-explore-tab"
        >
          <Compass size={22} />
        </button>
        <button 
          className="rail-action-btn" 
          title="Server Connection Settings" 
          onClick={() => setIsSettingsOpen(true)}
          id="btn-open-settings"
        >
          <Settings size={20} />
        </button>
      </aside>

      {/* 2. Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="navbar-community-info">
            <img className="navbar-comm-avatar" src={activeCommunity.icon} alt="" />
            <div>
              <div className="navbar-comm-title">
                {activeCommunity.name}
                <span className="navbar-comm-tag">x{activeCommunity.ndcId}</span>
              </div>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="nav-tabs">
            <button 
              id="tab-feed"
              className={`nav-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Flame size={16} /> Community Feed
            </button>
            <button 
              id="tab-chats"
              className={`nav-tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              <MessageSquare size={16} /> Public Chats
            </button>
            <button 
              id="tab-explore"
              className={`nav-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              <Compass size={16} /> Explore All
            </button>
          </nav>

          {/* Right Action Badges & Profile */}
          <div className="navbar-actions">
            {/* Daily Check-In Button */}
            <button 
              id="btn-daily-checkin"
              className={`checkin-btn ${user.hasCheckedInToday ? 'checked' : ''}`}
              onClick={handleCheckIn}
              title={user.hasCheckedInToday ? "Checked in for today!" : "Check in to earn reputation and coins!"}
            >
              <img 
                src="/assets/amino/ic_check_in_streak_checked.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
              />
              {user.hasCheckedInToday ? `Streak: ${user.streak}d` : "Daily Check-In"}
            </button>

            {/* Wallet Coins Counter */}
            <div 
              id="btn-coins-wallet"
              className="coins-badge" 
              onClick={() => setIsProfileOpen(true)}
              title="AltAmino Wallet Balance"
            >
              <img 
                src="/assets/amino/amino_coin_small.png" 
                alt="Coins" 
                style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
              />
              <span>{user.coins.toLocaleString()}</span>
            </div>

            {/* User Profile Pill */}
            <div 
              id="btn-user-profile"
              className="user-profile-pill" 
              onClick={() => setIsProfileOpen(true)}
            >
              <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                <img className="pill-avatar" src={user.avatar} alt={user.nickname} />
                <img 
                  src="/assets/amino/ic_default_avatar_frame.png" 
                  alt="" 
                  style={{ position: 'absolute', inset: '-5px', width: '42px', height: '42px', pointerEvents: 'none' }} 
                />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.nickname}</span>
              <span className="pill-level">LV {user.level}</span>
            </div>
          </div>
        </header>

        {/* Lottery Reward Toast Notification */}
        {checkInReward && (
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '24px',
            zIndex: 99,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.25s ease-out',
            fontWeight: 700
          }}>
            <Sparkles size={20} />
            Checked In! Won +{checkInReward} Coins & +20 Rep!
          </div>
        )}

        {/* Page Body */}
        <main className="content-body">
          {/* TAB 1: FEED VIEW */}
          {activeTab === 'feed' && (
            <div className="feed-container">
              {/* Community Banner Hero */}
              <div className="community-hero">
                <img className="community-hero-bg" src={activeCommunity.banner} alt="" />
                <div className="community-hero-overlay">
                  <div>
                    <h1 className="community-hero-title">{activeCommunity.name}</h1>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
                      {activeCommunity.tagline}
                    </p>
                  </div>
                  <div className="community-hero-stats">
                    <span><strong style={{ color: '#fff' }}>{activeCommunity.membersCount.toLocaleString()}</strong> Members</span>
                    <span><strong style={{ color: '#34d399' }}>{activeCommunity.onlineCount}</strong> Online</span>
                  </div>
                </div>
              </div>

              {/* Feed Sub-Filter + Create Post Trigger */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['featured', 'latest', 'following'].map(ft => (
                    <button
                      key={ft}
                      onClick={() => setFeedType(ft)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background: feedType === ft ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: feedType === ft ? '#a5b4fc' : 'var(--text-secondary)',
                        border: feedType === ft ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
                      }}
                    >
                      {ft}
                    </button>
                  ))}
                </div>

                <button 
                  id="btn-open-create-post"
                  className="gradient-btn" 
                  onClick={() => setIsCreateOpen(true)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  <Plus size={16} /> Write Blog
                </button>
              </div>

              {/* Blog Posts Stream */}
              {communityBlogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p>No blogs published yet in this community. Be the first to post!</p>
                </div>
              ) : (
                communityBlogs.map(blog => (
                  <article key={blog.id} className="blog-card" id={`card-${blog.id}`}>
                    <div className="blog-author-header">
                      <div className="author-meta">
                        <div className="author-avatar-wrap">
                          <img className="author-avatar" src={blog.author.avatar} alt="" />
                        </div>
                        <div>
                          <div className="author-name-row">
                            <span className="author-name">{blog.author.nickname}</span>
                            <span className="pill-level">LV {blog.author.level}</span>
                            {blog.author.role !== 'Member' && (
                              <span className="author-role-badge">{blog.author.role}</span>
                            )}
                          </div>
                          <span className="author-post-time">{blog.createdTime}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="blog-title">{blog.title}</h2>
                    <p className="blog-body-text">{blog.content}</p>

                    {blog.mediaList && blog.mediaList.length > 0 && (
                      <div className="blog-media-preview">
                        <img src={blog.mediaList[0].url} alt="" />
                      </div>
                    )}

                    <div className="blog-tags-row">
                      {blog.tags.map((tg, idx) => (
                        <span key={idx} className="blog-tag">#{tg}</span>
                      ))}
                    </div>

                    <div className="blog-footer-actions">
                      <div className="action-btn-group">
                        <button 
                          className={`interactive-action-btn ${blog.hasLiked ? 'liked' : ''}`}
                          onClick={() => handleLike(blog.id)}
                          id={`like-btn-${blog.id}`}
                        >
                          <Heart size={16} fill={blog.hasLiked ? '#f43f5e' : 'none'} />
                          <span>{blog.likesCount}</span>
                        </button>
                        <button className="interactive-action-btn">
                          <MessageSquare size={16} />
                          <span>{blog.commentsCount}</span>
                        </button>
                      </div>

                      <button 
                        className="tip-btn" 
                        onClick={() => {
                          setSelectedBlogForTip(blog);
                          setIsTipOpen(true);
                        }}
                        id={`tip-btn-${blog.id}`}
                      >
                        <img src="/assets/amino/amino_coin_small.png" alt="" style={{ width: '16px', height: '16px' }} /> Tip Coins
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* TAB 2: CHATS VIEW */}
          {activeTab === 'chats' && (
            <div className="chat-container">
              {/* Room list left sidebar */}
              <div className="chat-rooms-sidebar">
                <div className="chat-sidebar-header">
                  <span>Community Rooms</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {communityChats.length} active
                  </span>
                </div>
                <div className="chat-room-list">
                  {communityChats.map(room => (
                    <div 
                      key={room.id}
                      id={`room-${room.id}`}
                      className={`chat-room-card ${activeChat?.id === room.id ? 'active' : ''}`}
                      onClick={() => setActiveChat(room)}
                    >
                      <img className="room-avatar" src={room.icon} alt="" />
                      <div className="room-text-info">
                        <div className="room-title-row">
                          <span className="room-title">{room.title}</span>
                          {room.channelType === 1 && <span className="room-badge">Voice</span>}
                        </div>
                        <div className="room-snippet">
                          {room.lastMessage?.content || "No messages yet"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat timeline center */}
              <div className="active-chat-area">
                <div className="chat-header">
                  <div className="chat-header-left">
                    <div>
                      <div className="chat-header-title">{activeChat?.title}</div>
                      <div className="chat-header-subtitle">
                        Host: @{activeChat?.host} • {activeChat?.onlineCount} members online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages stream */}
                <div className="messages-timeline">
                  {(messages[activeChat?.id] || []).map(msg => (
                    <div 
                      key={msg.id} 
                      className={`message-row ${msg.isMine ? 'mine' : ''}`}
                    >
                      {!msg.isMine && (
                        <img className="message-avatar" src={msg.authorAvatar} alt="" />
                      )}
                      <div className="message-bubble">
                        {!msg.isMine && (
                          <div className="message-sender-name">
                            {msg.authorName}
                            <span className="pill-level" style={{ fontSize: '9px', padding: '0 4px' }}>
                              LV {msg.authorLevel}
                            </span>
                          </div>
                        )}
                        <div className="message-text">{msg.content}</div>
                        <div className="message-time">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input box */}
                <form className="chat-input-bar" onSubmit={handleSendMessage}>
                  <input 
                    id="chat-input"
                    type="text" 
                    className="chat-input-field" 
                    placeholder="Send a message to the room..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" id="btn-chat-send">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: EXPLORE ALL COMMUNITIES */}
          {activeTab === 'explore' && (
            <div className="feed-container">
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Explore AltAmino Hub</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Discover independent communities powered by the AltAmino open server network.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                {communities.map(comm => (
                  <div 
                    key={comm.id} 
                    className="glass-panel" 
                    style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={comm.icon} 
                        alt="" 
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{comm.name}</div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>x{comm.ndcId}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, minHeight: '36px' }}>
                      {comm.tagline}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {comm.tags.map((t, idx) => (
                        <span key={idx} className="blog-tag">#{t}</span>
                      ))}
                    </div>
                    <button 
                      className="gradient-btn" 
                      style={{ marginTop: 'auto', justifyContent: 'center', padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => {
                        setActiveCommunity(comm);
                        setActiveTab('feed');
                      }}
                    >
                      Enter Community <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: Create Blog */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create Blog Post</span>
              <button className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>✕</button>
            </div>

            {/* Official Amino Compose Action Buttons Row */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
              {[
                { name: 'Blog', img: '/assets/amino/compose_button_blog.png', active: true },
                { name: 'Poll', img: '/assets/amino/compose_button_poll.png' },
                { name: 'Quiz', img: '/assets/amino/compose_button_quiz.png' },
                { name: 'Chat', img: '/assets/amino/compose_button_chat.png' },
                { name: 'Link', img: '/assets/amino/compose_button_link.png' },
              ].map(opt => (
                <div key={opt.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <img src={opt.img} alt={opt.name} style={{ width: '44px', height: '44px', transition: 'transform 0.2s' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: opt.active ? '#a5b4fc' : 'var(--text-muted)' }}>{opt.name}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreatePost} className="modal-body">
              <input 
                id="input-post-title"
                type="text" 
                className="form-input" 
                placeholder="Post title..." 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <textarea 
                id="input-post-content"
                className="form-input form-textarea" 
                placeholder="Write your story, review, or thoughts..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
              />
              <input 
                id="input-post-tags"
                type="text" 
                className="form-input" 
                placeholder="Tags separated by commas (e.g. Art, Review, Gaming)" 
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="nav-tab-btn" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="gradient-btn" id="btn-submit-post">
                  Publish Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: User Profile & Wallet */}
      {isProfileOpen && (
        <div className="modal-backdrop" onClick={() => setIsProfileOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="profile-hero">
              <div style={{ position: 'absolute', bottom: '-38px', left: '24px', width: '76px', height: '76px' }}>
                <img className="profile-avatar-large" src={user.avatar} alt="" style={{ position: 'static' }} />
                <img 
                  src="/assets/amino/ic_default_avatar_frame.png" 
                  alt="" 
                  style={{ position: 'absolute', inset: '-12px', width: '100px', height: '100px', pointerEvents: 'none' }} 
                />
              </div>
            </div>
            <div className="profile-info-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{user.nickname}</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{user.aminoId}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="pill-level" style={{ padding: '3px 8px', fontSize: '11px' }}>
                    LEVEL {user.level}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.bio}</p>

              {/* Reputation Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reputation XP</span>
                  <span style={{ fontWeight: 700 }}>{user.reputation} / {user.nextLevelRep} XP</span>
                </div>
                <div className="rep-bar-container">
                  <div 
                    className="rep-bar-fill" 
                    style={{ width: `${(user.reputation / user.nextLevelRep) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Coins & Streak Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AltAmino Coins</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="/assets/amino/amino_coin_small.png" style={{ width: '20px', height: '20px' }} alt="" />
                    {user.coins.toLocaleString()}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Check-In Streak</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="/assets/amino/ic_check_in_streak_checked.png" style={{ width: '20px', height: '20px' }} alt="" />
                    {user.streak} Days
                  </div>
                </div>
              </div>

              <button 
                className="gradient-btn" 
                style={{ justifyContent: 'center' }}
                onClick={() => setIsProfileOpen(false)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Tip Coins */}
      {isTipOpen && (
        <div className="modal-backdrop" onClick={() => setIsTipOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/assets/amino/ic_chat_input_tip.png" alt="" style={{ width: '24px', height: '24px' }} />
                <span className="modal-title">Tip Creator Coins</span>
              </div>
              <button className="modal-close-btn" onClick={() => setIsTipOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img 
                src="/assets/amino/amino_coin_big.png" 
                alt="Coins" 
                style={{ width: '64px', height: '64px', margin: '0 auto 8px', filter: 'drop-shadow(0 6px 16px rgba(245, 158, 11, 0.4))' }} 
              />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Reward the author of <strong>"{selectedBlogForTip?.title}"</strong> directly with Amino Coins!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '14px 0' }}>
                {[5, 10, 25, 50, 100, 250].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => handleTip(amt)}
                    className="glass-panel"
                    style={{
                      padding: '12px 8px',
                      color: '#fbbf24',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <img src="/assets/amino/amino_coin_small.png" style={{ width: '14px', height: '14px' }} alt="" />
                    +{amt}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Your wallet: <strong>{user.coins} Coins</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Server Settings */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">Server Connection Settings</span>
              <button className="modal-close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Configure the AltAmino API endpoint. Point to your local Python dev server or the public instance:
              </p>
              <input 
                type="text" 
                className="form-input" 
                value={serverUrl}
                onChange={e => setServerUrl(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="nav-tab-btn" 
                  style={{ border: '1px solid var(--border-subtle)', flex: 1 }}
                  onClick={() => setServerUrl('http://localhost:33333/api/v1')}
                >
                  Local Backend
                </button>
                <button 
                  className="nav-tab-btn" 
                  style={{ border: '1px solid var(--border-subtle)', flex: 1 }}
                  onClick={() => setServerUrl('https://service.altamino.top/api/v1')}
                >
                  Public AltAmino Server
                </button>
              </div>
              <button 
                className="gradient-btn" 
                style={{ justifyContent: 'center', marginTop: '10px' }}
                onClick={() => setIsSettingsOpen(false)}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
