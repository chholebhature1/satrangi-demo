import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Send, Clock, CheckCircle2 } from 'lucide-react';
import './ContactSection.css';

const WHATSAPP_NUMBER = '919217401412';

const trustBadges = [
  {
    icon: CheckCircle2,
    title: 'Delhi studio by appointment',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp consultations',
  },
  {
    icon: MapPin,
    title: 'Exact location shared on booking',
  },
  {
    icon: Clock,
    title: 'Custom fitting support',
  },
];

const services = [
  'Lehenga on Rent',
  'Jewellery on Rent',
  'Customisation',
  'Sarees',
  'Suits (Stitched / Unstitched)',
  'Kids Customisation',
  'Designer Advice',
  'Designing',
  'QR Insta ID',
  'Other',
];

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hello! I'm ${form.name}.\n\nService interested in: ${form.service}\nPhone: ${form.phone}\n\nMessage: ${form.message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const whatsappDirect = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I would like to book an appointment at Satrangi Designer Studio.')}`;
  const whatsappDirections = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello! I would like the exact studio location and directions for Satrangi Designer Studio.')}`;

  return (
    <section className="contact-section section-padding" id="contact">
      <div className="container">
        <div className="contact-header text-center">
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h2 className="heading-lg">Book an <span className="text-gold">Appointment</span></h2>
          <p className="contact-subtitle">
            Walk in, call us, or send a WhatsApp — we're always happy to help.
          </p>
          <div className="contact-gold-rule"></div>
        </div>

        <div className="contact-trust-strip">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div className="contact-trust-badge" key={badge.title}>
                <Icon size={16} strokeWidth={2} />
                <span>{badge.title}</span>
              </div>
            );
          })}
        </div>

        <div className="contact-grid">
          {/* Left — Form */}
          <div className="contact-form-wrap">
            <h3 className="contact-form-title">Send an Enquiry</h3>
            <p className="contact-form-hint">Submitting the form will open WhatsApp with your details pre-filled.</p>

            {submitted && (
              <div className="contact-success">
                ✓ Opening WhatsApp — we'll get back to you shortly!
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="service">Service Interested In</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a service…</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your occasion, date, budget or any special requirements…"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={16} />
                Send via WhatsApp
              </button>
            </form>
          </div>

          {/* Right — Info + CTA */}
          <div className="contact-info-wrap">
            <a
              href={whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-whatsapp-cta"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="wa-icon"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <span className="wa-label">Chat on WhatsApp</span>
                <span className="wa-sub">Instant reply · Book now</span>
              </div>
            </a>

            <div className="contact-details">
              <div className="contact-detail-item">
                <MapPin size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Visit the Studio</span>
                  <span className="detail-value">Exact address shared on WhatsApp after booking</span>
                  <span className="detail-value">Delhi visits by appointment only</span>
                </div>
              </div>
              <div className="contact-detail-item">
                <Phone size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Call Us</span>
                  <a href="tel:+919217401412" className="detail-value detail-link">+91 92174 01412</a>
                </div>
              </div>
              <div className="contact-detail-item">
                <Clock size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Studio Hours</span>
                  <span className="detail-value">Mon – Sat: 10 AM – 8 PM</span>
                  <span className="detail-value">Sunday: By Appointment</span>
                </div>
              </div>
            </div>

            <div className="contact-map contact-map--info">
              <p className="contact-map-eyebrow">Need directions?</p>
              <h3 className="contact-map-title">We share the exact landmark, parking notes and entry instructions on WhatsApp.</h3>
              <p className="contact-map-copy">That keeps the studio details accurate until you are ready to visit, and avoids sending you to the wrong location.</p>
              <a
                href={whatsappDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-map-btn"
              >
                WhatsApp us for directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
