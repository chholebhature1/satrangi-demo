import React from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import './Footer.css';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="/satrangi_logo-removebg-preview.png"
              alt="Satrangi Designer Studio"
              className="footer-logo"
            />
            <p className="footer-bio">
              Redefining ethnic luxury. Every stitch tells a story of heritage, passion, and elegance.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/satrangidesignerstudio" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com/satrangidesignerstudio" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/919217401412" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Explore</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Our Services</a></li>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#about">Our Story</a></li>
              <li><a href="#studio">Behind the Seens</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Visit Us</h4>
            <ul className="contact-info">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>Satrangi Designer Studio, Shop No. 1, Pillar No. 51 Opposite (Kesar Garden), Barola, Sector 49, Noida, Uttar Pradesh - 201301</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <a href="tel:+919217401412">+91 92174 01412</a>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <a href="mailto:hello@satrangistudio.com">hello@satrangistudio.com</a>
              </li>
            </ul>
            <div className="footer-hours">
              <p className="hours-label">Studio Hours</p>
              <p>Mon – Sat &nbsp;10:00 AM – 8:00 PM</p>
              <p>Sunday &nbsp;&nbsp;&nbsp;By Appointment</p>
            </div>
          </div>

          <div className="footer-instagram-card">
            <h4 className="footer-heading">Instagram Studio</h4>
            <p className="instagram-card-text">Step behind the seens. Scan with your phone or tap below to explore live lookbooks, custom client reels, and new design drops.</p>
            <div className="instagram-qr-wrap">
              <img
                src="/satrangi-qr.png"
                alt="Satrangi Instagram QR"
                className="instagram-qr-img"
              />
              <a href="https://instagram.com/satrangidesignerstudio" target="_blank" rel="noopener noreferrer" className="instagram-qr-link">
                Follow our Studio
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Satrangi Designer Studio by Rangmohini. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#home">Back to Top</a>
            <a href="#contact">Book Appointment</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
