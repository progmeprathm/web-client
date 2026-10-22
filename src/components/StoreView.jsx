import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, Coins, Eye } from 'lucide-react';

export const STORE_ITEMS = [
  {
    id: 'frame-cyber',
    type: 'frame',
    name: 'Cyber Neon Pulse',
    description: 'Electrifying cyan and magenta cybernetic ring with pulsating energy.',
    price: 150,
    icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
    frameAsset: '/assets/amino/ic_default_avatar_frame.png',
    frameColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)'
  },
  {
    id: 'frame-sakura',
    type: 'frame',
    name: 'Sakura Blossom Bloom',
    description: 'Delicate pink cherry blossom petals gently rotating around your avatar.',
    price: 200,
    icon: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=150&auto=format&fit=crop&q=80',
    frameAsset: '/assets/amino/ic_default_avatar_frame.png',
    frameColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)'
  },
  {
    id: 'frame-gold',
    type: 'frame',
    name: 'Golden Leader Crown',
    description: 'Radiant 24K gold laurels reserved for community legends and curators.',
    price: 350,
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80',
    frameAsset: '/assets/amino/ic_default_avatar_frame.png',
    frameColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)'
  },
  {
    id: 'frame-pixel',
    type: 'frame',
    name: '8-Bit Retro Arcade',
    description: 'Chiptune nostalgia with pixelated animated border.',
    price: 120,
    icon: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    frameAsset: '/assets/amino/ic_default_avatar_frame.png',
    frameColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)'
  },
  {
    id: 'bubble-galaxy',
    type: 'bubble',
    name: 'Deep Cosmos Chat Bubble',
    description: 'Starlight gradient speech bubble with subtle cosmic dust sparkles.',
    price: 250,
    icon: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    bubbleStyle: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
      borderColor: '#818cf8',
      color: '#e0e7ff'
    }
  },
  {
    id: 'bubble-matrix',
    type: 'bubble',
    name: 'Matrix Terminal Bubble',
    description: 'Monospace hacker dark theme with neon phosphor green borders.',
    price: 180,
    icon: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
    bubbleStyle: {
      background: '#04160d',
      borderColor: '#10b981',
      color: '#34d399'
    }
  }
];

export default function StoreView({ user, onUpdateUser }) {
  const [activeCategory, setActiveCategory] = useState('frame'); // 'frame' | 'bubble'
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(STORE_ITEMS[0]);
  const [ownedItemIds, setOwnedItemIds] = useState(['frame-default']);
  const [equippedFrameId, setEquippedFrameId] = useState(user.equippedFrameId || null);
  const [equippedBubbleId, setEquippedBubbleId] = useState(user.equippedBubbleId || null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);

  const filteredItems = STORE_ITEMS.filter(item => item.type === activeCategory);

  const handlePurchaseOrEquip = (item) => {
    const isOwned = ownedItemIds.includes(item.id);

    if (isOwned) {
      // Toggle equip/unequip
      if (item.type === 'frame') {
        const next = equippedFrameId === item.id ? null : item.id;
        setEquippedFrameId(next);
        onUpdateUser({ equippedFrameId: next, equippedFrame: next ? item : null });
      } else {
        const next = equippedBubbleId === item.id ? null : item.id;
        setEquippedBubbleId(next);
        onUpdateUser({ equippedBubbleId: next, equippedBubble: next ? item : null });
      }
      return;
    }

    // Purchase check
    if (user.coins < item.price) {
      alert(`You need ${item.price} coins, but only have ${user.coins} coins! Check in daily to get more.`);
      return;
    }

    // Process purchase
    const remainingCoins = user.coins - item.price;
    setOwnedItemIds([...ownedItemIds, item.id]);

    if (item.type === 'frame') {
      setEquippedFrameId(item.id);
      onUpdateUser({
        coins: remainingCoins,
        equippedFrameId: item.id,
        equippedFrame: item
      });
    } else {
      setEquippedBubbleId(item.id);
      onUpdateUser({
        coins: remainingCoins,
        equippedBubbleId: item.id,
        equippedBubble: item
      });
    }

    setPurchaseSuccess(item.name);
    setTimeout(() => setPurchaseSuccess(null), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      {/* Store Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '30px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            <Sparkles size={16} /> ALTAMINO OFFICIAL STORE
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Avatar Frames & Chat Bubbles
          </h1>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '520px' }}>
            Stand out in community feeds and public chats! Unlock exclusive animated avatar frames and custom chat bubbles using your daily check-in coins.
          </p>
        </div>

        {/* User Balance Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '16px 24px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Your Balance</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <img src="/assets/amino/amino_coin_big.png" alt="Coins" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>
              {user.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {purchaseSuccess && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Check size={20} />
          Successfully purchased & equipped "{purchaseSuccess}"!
        </div>
      )}

      {/* 2-Column Layout: Catalog on Left, Live Fitting Room on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Left Column: Item Grid */}
        <div>
          {/* Category Switcher */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <button
              onClick={() => setActiveCategory('frame')}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeCategory === 'frame' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activeCategory === 'frame' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Avatar Frames
            </button>
            <button
              onClick={() => setActiveCategory('bubble')}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeCategory === 'bubble' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activeCategory === 'bubble' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Chat Bubbles
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filteredItems.map(item => {
              const isOwned = ownedItemIds.includes(item.id);
              const isEquipped = item.type === 'frame' ? equippedFrameId === item.id : equippedBubbleId === item.id;
              const isSelected = selectedPreviewItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPreviewItem(item)}
                  style={{
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.3)',
                        border: `2px solid ${item.frameColor || '#818cf8'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: `0 0 16px ${item.glowColor || 'rgba(99,102,241,0.3)'}`
                      }}>
                        <img src={item.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', padding: '4px 8px', borderRadius: '8px' }}>
                        <img src="/assets/amino/amino_coin_small.png" alt="" style={{ width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>{item.price}</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchaseOrEquip(item);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      background: isEquipped 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : (isOwned ? 'rgba(99, 102, 241, 0.2)' : 'var(--primary)'),
                      color: isEquipped ? '#34d399' : (isOwned ? '#a5b4fc' : '#fff'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isEquipped ? (
                      <><Check size={14} /> Equipped</>
                    ) : isOwned ? (
                      'Equip'
                    ) : (
                      <><Coins size={14} /> Buy for {item.price}</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Fitting Preview */}
        <div style={{
          background: '#0e121d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '24px',
          height: 'fit-content',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
            <Eye size={16} /> Live Fitting Room
          </div>

          {/* Avatar Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
            <div style={{ position: 'relative', width: '96px', height: '96px', marginBottom: '14px' }}>
              <img
                src={user.avatar}
                alt={user.nickname}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
              {/* Frame overlay */}
              {selectedPreviewItem?.type === 'frame' ? (
                <div style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  border: `3px solid ${selectedPreviewItem.frameColor}`,
                  boxShadow: `0 0 24px ${selectedPreviewItem.glowColor}`,
                  pointerEvents: 'none',
                  animation: 'pulseGlow 2.5s infinite ease-in-out'
                }} />
              ) : equippedFrameId ? (
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  border: '2px solid #818cf8',
                  pointerEvents: 'none'
                }} />
              ) : null}
            </div>

            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.nickname}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Level {user.level} • {user.role || 'Member'}
            </span>
          </div>

          {/* Sample Chat Message Preview */}
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Chat Bubble Preview
            </span>
            <div style={{
              ...(selectedPreviewItem?.type === 'bubble' ? selectedPreviewItem.bubbleStyle : {
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-primary)'
              }),
              padding: '12px 16px',
              borderRadius: '14px',
              borderWidth: '1px',
              borderStyle: 'solid',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              Hey everyone! Checking out the new store items. How does this style look? ✨
            </div>
          </div>

          {/* Bottom Action Button for selected item */}
          {selectedPreviewItem && (
            <button
              onClick={() => handlePurchaseOrEquip(selectedPreviewItem)}
              className="gradient-btn"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Coins size={16} />
              {ownedItemIds.includes(selectedPreviewItem.id)
                ? (equippedFrameId === selectedPreviewItem.id || equippedBubbleId === selectedPreviewItem.id ? 'Unequip Item' : 'Equip Selected Item')
                : `Unlock for ${selectedPreviewItem.price} Coins`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
