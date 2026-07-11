import React from 'react';
import './TestimonialsSection.css';

const testimonialReels = [
  {
    id: 1,
    label: 'SATRANGI REEL 1',
    src: '/SATRANGI REEL 1 (1).mp4',
    poster: '/testimonial-reel-1-poster.jpg',
    title: 'Bridal moments in motion',
    description: 'A quick look at the studio styling flow, finishing touches, and bridal energy.',
  },
  {
    id: 2,
    label: 'SATRANGI DETAILS',
    src: '/SATRANGI REEL 3.mp4',
    poster: '/gallery-4.jpeg',
    title: 'Detail close-ups',
    description: 'Embroidery, texture, and movement captured from the atelier floor.',
  },
  {
    id: 3,
    label: 'SATRANGI FESTIVE',
    src: '/SATRANGI REEL 2.mp4',
    poster: '/gallery-7.jpeg',
    title: 'Festive styling',
    description: 'Color, drape, and client-ready looks from the current edit.',
  },
];

const TestimonialsSection = () => {
  const featuredReel = testimonialReels.find((reel) => reel.label === 'SATRANGI REEL 2') || testimonialReels[0];
  const supportingReels = testimonialReels.filter((reel) => reel.id !== featuredReel.id);

  const renderReelCard = (reel, variant = 'compact') => {
    const featured = variant === 'featured';

    return (
      <article className={`testimonial-video-card testimonial-video-card--${variant}`} key={reel.id}>
        <div className={`testimonial-video-frame${featured ? ' testimonial-video-frame--featured' : ''}`}>
          <img
            className="testimonial-video"
            src={encodeURI(reel.poster)}
            alt={`${reel.title} poster`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={`testimonial-video-overlay${featured ? ' testimonial-video-overlay--featured' : ''}`}>
          <p className="testimonial-video-label">{reel.label}</p>
          <h3 className="testimonial-video-title">{reel.title}</h3>
          <p className="testimonial-video-copy">{reel.description}</p>
        </div>
      </article>
    );
  };

  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="container">
        <div className="testimonials-header text-center">
          <p className="testimonials-eyebrow">STUDIO REELS</p>
          <h2 className="heading-lg">SATRANGI <span className="text-gold">Reels</span></h2>
          <p className="testimonials-subtitle">
            Three studio reels shown as poster stills so the section stays light and fast.
          </p>
          <div className="testimonials-gold-rule"></div>
        </div>

        <div className="testimonials-featured-layout">
          {renderReelCard(featuredReel, 'featured')}

          <div className="testimonials-support-grid">
            {supportingReels.map((reel) => renderReelCard(reel, 'compact'))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
