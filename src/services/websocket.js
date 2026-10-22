// AltAmino Real-time WebSocket Gateway Service
// Implements the NDC WebSocket Protocol with auto-reconnect and offline mock fallback
import { getOrCreateDeviceId } from '../utils/deviceGenerator';

class AminoWebSocketClient {
  constructor() {
    this.ws = null;
    this.url = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
    this.typingTimeouts = new Map();
    this.isSimulated = false;
    this.simulatedInterval = null;
  }

  /**
   * Connect to AltAmino WebSocket gateway
   * @param {string} serverBase - e.g. "wss://ws1.altamino.top" or "ws://localhost:33334"
   * @param {Object} auth - { uid, sid, deviceId }
   */
  connect(serverBase = "wss://ws1.altamino.top", auth = {}) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const deviceId = auth.deviceId || getOrCreateDeviceId();
    const timestamp = Date.now();
    const signbody = encodeURIComponent(`${deviceId}|${timestamp}`);

    let formattedUrl = serverBase.startsWith('ws://') || serverBase.startsWith('wss://')
      ? serverBase
      : `ws://${serverBase}`;

    formattedUrl = `${formattedUrl}/?signbody=${signbody}`;
    this.url = formattedUrl;

    try {
      this.ws = new WebSocket(formattedUrl);

      this.ws.onopen = () => {
        console.log("[AltAmino WS] Gateway connected:", formattedUrl);
        this.isConnected = true;
        this.isSimulated = false;
        this.reconnectAttempts = 0;
        this._emit('connection', { status: 'connected', simulated: false });

        // Send NDC Handshake / Auth frame if token available
        if (auth.sid) {
          this.send({
            t: 100, // Handshake / Auth
            o: {
              ndcAuth: auth.sid,
              ndcDeviceId: deviceId,
              uid: auth.uid
            }
          });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._handleIncomingPacket(data);
        } catch (e) {
          console.warn("[AltAmino WS] Received non-JSON packet:", event.data);
        }
      };

      this.ws.onerror = (err) => {
        // Handshake requires live session token; gracefully fallback without spamming
        this._startSimulatedGateway();
      };

      this.ws.onclose = (event) => {
        this.isConnected = false;
        this._emit('connection', { status: 'disconnected' });
        if (event.code === 1008 || event.code === 1006 || !auth.isLiveSession) {
          // Handshake unauthorized on live cluster, switch to simulated live chatter
          this._startSimulatedGateway();
        } else {
          this._attemptReconnect(serverBase, auth);
        }
      };
    } catch (e) {
      this._startSimulatedGateway();
    }
  }

  _attemptReconnect(serverBase, auth) {
    if (this.reconnectAttempts < 2 && auth.isLiveSession) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(serverBase, auth), 3000);
    } else {
      this._startSimulatedGateway();
    }
  }

  _startSimulatedGateway() {
    this.isSimulated = true;
    this.isConnected = true;
    this._emit('connection', { status: 'connected', simulated: true });

    if (this.simulatedInterval) clearInterval(this.simulatedInterval);

    // Periodically simulate live community chatter
    this.simulatedInterval = setInterval(() => {
      const activeChats = ['chat-1', 'chat-2', 'chat-3'];
      const randomChat = activeChats[Math.floor(Math.random() * activeChats.length)];
      
      const mockSenders = [
        { uid: 'user-dev-1', name: 'shaderw0lf', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80', level: 16, role: 'Leader' },
        { uid: 'user-dev-2', name: 'alx0rr', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80', level: 14, role: 'Curator' },
        { uid: 'user-anime-1', name: 'Kira_San', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', level: 12, role: 'Member' },
        { uid: 'user-synth', name: 'CyberSamurai', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80', level: 15, role: 'Curator' }
      ];
      
      const sampleMessages = [
        "Anyone testing the new custom sticker packs?",
        "Don't forget to vote in the community poll on the front page!",
        "Checked the Avatar Frame store, the Cyberpunk frame looks legendary.",
        "Voice stage room will be starting in 20 minutes for seasonal anime discussion 🎙",
        "Streak masters are dominating the 7-day leaderboard today!"
      ];

      const sender = mockSenders[Math.floor(Math.random() * mockSenders.length)];
      const text = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

      this._emit('message', {
        chatId: randomChat,
        message: {
          id: `live-${Date.now()}`,
          authorId: sender.uid,
          authorName: sender.name,
          authorAvatar: sender.avatar,
          authorLevel: sender.level,
          authorRole: sender.role,
          content: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: false
        }
      });
    }, 28000);
  }

  _handleIncomingPacket(packet) {
    // NDC protocol packet: { t: type, o: object }
    const { t, o } = packet;

    switch (t) {
      case 1000: // Chat Message
        this._emit('message', {
          chatId: o.threadId || o.chatId,
          message: {
            id: o.messageId || `ws-${Date.now()}`,
            authorId: o.author?.uid,
            authorName: o.author?.nickname || 'Amino User',
            authorAvatar: o.author?.icon || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
            authorLevel: o.author?.level || 1,
            authorRole: o.author?.role || 'Member',
            content: o.content || '',
            mediaType: o.mediaType,
            mediaValue: o.mediaValue,
            timestamp: new Date(o.createdTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: false
          }
        });
        break;

      case 200: // Member Online / Presence count
        this._emit('presence', o);
        break;

      case 300: // User Typing Signal
        this._emit('typing', {
          chatId: o.threadId,
          user: o.user
        });
        break;

      case 400: // Voice Stage Signal
        this._emit('voiceStage', o);
        break;

      default:
        this._emit('packet', packet);
        break;
    }
  }

  /**
   * Send JSON packet to WebSocket
   */
  send(packet) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet));
    } else {
      console.log("[AltAmino WS] Gateway offline/simulating; packet dispatched locally:", packet);
    }
  }

  /**
   * Dispatch chat message
   */
  sendChatMessage(threadId, content, mediaType = 0, mediaValue = null) {
    const packet = {
      t: 1000,
      o: {
        threadId,
        content,
        type: mediaType,
        mediaValue,
        clientRefId: Date.now()
      }
    };
    this.send(packet);
  }

  /**
   * Send typing status
   */
  sendTyping(threadId) {
    this.send({
      t: 300,
      o: { threadId }
    });
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  _emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(data);
        } catch (err) {
          console.error(`[AltAmino WS] Error in event listener for ${event}:`, err);
        }
      }
    }
  }

  disconnect() {
    if (this.simulatedInterval) clearInterval(this.simulatedInterval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const wsClient = new AminoWebSocketClient();
