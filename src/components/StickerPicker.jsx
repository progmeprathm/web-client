import React, { useState } from 'react';
import { Smile, Sparkles, Heart, Zap } from 'lucide-react';

export const STICKER_PACKS = [
  {
    id: 'pack-mascot',
    name: 'AltAmino Mascot',
    icon: '✨',
    stickers: [
      { id: 'stk-1', name: 'Wave Hi', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-2', name: 'Coin Flex', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-3', name: 'Celebration', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-4', name: 'Thumbs Up', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'pack-chibi',
    name: 'Chibi Reactions',
    icon: '💖',
    stickers: [
      { id: 'stk-5', name: 'Love Heart', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-6', name: 'Shocked', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-7', name: 'Sparkle Eyes', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-8', name: 'Sleepy', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'pack-gaming',
    name: 'Cyber & Arcade',
    icon: '⚡',
    stickers: [
      { id: 'stk-9', name: 'GG WP', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-10', name: 'Level Up', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-11', name: 'Victory Cup', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80' },
      { id: 'stk-12', name: 'Pixel Bot', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80' }
    ]
  }
];

export default function StickerPicker({ onSelectSticker, onClose }) {
  const [activePackId, setActivePackId] = useState(STICKER_PACKS[0].id);

  const currentPack = STICKER_PACKS.find(p => p.id === activePackId) || STICKER_PACKS[0];

  return (
    <div style={{
      position: 'absolute',
      bottom: '70px',
      left: '20px',
      width: '320px',
      background: '#0e121d',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
      padding: '14px',
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#f59e0b" /> Amino Sticker Vault
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
        >
          ✕
        </button>
      </div>

      {/* Sticker Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxHeight: '180px',
        overflowY: 'auto',
        padding: '6px 2px'
      }}>
        {currentPack.stickers.map((stk) => (
          <button
            key={stk.id}
            onClick={() => onSelectSticker(stk)}
            title={stk.name}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease, background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={stk.url}
              alt={stk.name}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '50px' }}>
              {stk.name}
            </span>
          </button>
        ))}
      </div>

      {/* Pack Tabs at the bottom */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {STICKER_PACKS.map(pack => (
          <button
            key={pack.id}
            onClick={() => setActivePackId(pack.id)}
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              background: activePackId === pack.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activePackId === pack.id ? '#a5b4fc' : 'var(--text-secondary)',
              border: activePackId === pack.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>{pack.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pack.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
