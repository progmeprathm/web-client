import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Hand, Radio, Volume2, Users, Play, Pause, ShieldCheck, Heart } from 'lucide-react';

const INITIAL_SPEAKERS = [
  { id: 's-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', role: 'Host', isMuted: false, isSpeaking: true },
  { id: 's-2', name: 'Kira_San', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Co-Host', isMuted: false, isSpeaking: false },
  { id: 's-3', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', role: 'Speaker', isMuted: true, isSpeaking: false }
];

const INITIAL_AUDIENCE = [
  { id: 'a-1', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' },
  { id: 'a-2', name: 'Aiko_Chii', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80' },
  { id: 'a-3', name: 'NeonRider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
  { id: 'a-4', name: 'PixelMage', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80' },
  { id: 'a-5', name: 'StarGazer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' }
];

export default function VoiceStageView({ chat, user, onBack }) {
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [audience, setAudience] = useState(INITIAL_AUDIENCE);
  const [isMyMicOn, setIsMyMicOn] = useState(false);
  const [isOnStage, setIsOnStage] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isScreeningRoomActive, setIsScreeningRoomActive] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [audioWaves, setAudioWaves] = useState([20, 45, 80, 50, 95, 30, 70, 60, 85, 40]);

  // Audio wave visualizer pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setAudioWaves(prev => prev.map(() => Math.floor(Math.random() * 75) + 20));
      // Randomly toggle speaking indicator
      setSpeakers(prev => prev.map((s, idx) => {
        if (s.isMuted) return { ...s, isSpeaking: false };
        if (idx === 0) return { ...s, isSpeaking: Math.random() > 0.3 };
        return { ...s, isSpeaking: Math.random() > 0.7 };
      }));
    }, 450);

    return () => clearInterval(timer);
  }, []);

  const handleRaiseHand = () => {
    if (isOnStage) return;
    setHandRaised(true);
    // Simulated host accepts user to stage after 2 seconds
    setTimeout(() => {
      setIsOnStage(true);
      setHandRaised(false);
      setSpeakers(prev => [
        ...prev,
        {
          id: user.uid,
          name: `${user.nickname} (You)`,
          avatar: user.avatar,
          role: 'Speaker',
          isMuted: true,
          isSpeaking: false
        }
      ]);
    }, 2000);
  };

  const handleToggleMyMic = () => {
    const nextState = !isMyMicOn;
    setIsMyMicOn(nextState);
    setSpeakers(prev => prev.map(s => s.id === user.uid ? { ...s, isMuted: !nextState } : s));
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      background: '#07090e',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Voice Stage Top Bar */}
      <div style={{
        padding: '16px 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            ← Back to Room
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: 700
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} /> LIVE
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>
                {chat?.title || "🎙 Anime Voice Stage & Screening Room"}
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Host: shaderw0lf • 115 members listening
            </span>
          </div>
        </div>

        {/* Screening Room Mode Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsScreeningRoomActive(!isScreeningRoomActive)}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              background: isScreeningRoomActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: isScreeningRoomActive ? '1px solid #6366f1' : '1px solid transparent',
              color: isScreeningRoomActive ? '#a5b4fc' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} /> Screening Room Screen
          </button>
        </div>
      </div>

      {/* Screening Room Media Player Area */}
      {isScreeningRoomActive && (
        <div style={{
          position: 'relative',
          height: '240px',
          background: 'linear-gradient(180deg, #090d16 0%, #030712 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Animated Background Visualizer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            background: 'radial-gradient(circle at center, #6366f1 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Equalizer Frequency Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px', marginBottom: '16px' }}>
            {audioWaves.map((h, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: `${h}%`,
                  background: 'linear-gradient(180deg, #06b6d4 0%, #6366f1 100%)',
                  borderRadius: '4px',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              🎵 AltAmino Radio: Lofi Anime Chill Beats 24/7
            </span>
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isPlayingMusic ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Main Stage: Speakers Podium */}
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          <Mic size={16} /> STAGE SPEAKERS ({speakers.length})
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {speakers.map(speaker => (
            <div
              key={speaker.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: speaker.isSpeaking 
                  ? '2px solid #10b981' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: speaker.isSpeaking ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ position: 'relative', width: '72px', height: '72px', marginBottom: '10px' }}>
                <img
                  src={speaker.avatar}
                  alt=""
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
                {/* Speaking Ring */}
                {speaker.isSpeaking && (
                  <div style={{
                    position: 'absolute',
                    inset: '-6px',
                    borderRadius: '50%',
                    border: '3px solid #10b981',
                    animation: 'pulseGlow 1.2s infinite ease-in-out',
                    pointerEvents: 'none'
                  }} />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: speaker.isMuted ? '#ef4444' : '#10b981',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  border: '2px solid #0e121d'
                }}>
                  {speaker.isMuted ? <MicOff size={12} /> : <Mic size={12} />}
                </div>
              </div>

              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                {speaker.name}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: speaker.role === 'Host' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: speaker.role === 'Host' ? '#f59e0b' : '#a5b4fc',
                fontWeight: 600
              }}>
                {speaker.role}
              </span>
            </div>
          ))}
        </div>

        {/* Audience Listeners Grid */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
              <Users size={16} /> AUDIENCE ({audience.length + 110})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {audience.map(listener => (
              <div key={listener.id} title={listener.name} style={{ textAlign: 'center' }}>
                <img
                  src={listener.avatar}
                  alt=""
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                />
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '44px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {listener.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Bottom Controls */}
      <div style={{
        padding: '16px 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isOnStage ? (
            <button
              onClick={handleToggleMyMic}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                background: isMyMicOn ? '#10b981' : 'rgba(239, 68, 68, 0.2)',
                border: isMyMicOn ? 'none' : '1px solid #ef4444',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isMyMicOn ? <Mic size={16} /> : <MicOff size={16} />}
              {isMyMicOn ? 'Mic Unmuted' : 'Mic Muted'}
            </button>
          ) : (
            <button
              onClick={handleRaiseHand}
              disabled={handRaised}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: handRaised ? 'rgba(245, 158, 11, 0.2)' : 'var(--primary)',
                border: handRaised ? '1px solid #f59e0b' : 'none',
                color: handRaised ? '#f59e0b' : '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Hand size={16} />
              {handRaised ? 'Hand Raised... Waiting for Host' : 'Request to Speak (Raise Hand)'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Leave Stage
          </button>
        </div>
      </div>
    </div>
  );
}
