import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'satrangi_bar_dismissed';
const BAR_HEIGHT = '40px';

const messages = [
  '✦ New Bridal Collection Available — Book a Free Styling Consultation',
  '✦ Lehenga & Jewellery on Rent · WhatsApp us for availability',
  '✦ Kids Customisation · Suits · Sarees · Designer Advice — All Under One Roof',
];

const AnnouncementBar = ({ onVisibilityChange }) => {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
      onVisibilityChange(true);
      document.documentElement.style.setProperty('--bar-height', BAR_HEIGHT);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messages.length);
        setFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    onVisibilityChange(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
    document.documentElement.style.setProperty('--bar-height', '0px');
  };

  if (!visible) return null;

  const whatsappUrl = `https://wa.me/919217401412?text=${encodeURIComponent('Hello! I would like to book an appointment at Satrangi Designer Studio.')}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: BAR_HEIGHT,
      background: 'var(--text-primary)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 3rem',
    }}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          color: 'rgba(245,244,229,0.92)',
          textDecoration: 'none',
          textAlign: 'center',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.4s ease',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {messages[msgIndex]}
        <span style={{
          marginLeft: '1rem',
          color: '#b8cf9f',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}>
          WhatsApp Us →
        </span>
      </a>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'rgba(245,244,229,0.6)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(245,244,229,1)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,244,229,0.6)'}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
