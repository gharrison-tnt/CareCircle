import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function Messages() {
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const messagesByResidentId = useAppStore((s) => s.messagesByResidentId);
  const sendMessage = useAppStore((s) => s.sendMessage);

  const [text, setText] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const messages = viewingFamilyResidentId ? messagesByResidentId[viewingFamilyResidentId] || [] : [];

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages.length]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !viewingFamilyResidentId) return;
    sendMessage(viewingFamilyResidentId, trimmed);
    setText('');
  }

  return (
    <div className="fam-page active">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Message the Care Team</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
        Responses typically within 4 business hours. For emergencies, call the facility directly.
      </div>
      <div className="msg-thread" ref={threadRef}>
        <div className="msg from-staff">
          <div className="msg-bubble">
            Hi! We're glad you're connected through Care Companion. Feel free to message us anytime — we'll respond as soon as we can.
          </div>
          <div className="msg-meta">Care Team</div>
        </div>
        {messages.map((m) => (
          <div className={`msg from-${m.from}`} key={m.id}>
            <div className="msg-bubble">{m.text}</div>
            <div className="msg-meta">
              {m.from === 'family' ? 'You' : 'Care Team'} · {m.timestamp}
            </div>
          </div>
        ))}
      </div>
      <div className="msg-input-row">
        <input
          className="msg-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message to the care team..."
          disabled={!viewingFamilyResidentId}
        />
        <button className="btn btn-blue" onClick={handleSend} disabled={!viewingFamilyResidentId}>
          Send
        </button>
      </div>
    </div>
  );
}
