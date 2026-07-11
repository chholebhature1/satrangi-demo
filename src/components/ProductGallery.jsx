import React, { useEffect, useRef, useState } from 'react';
import { addVariantToCart, buyNowVariant, openCartDrawer } from '../lib/shopifyStorefrontCart';
import './ProductGallery.css';

// ⚠️ Update these handles to match your exact Shopify collection handles
const COLLECTION_MAP = {
  'All':               { handle: null,              isRental: false },
  'Bridal':            { handle: 'bridal',          isRental: false },
  'Lehenga on Rent':   { handle: 'lehenga-on-rent', isRental: true  },
  'Sarees':            { handle: 'sarees',          isRental: false },
  'Suits & Sets':      { handle: 'suits',           isRental: false },
  'Jewellery on Rent': { handle: null,              isRental: true  },
};

const filters = Object.keys(COLLECTION_MAP);

const LOADING_SKELETONS = Array(6)
  .fill('<div class="product-card-skeleton"></div>')
  .join('');

const EMPTY_STATE_MARKUP = `
  <div class="gallery-empty-state">
    <p class="gallery-empty-eyebrow">Curated edit</p>
    <h3 class="gallery-empty-title">New pieces are arriving soon</h3>
    <p class="gallery-empty-copy">This collection is being refreshed with new bridal and occasion looks. Message us on WhatsApp for early access or custom sourcing.</p>
    <a href="#contact" class="btn-primary">WhatsApp for availability</a>
  </div>
`;

const ProductGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const gridRef   = useRef(null);
  const listCtxRef = useRef(null);
  const emptyStateShownRef = useRef(false);

  // Inject Shopify product grid with a luxury lookbook presentation
  useEffect(() => {
    if (!gridRef.current) return;

    emptyStateShownRef.current = false;
    setHasNextPage(false);
    setLoadingMore(false);

    // Global Add to Cart and Buy Now handlers
    window.__addLookbookToCart = async (btn) => {
      const card = btn.closest('.product-card, .stl-card');
      const variantEl = card?.querySelector('.product-variant-id, .stl-variant-id');
      const variantId = variantEl ? variantEl.textContent.trim() : '';
      if (!variantId) return;

      const originalText = btn.textContent;
      btn.textContent = 'Adding...';
      btn.disabled = true;
      try {
        await addVariantToCart(variantId, 1);
        openCartDrawer();
      } catch (e) {
        console.error(e);
        alert('Could not add to cart: ' + e.message);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    };

    window.__buyLookbookNow = async (btn) => {
      const card = btn.closest('.product-card, .stl-card');
      const variantEl = card?.querySelector('.product-variant-id, .stl-variant-id');
      const variantId = variantEl ? variantEl.textContent.trim() : '';
      if (!variantId) return;

      const originalText = btn.textContent;
      btn.textContent = 'Buying...';
      btn.disabled = true;
      try {
        await buyNowVariant(variantId, 1);
      } catch (e) {
        console.error(e);
        alert('Checkout failed: ' + e.message);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    };

    const { handle, isRental } = COLLECTION_MAP[activeFilter];

    const cardTemplate = `
      <template>
        <div class="product-card" data-rental="${isRental ? 'true' : 'false'}">
          <div class="product-image-container" onclick="window.__openLookbookLightbox(this)" role="button" tabindex="0" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.__openLookbookLightbox(this); }">
            <shopify-media
              query="product.selectedOrFirstAvailableVariant.image"
              width="400" height="500"
              layout="constrained"
            ></shopify-media>
            <button type="button" class="product-image-trigger" aria-label="Open lookbook details for this product" onclick="event.stopPropagation(); window.__openLookbookLightbox(this)"></button>
          </div>
          <div class="product-card-actions">
            <div class="product-card-actions-row">
              <button type="button" class="gallery-action-btn add-to-cart" onclick="event.stopPropagation(); window.__addLookbookToCart(this)">Add to Cart</button>
              <button type="button" class="gallery-action-btn buy-now" onclick="event.stopPropagation(); window.__buyLookbookNow(this)">Buy Now</button>
            </div>
            <button type="button" class="gallery-action-btn view-details" onclick="event.stopPropagation(); window.__openLookbookLightbox(this)">View Details</button>
          </div>
          <div class="product-info">
            <h3 class="product-name"><shopify-data query="product.title"></shopify-data></h3>
            <p class="product-price">
              <shopify-money query="product.selectedOrFirstAvailableVariant.price" format="money_with_currency"></shopify-money>
            </p>
            <span class="product-handle" hidden><shopify-data query="product.handle"></shopify-data></span>
            <span class="product-type" hidden><shopify-data query="product.productType"></shopify-data></span>
            <span class="product-variant-id" hidden><shopify-data query="product.selectedOrFirstAvailableVariant.id"></shopify-data></span>
          </div>
        </div>
      </template>
      <div class="gallery-loading-grid" shopify-loading-placeholder>${LOADING_SKELETONS}</div>
    `;

    const renderEmptyState = () => {
      if (!gridRef.current || emptyStateShownRef.current) return;
      emptyStateShownRef.current = true;
      gridRef.current.innerHTML = EMPTY_STATE_MARKUP;
    };

    const evaluateEmptyState = () => {
      if (!gridRef.current || emptyStateShownRef.current) return;
      const visibleCards = gridRef.current.querySelectorAll('.product-card:not([hidden])').length;
      if (visibleCards === 0) {
        renderEmptyState();
      }
    };

    // Jewellery on Rent: fetch ALL products, filter client-side
    const isJewellery = activeFilter === 'Jewellery on Rent';
    const fetchFirst = isJewellery ? 250 : 12;

    const renderMarkup = handle
      ? `
        <shopify-context type="collection" handle="${handle}">
          <template>
            <shopify-list-context id="product-list-initial" type="product" query="collection.products" first="${fetchFirst}">
              ${cardTemplate}
            </shopify-list-context>
          </template>
          <div class="gallery-loading-grid" shopify-loading-placeholder>${LOADING_SKELETONS}</div>
        </shopify-context>
      `
      : `
        <shopify-list-context id="product-list-initial" type="product" query="products" first="${fetchFirst}">
          ${cardTemplate}
        </shopify-list-context>
      `;

    gridRef.current.innerHTML = renderMarkup;

    const filterAndRevealCards = () => {
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (!cards || cards.length === 0) return;

      let visibleCount = 0;
      cards.forEach((card) => {
        const text = [
          card.querySelector('.product-type')?.textContent || '',
          card.querySelector('.product-handle')?.textContent || '',
          card.querySelector('.product-name')?.textContent || '',
        ].join(' ').toLowerCase();

        // Bridal: hide co-ord sets
        const isBridalBlocked = activeFilter === 'Bridal' && /co[- ]?ord(?:\s*set)?/i.test(text);
        // Jewellery on Rent: hide non-jewellery items
        const isJewelleryBlocked = isJewellery && !/(jewellery|jewelry)/i.test(text);

        const blocked = isBridalBlocked || isJewelleryBlocked;
        card.hidden = blocked;
        card.style.display = blocked ? 'none' : '';

        if (blocked) {
          card.classList.remove('visible');
          return;
        }

        if (card.dataset.revealObserved !== 'true') {
          card.dataset.revealObserved = 'true';
          card.style.transitionDelay = `${(visibleCount % 3) * 0.12}s`;
          card.classList.add('visible');
        }
        visibleCount++;
      });

      if (activeFilter === 'Bridal' && visibleCount === 0) {
        renderEmptyState();
      }
    };

    const cleanupFns = [];

    const bindListContext = (listCtx) => {
      if (!listCtx || listCtx.dataset.galleryBound === 'true') return false;

      listCtx.dataset.galleryBound = 'true';
      listCtxRef.current = listCtx;
      let prevCardCount = 0;

      const checkPagination = () => {
        const visibleCards = gridRef.current?.querySelectorAll('.product-card:not([hidden])').length || 0;
        const totalCards = gridRef.current?.querySelectorAll('.product-card').length || 0;
        if (totalCards > 0 && totalCards !== prevCardCount) {
          prevCardCount = totalCards;
          filterAndRevealCards();
          evaluateEmptyState();
          const requestedCount = parseInt(listCtx.getAttribute('first') || '12', 10);
          setHasNextPage(visibleCards >= requestedCount && !isJewellery);
          setLoadingMore(false);
        }
      };

      // Listen for the Shopify custom event
      const onProductsLoaded = () => {
        checkPagination();
      };

      // Also watch DOM mutations as a fallback
      const mutationObserver = new MutationObserver(() => {
        checkPagination();
      });

      listCtx.addEventListener('shopify-list-context-update', onProductsLoaded);
      mutationObserver.observe(listCtx, { childList: true, subtree: true });

      // Poll briefly in case both event and mutation are missed
      const pollInterval = setInterval(() => {
        checkPagination();
      }, 500);
      const pollTimeout = setTimeout(() => clearInterval(pollInterval), 10000);

      cleanupFns.push(() => {
        listCtx.removeEventListener('shopify-list-context-update', onProductsLoaded);
        mutationObserver.disconnect();
        clearInterval(pollInterval);
        clearTimeout(pollTimeout);
        delete listCtx.dataset.galleryBound;
        listCtxRef.current = null;
      });

      return true;
    };

    const initialListCtx = gridRef.current.querySelector('shopify-list-context');
    if (!bindListContext(initialListCtx)) {
      const rootObserver = new MutationObserver(() => {
        const nextListCtx = gridRef.current?.querySelector('shopify-list-context');
        if (bindListContext(nextListCtx)) {
          rootObserver.disconnect();
        }
      });

      rootObserver.observe(gridRef.current, { childList: true, subtree: true });
      cleanupFns.push(() => rootObserver.disconnect());
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      delete window.__addLookbookToCart;
      delete window.__buyLookbookNow;
    };
  }, [activeFilter]);

  const handleLoadMore = () => {
    const listCtx = listCtxRef.current;
    if (!listCtx) return;

    setLoadingMore(true);

    // Increase the "first" count to load the next batch of products
    const currentFirst = parseInt(listCtx.getAttribute('first') || '12', 10);
    listCtx.setAttribute('first', String(currentFirst + 12));
  };

  return (
    <section className="gallery section-padding" id="collections">
      <div className="container">
        <div className="gallery-header text-center">
          <p className="gallery-eyebrow">LOOKBOOK</p>
          <h2 className="heading-lg">The <span className="text-gold">Signature Edit</span></h2>
          <p className="gallery-subtitle">A curated selection of bridal, festive &amp; occasion wear from the studio.</p>
        </div>

        <div className="gallery-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Shopify product grid injected here via ref */}
        <div className="product-grid" ref={gridRef} />

        {hasNextPage && (
          <div className="gallery-load-more text-center">
            <button
              className="btn-primary load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <div className="gallery-footer text-center">
          <p className="gallery-footer-copy">For sizing, availability, rent options, and custom work, message us directly.</p>
          <a href="#contact" className="btn-primary">Book a Styling Visit</a>
        </div>
      </div>

    </section>
  );
};

export default ProductGallery;
