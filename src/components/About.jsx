import React, { useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="about section-padding" id="about" ref={sectionRef}>
      <div className="container about-container">
        <div className="about-image-wrapper animate-on-scroll slide-up">
          <img 
            src="/gallery-1.webp" 
            alt="Satrangi Designer Studio" 
            className="about-image"
          />
          <div className="about-image-accent"></div>
        </div>
        
        <div className="about-content animate-on-scroll fade-in-late">
          <div className="about-heading-group">
            <p className="about-heading-eyebrow">Team Satrangi Boutique</p>
            <h2 className="heading-lg">Your Design’s Four Pillars</h2>
            <p className="about-heading-subtitle">By Rangmohini</p>
          </div>
          <div className="about-text">
            <p>
              At the heart of Satrangi lies a passionate collective of master designers, visionary stylists, and multi-generational <em>Karigars</em> (artisans) who breathe life into fine textiles. Nestled in New Delhi's rich heritage of craft, our boutique studio is a creative sanctuary where legacy hand-embroidery meets contemporary elegance, transforming raw silks and soft georgettes into wearable poetry.
            </p>
            <p>
              From bespoke bridal couture hand-stitched over hundreds of hours to curating premium lehengas and royal jewellery for rent, our dedicated team works hand-in-hand with you. We don't just tailor outfits; we weave personal stories and craft enduring memories, ensuring that every thread and silhouette makes you feel like royalty.
            </p>
          </div>
          <div className="about-services-wrap">
            <p className="about-services-label">What We Offer</p>
            <div className="about-service-tags">
              {['Customisation', 'Lehenga on Rent', 'Jewellery on Rent', 'Sarees', 'Suits', 'Kids Wear', 'Designer Advice'].map((tag) => (
                <span key={tag} className="about-service-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="about-signature">
            <img src="/satrangi_logo-removebg-preview.png" alt="Satrangi Signature" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
