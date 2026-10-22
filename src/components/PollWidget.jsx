import React, { useState } from 'react';
import { BarChart3, CheckCircle, Clock } from 'lucide-react';

export default function PollWidget({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState(poll.userVote || null);
  const [hasVoted, setHasVoted] = useState(poll.hasVoted || false);
  const [options, setOptions] = useState(poll.options);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes || 0);

  const handleVote = (optionId) => {
    if (hasVoted && selectedOption === optionId) return;

    const newOptions = options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      if (hasVoted && opt.id === selectedOption) {
        return { ...opt, votes: Math.max(0, opt.votes - 1) };
      }
      return opt;
    });

    const newTotal = hasVoted ? totalVotes : totalVotes + 1;
    setSelectedOption(optionId);
    setHasVoted(true);
    setOptions(newOptions);
    setTotalVotes(newTotal);

    if (onVote) {
      onVote(poll.id, optionId);
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.65)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '18px 20px',
      marginTop: '16px',
      marginBottom: '16px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '13px', fontWeight: 600 }}>
          <BarChart3 size={16} />
          <span>COMMUNITY POLL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Clock size={14} />
          <span>{poll.daysLeft || 3} days left</span>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
        {poll.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isSelected 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected 
                  ? '1px solid #6366f1' 
                  : '1px solid rgba(255, 255, 255, 0.06)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Animated Progress Bar fill behind text */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${percentage}%`,
                  background: isSelected 
                    ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  transition: 'width 0.4s ease',
                  zIndex: 0
                }}
              />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
                {isSelected ? (
                  <CheckCircle size={18} color="#6366f1" />
                ) : (
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
                )}
                <span>{opt.text}</span>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#a5b4fc' : 'var(--text-secondary)' }}>
                  {percentage}%
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ({opt.votes})
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>{totalVotes.toLocaleString()} total votes</span>
        <span>{hasVoted ? '✓ Vote submitted' : 'Click any option to vote'}</span>
      </div>
    </div>
  );
}
