import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, Menu, ShoppingBag } from 'lucide-react';
import './Navbar.css';
import {
  CART_UPDATED_EVENT,
  getCachedCartSnapshot,
  loadCartSnapshot,
  openCartDrawer,
} from '../lib/shopifyStorefrontCart';
import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from '../lib/shopifyConfig';

const WHATSAPP_URL = 'https://wa.me/919217401412';

const SHOPIFY_SEARCH_QUERY = `
  query NavbarSearchProducts {
    products(first: 50) {
      nodes {
        title
        handle
        productType
      }
    }
  }
`;

const searchableItems = [
  { name: 'Lehenga on Rent',            tag: 'Service',         href: '#lehenga-on-rent'       },
  { name: 'Jewellery on Rent',          tag: 'Service',         href: '#jewellery-on-rent'     },
  { name: 'Customisation',              tag: 'Service',         href: '#customisation'         },
  { name: 'Designer Advice',            tag: 'Service',         href: '#studio-support'        },
  { name: 'Kids Customisation',         tag: 'Service',         href: '#studio-support'        },
  { name: 'Sarees',                     tag: 'Collection',      href: '#collections' },
  { name: 'Suits',                      tag: 'Collection',      href: '#collections' },
  { name: 'Bridal Wear',                tag: 'Bridal',          href: '#collections' },
];

const navLinks = [
  { name: 'Collections', href: '#collections', id: 'collections' },
  { name: 'Services',    href: '#services',    id: 'services'    },
  { name: 'Our Story',   href: '#about',       id: 'about'       },
  { name: 'The Studio',  href: '#studio',      id: 'studio'      },
];

const serviceLinks = [
  { label: '✦ New Arrivals',    href: '#collections',            type: 'new'  },
  { label: 'Lehenga on Rent',   href: '#lehenga-on-rent'                    },
  { label: 'Jewellery on Rent', href: '#jewellery-on-rent'                  },
  { label: 'Sarees',            href: '#sarees'                             },
  { label: 'Suits',             href: '#suits'                              },
  { label: 'Customisation',     href: '#customisation'                      },
  { label: 'Kids Wear',         href: '#studio-support'                     },
  { label: 'Bridal',            href: '#bridal-couture'                     },
  { label: 'Designer Advice',   href: '#studio-support'                     },
  { label: 'Bridal Couture',    href: '#bridal-couture'                     },
  { label: 'Sale',              href: '#collections',            type: 'sale' },
];

const renderServicePill = (service, keyPrefix = '') => (
  <a
    key={`${keyPrefix}${service.label}`}
    href={service.href}
    className={`service-pill${service.type ? ` service-pill--${service.type}` : ''}`}
    tabIndex={keyPrefix ? -1 : 0}
  >
    {service.label}
  </a>
);

const Navbar = () => {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [cartCount, setCartCount]         = useState(0);
  const [liveProducts, setLiveProducts]   = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const servicesScrollRef = useRef(null);

  const pauseServiceScroll = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.dataset.pausedUntil = String(performance.now() + 2200);
    }
  };

  const holdServiceScroll = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.dataset.pausedUntil = String(Number.POSITIVE_INFINITY);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const loadLiveProducts = async () => {
      setSearchLoading(true);

      try {
        const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_PUBLIC_ACCESS_TOKEN,
          },
          body: JSON.stringify({ query: SHOPIFY_SEARCH_QUERY }),
          signal: controller.signal,
        });

        const json = await response.json();
        const nodes = json?.data?.products?.nodes ?? [];

        if (isActive) {
          setLiveProducts(
            nodes.map((product) => ({
              name: product.title,
              tag: product.productType || 'Product',
              href: '#collections',
            }))
          );
        }
      } catch (error) {
        if (isActive && error?.name !== 'AbortError') {
          setLiveProducts([]);
        }
      } finally {
        if (isActive) {
          setSearchLoading(false);
        }
      }
    };

    loadLiveProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  // Listen for Shopify cart updates
  useEffect(() => {
    const updateCartCount = (snapshot) => {
      setCartCount(snapshot?.totalQuantity || 0);
    };

    const cachedSnapshot = getCachedCartSnapshot();
    updateCartCount(cachedSnapshot);

    loadCartSnapshot()
      .then((snapshot) => updateCartCount(snapshot))
      .catch(() => updateCartCount(cachedSnapshot));

    const handleCartUpdated = (event) => updateCartCount(event.detail?.snapshot);
    const handleStorage = () => updateCartCount(getCachedCartSnapshot());

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const searchCatalog = [...liveProducts, ...searchableItems];
  const searchResults = searchQuery.trim().length >= 2
    ? searchCatalog.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 7)
    : [];

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'collections', 'services', 'about', 'studio', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scroller = servicesScrollRef.current;
    if (!scroller) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 900px)');
    let frameId = null;
    let lastTime = performance.now();

    const stop = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const start = () => {
      const animate = (time) => {
        const pausedUntil = Number(scroller.dataset.pausedUntil || '0');

        if (!mediaQuery.matches) {
          frameId = null;
          return;
        }

        if (time < pausedUntil) {
          lastTime = time;
          frameId = window.requestAnimationFrame(animate);
          return;
        }

        const delta = time - lastTime;
        lastTime = time;

        const maxScroll = scroller.scrollWidth / 2;

        if (maxScroll > 0) {
          scroller.scrollLeft += (72 * delta) / 1000;

          if (scroller.scrollLeft >= maxScroll) {
            scroller.scrollLeft -= maxScroll;
          }
        }

        frameId = window.requestAnimationFrame(animate);
      };

      frameId = window.requestAnimationFrame(animate);
    };

    const sync = () => {
      stop();
      lastTime = performance.now();
      scroller.dataset.pausedUntil = '0';

      if (mediaQuery.matches) {
        start();
      } else {
        scroller.scrollLeft = 0;
      }
    };

    const handleTouchStart = () => {
      holdServiceScroll();
      lastTime = performance.now();
    };

    const handleTouchEnd = () => {
      pauseServiceScroll();
      lastTime = performance.now();
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === 'touch') {
        handleTouchStart();
      }
    };

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch') {
        handleTouchEnd();
      }
    };

    sync();
    mediaQuery.addEventListener('change', sync);
    scroller.addEventListener('touchstart', handleTouchStart, { passive: true });
    scroller.addEventListener('touchend', handleTouchEnd, { passive: true });
    scroller.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    scroller.addEventListener('pointerdown', handlePointerDown, { passive: true });
    scroller.addEventListener('pointerup', handlePointerUp, { passive: true });
    scroller.addEventListener('pointercancel', handlePointerUp, { passive: true });

    return () => {
      stop();
      mediaQuery.removeEventListener('change', sync);
      scroller.removeEventListener('touchstart', handleTouchStart);
      scroller.removeEventListener('touchend', handleTouchEnd);
      scroller.removeEventListener('touchcancel', handleTouchEnd);
      scroller.removeEventListener('pointerdown', handlePointerDown);
      scroller.removeEventListener('pointerup', handlePointerUp);
      scroller.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>

        {/* ── Row 1: Main bar ── */}
        <div className="navbar-main">
          <div className="navbar-main-inner">

            {/* LEFT: page nav links */}
            <div className="navbar-left desktop-only">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CENTER: logo */}
            <div className="navbar-center">
              <a href="#home">
                <img
                  src="/satrangi_logo-removebg-preview.png"
                  alt="Satrangi Designer Studio"
                  className="navbar-logo-img"
                />
              </a>
            </div>

            {/* MOBILE CENTER: search pill replaces logo position */}
            <button
              className="mobile-search-center"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={15} />
              <span>Search styles, sarees…</span>
            </button>

            {/* RIGHT: utility icons */}
            <div className="navbar-right">
              <button className="nav-search-pill desktop-only" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search size={14} />
                <span>Search</span>
              </button>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-icon-btn desktop-only" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              <a href="#contact" className="nav-icon-btn desktop-only" aria-label="Book Appointment">
                <User size={18} />
              </a>

              {/* Cart icon — visible on all screen sizes */}
              <button
                className="nav-icon-btn nav-cart-btn"
                onClick={() => openCartDrawer()}
                aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="nav-icon-btn mobile-only"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Row 2: Services strip ── */}
        <div className="navbar-services">
          <div className="navbar-services-scroll" ref={servicesScrollRef}>
            <div className="navbar-services-track">
              <div className="navbar-services-group">
                {serviceLinks.map((s) => renderServicePill(s))}
              </div>
              <div className="navbar-services-group navbar-services-group--duplicate" aria-hidden="true">
                {serviceLinks.map((s) => renderServicePill(s, 'dup-'))}
              </div>
            </div>
          </div>
        </div>

      </nav>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="search-overlay" onClick={closeSearch}>
          <div className="search-box" onClick={(e) => e.stopPropagation()}>
            <div className="search-box-row">
              <Search size={18} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search collections, services, styles…"
                className="search-input"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-close" onClick={closeSearch} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="search-result-item"
                    onClick={closeSearch}
                  >
                    <span className="search-result-name">{item.name}</span>
                    <span className="search-result-tag">{item.tag}</span>
                  </a>
                ))}
              </div>
            )}
            {searchQuery.trim().length >= 2 && searchLoading && searchResults.length === 0 && (
              <div className="search-no-results">Loading live product titles…</div>
            )}
            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="search-no-results">No results for &ldquo;{searchQuery}&rdquo;</div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              {link.name}
            </a>
          ))}
          <div className="mobile-services-grid">
            {serviceLinks.map((s) => (
              <a key={s.label} href={s.href} className={`mobile-service-tag${s.type ? ` mobile-service-tag--${s.type}` : ''}`} onClick={() => setMobileOpen(false)}>
                {s.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="mobile-cta-btn" onClick={() => setMobileOpen(false)}>
            Book Appointment
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
