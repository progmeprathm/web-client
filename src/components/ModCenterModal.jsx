import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Ban, Pin, EyeOff, FileText, UserCheck } from 'lucide-react';

const INITIAL_FLAGS = [
  {
    id: 'flag-1',
    type: 'blog',
    title: 'Off-topic spam in Anime community',
    reportedBy: 'Kira_San',
    reason: 'Spam / Advertising external links',
    targetTitle: 'Free gift cards download now!',
    targetAuthor: 'SpamBot99',
    timestamp: '15m ago',
    status: 'pending'
  },
  {
    id: 'flag-2',
    type: 'chat',
    title: 'Harassment reported in Global Tavern',
    reportedBy: 'CyberSamurai',
    reason: 'Inappropriate language & insults',
    targetTitle: 'Global Tavern #12',
    targetAuthor: 'TrollUser',
    timestamp: '42m ago',
    status: 'pending'
  }
];

export default function ModCenterModal({ isOpen, onClose, blogs, onFeatureBlog, onDisableBlog }) {
  const [activeTab, setActiveTab] = useState('flags'); // 'flags' | 'featured' | 'log'
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [modLogs, setModLogs] = useState([
    { id: 'log-1', admin: 'shaderw0lf', action: 'Featured Post', target: 'Welcome to AltAmino Web! 🚀', time: '2 hours ago' },
    { id: 'log-2', admin: 'alx0rr', action: 'Disabled Post', target: 'Scam bot advertisement', time: 'Yesterday' }
  ]);
  const [feedbackToast, setFeedbackToast] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(''), 3000);
  };

  const handleResolveFlag = (flagId, action) => {
    setFlags(prev => prev.filter(f => f.id !== flagId));
    const targetFlag = flags.find(f => f.id === flagId);
    setModLogs(prev => [
      {
        id: `log-${Date.now()}`,
        admin: 'You (Curator)',
        action: action === 'disable' ? 'Disabled Content' : 'Dismissed Flag',
        target: targetFlag?.targetTitle || 'Reported Content',
        time: 'Just now'
      },
      ...prev
    ]);
    showToast(`Flag resolved: ${action === 'disable' ? 'Content disabled' : 'Flag dismissed'}`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0e121d',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85vh',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Curator & Leader Mod Center
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Community Safety & Content Moderation Tools
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {feedbackToast && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            color: '#34d399',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            ✓ {feedbackToast}
          </div>
        )}

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          padding: '12px 24px',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { id: 'flags', label: `Flag Center (${flags.length})`, icon: AlertTriangle },
            { id: 'featured', label: 'Feature Manager', icon: Pin },
            { id: 'log', label: 'Moderation History', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: FLAG CENTER */}
          {activeTab === 'flags' && (
            <div>
              {flags.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <CheckCircle size={36} color="#10b981" style={{ marginBottom: '10px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Flag Center Clean!</p>
                  <p style={{ fontSize: '12px' }}>No reported content requiring review at this time.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {flags.map(flag => (
                    <div
                      key={flag.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '14px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                          REPORTED {flag.type.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{flag.timestamp}</span>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                        "{flag.targetTitle}"
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <strong>Reason:</strong> {flag.reason} (Reported by {flag.reportedBy})
                      </p>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button
                          onClick={() => handleResolveFlag(flag.id, 'disable')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <EyeOff size={14} /> Disable Content
                        </button>
                        <button
                          onClick={() => handleResolveFlag(flag.id, 'dismiss')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Dismiss Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEATURE MANAGER */}
          {activeTab === 'featured' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Select a community blog to Pin or Feature on the front page for 1, 2, or 3 days:
              </p>
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {blog.title}
                    </h5>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      by {blog.author.nickname} • {blog.likesCount} likes
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        onFeatureBlog(blog.id, 1);
                        showToast(`Featured "${blog.title}" for 1 Day`);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid #6366f1',
                        color: '#a5b4fc',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Feature 1d
                    </button>
                    <button
                      onClick={() => {
                        onFeatureBlog(blog.id, 3);
                        showToast(`Featured "${blog.title}" for 3 Days`);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #f59e0b',
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Feature 3d
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MODERATION AUDIT LOG */}
          {activeTab === 'log' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {modLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {log.admin} <span style={{ color: '#818cf8' }}>{log.action}</span>
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>
                      Target: {log.target}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
