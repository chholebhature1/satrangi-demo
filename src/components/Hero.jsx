import React from 'react';
import HeroBackgroundVideo from './HeroBackgroundVideo';
import ShopTheLookCarousel from './ShopTheLookCarousel';
import './Hero.css';

const Hero = ({ showCarousel = true, onVideoReady = () => {} }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-video-wrapper">
        <HeroBackgroundVideo onReady={onVideoReady} />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text-container">
          <p className="hero-kicker fade-in">
            <span className="kicker-line" />
            Bridal &amp; Ethnic Wear · New Delhi
            <span className="kicker-line" />
          </p>

          <h1 className="hero-title fade-in">
            Noida's Finest<br />
            <span className="hero-title-accent">Designer Boutique</span>
          </h1>

          <p className="hero-services fade-in" style={{ animationDelay: '0.2s' }}>
            Lehengas&nbsp;·&nbsp;Sarees&nbsp;·&nbsp;Suits&nbsp;·&nbsp;Jewellery
          </p>

          <p className="hero-subtitle fade-in" style={{ animationDelay: '0.35s' }}>
            Buy or rent from our boutique studio in New Delhi.
          </p>

          <div className="hero-actions fade-in" style={{ animationDelay: '0.55s' }}>
            <a href="#collections" className="btn-solid">Explore Collections</a>
            <a href="#contact" className="btn-outline">Book Appointment</a>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Scroll down</span>
          <div className="scroll-line"></div>
        </div>
      </div>

      {showCarousel && (
        <div className="hero-carousel-overlay">
          <ShopTheLookCarousel />
        </div>
      )}
    </section>
  );
};

export default Hero;
