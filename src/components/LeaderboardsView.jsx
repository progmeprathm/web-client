import React, { useState } from 'react';
import { Trophy, Flame, Calendar, Award, Crown, Star } from 'lucide-react';

const MOCK_LEADERBOARDS = {
  daily: [
    { rank: 1, uid: 'u-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', level: 16, score: '420 mins', role: 'Leader' },
    { rank: 2, uid: 'u-2', name: 'Kira_San', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 14, score: '385 mins', role: 'Curator' },
    { rank: 3, uid: 'u-3', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', level: 15, score: '310 mins', role: 'Curator' },
    { rank: 4, uid: 'u-4', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', level: 14, score: '265 mins', role: 'Curator' },
    { rank: 5, uid: 'u-5', name: 'Aiko_Chii', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', level: 13, score: '210 mins', role: 'Member' },
    { rank: 6, uid: 'u-6', name: 'NeonRider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', level: 12, score: '180 mins', role: 'Member' },
    { rank: 7, uid: 'u-7', name: 'PixelMage', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', level: 11, score: '145 mins', role: 'Member' }
  ],
  weekly: [
    { rank: 1, uid: 'u-2', name: 'Kira_San', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 14, score: '2,480 mins', role: 'Curator' },
    { rank: 2, uid: 'u-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', level: 16, score: '2,150 mins', role: 'Leader' },
    { rank: 3, uid: 'u-4', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', level: 14, score: '1,920 mins', role: 'Curator' },
    { rank: 4, uid: 'u-3', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', level: 15, score: '1,640 mins', role: 'Curator' },
    { rank: 5, uid: 'u-5', name: 'Aiko_Chii', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', level: 13, score: '1,320 mins', role: 'Member' }
  ],
  streak: [
    { rank: 1, uid: 'u-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', level: 16, score: '184 Days 🔥', role: 'Leader' },
    { rank: 2, uid: 'u-3', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', level: 15, score: '142 Days 🔥', role: 'Curator' },
    { rank: 3, uid: 'u-4', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', level: 14, score: '98 Days 🔥', role: 'Curator' },
    { rank: 4, uid: 'u-2', name: 'Kira_San', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 14, score: '76 Days 🔥', role: 'Curator' }
  ],
  hallOfFame: [
    { rank: 1, uid: 'u-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', level: 16, score: '48,200 Rep', role: 'Leader' },
    { rank: 2, uid: 'u-3', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80', level: 15, score: '34,900 Rep', role: 'Curator' },
    { rank: 3, uid: 'u-4', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', level: 14, score: '28,400 Rep', role: 'Curator' }
  ]
};

export default function LeaderboardsView({ activeCommunity, user }) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'streak' | 'hallOfFame'

  const rankings = MOCK_LEADERBOARDS[activeTab] || MOCK_LEADERBOARDS.daily;
  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: '#f59e0b', color: '#000', icon: '👑', label: '1st' };
    if (rank === 2) return { bg: '#94a3b8', color: '#000', icon: '🥈', label: '2nd' };
    if (rank === 3) return { bg: '#b45309', color: '#fff', icon: '🥉', label: '3rd' };
    return { bg: 'rgba(255,255,255,0.1)', color: '#fff', icon: null, label: `#${rank}` };
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px 0' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
            <Trophy size={16} /> {activeCommunity.name}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>
            Community Leaderboards
          </h1>
          <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
            Top contributors, daily active members, and check-in streak champions.
          </p>
        </div>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Crown size={28} color="#f59e0b" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '6px',
        borderRadius: '14px',
        marginBottom: '24px'
      }}>
        {[
          { id: 'daily', label: 'Most Active (24h)', icon: Flame },
          { id: 'weekly', label: 'Last 7 Days', icon: Calendar },
          { id: 'streak', label: 'Check-In Streaks', icon: Award },
          { id: 'hallOfFame', label: 'Hall of Fame', icon: Trophy }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Podium for Top 3 */}
      {topThree.length >= 3 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          gap: '16px',
          alignItems: 'flex-end',
          marginBottom: '28px',
          padding: '0 10px'
        }}>
          {/* 2nd Place */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '16px',
            padding: '20px 14px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '8px' }}>
              <img src={topThree[1].avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-6px', right: '-4px', background: '#94a3b8', color: '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                2
              </div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{topThree[1].name}</span>
            <span className="pill-level" style={{ margin: '4px 0' }}>LV {topThree[1].level}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>{topThree[1].score}</span>
          </div>

          {/* 1st Place (Center Podium) */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '20px',
            padding: '28px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translateY(-10px)',
            boxShadow: '0 12px 36px rgba(245, 158, 11, 0.2)'
          }}>
            <Crown size={24} color="#f59e0b" style={{ marginBottom: '6px' }} />
            <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '10px' }}>
              <img src={topThree[0].avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-8px', right: '-4px', background: '#f59e0b', color: '#000', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                1
              </div>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{topThree[0].name}</span>
            <span className="pill-level" style={{ margin: '4px 0' }}>LV {topThree[0].level}</span>
            <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: 800 }}>{topThree[0].score}</span>
          </div>

          {/* 3rd Place */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(180, 83, 9, 0.3)',
            borderRadius: '16px',
            padding: '20px 14px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '8px' }}>
              <img src={topThree[2].avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-6px', right: '-4px', background: '#b45309', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                3
              </div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{topThree[2].name}</span>
            <span className="pill-level" style={{ margin: '4px 0' }}>LV {topThree[2].level}</span>
            <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>{topThree[2].score}</span>
          </div>
        </div>
      )}

      {/* Ranks 4+ List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {remaining.map((item) => (
          <div
            key={item.uid}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '24px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
                #{item.rank}
              </span>
              <img src={item.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
                  <span className="pill-level">LV {item.level}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.role}</span>
              </div>
            </div>

            <span style={{ fontSize: '14px', fontWeight: 700, color: '#a5b4fc' }}>
              {item.score}
            </span>
          </div>
        ))}
      </div>

      {/* User's Own Ranking Pin */}
      <div style={{
        marginTop: '24px',
        padding: '14px 20px',
        borderRadius: '14px',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '24px', fontSize: '14px', fontWeight: 800, color: '#818cf8', textAlign: 'center' }}>
            #14
          </span>
          <img src={user.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{user.nickname} (You)</span>
              <span className="pill-level">LV {user.level}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#a5b4fc' }}>Current Streak: {user.streak}d</span>
          </div>
        </div>

        <span style={{ fontSize: '14px', fontWeight: 800, color: '#818cf8' }}>
          {activeTab === 'streak' ? `${user.streak} Days 🔥` : '85 mins'}
        </span>
      </div>
    </div>
  );
}
