import { useEffect, useMemo, useRef, useState } from 'react';
import { addVariantToCart, buyNowVariant, openCartDrawer } from '../lib/shopifyStorefrontCart';
import { fetchProductDetails } from '../lib/shopifyProductDetails';
import { SHOPIFY_STORE_DOMAIN } from '../lib/shopifyConfig';
import './LookbookLightbox.css';

const LIGHTBOX_ID = 'lookbook-lightbox';
const WHATSAPP_NUMBER = '919217401412';

const readText = (element, selector, fallback = '') => {
  const target = element?.querySelector(selector);
  return target?.textContent?.trim() || fallback;
};

const readImage = (element) => {
  const image = element?.querySelector('img, unpic-img');
  return image?.currentSrc || image?.src || image?.getAttribute?.('src') || '';
};

const readShopifyListIndex = (element) => {
  if (!element) return -1;

  const indexAttribute = Array.from(element.attributes || []).find((attribute) => /--index$/.test(attribute.name));
  if (!indexAttribute) return -1;

  const index = Number(indexAttribute.value);
  return Number.isFinite(index) ? index : -1;
};

const readProductData = (card) => {
  const listContext = card?.closest?.('shopify-list-context');
  const shopifyData = listContext?.shopifyData;

  if (!Array.isArray(shopifyData) || shopifyData.length === 0) {
    return null;
  }

  const cardIndex = readShopifyListIndex(card);
  if (cardIndex >= 0 && shopifyData[cardIndex]) {
    return shopifyData[cardIndex];
  }

  const title = readText(card, '.product-name, .stl-card__name', '');
  if (title) {
    const exactMatch = shopifyData.find((item) => item?.title?.trim?.() === title);
    if (exactMatch) {
      return exactMatch;
    }
  }

  return shopifyData[0] || null;
};

const formatMoney = (money, fallback = '') => {
  if (!money?.amount) return fallback;

  const amount = Number(money.amount);
  const currency = money.currencyCode || 'INR';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${money.amount} ${currency}`;
  }
};

const getVariantLabel = (variant) => {
  if (!variant || !variant.title || variant.title === 'Default Title' || variant.title === 'Default') {
    return '';
  }

  if (Array.isArray(variant.selectedOptions) && variant.selectedOptions.length > 0) {
    return variant.selectedOptions
      .map((option) => `${option.name}: ${option.value}`)
      .join(' / ');
  }

  return variant.title;
};

const defaultLook = {
  handle: '',
  imageSrc: '',
  title: 'Selected look',
  price: '',
  eyebrow: 'Lookbook preview',
  variantId: '',
  isRental: false,
};

const buildEnquiryUrl = ({ title, price, variantLabel }) => {
  const details = [
    'Hello! I would like to enquire about this Satrangi look.',
    title ? `Product: ${title}` : '',
    variantLabel ? `Variant: ${variantLabel}` : '',
    price ? `Price: ${price}` : '',
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details.join('\n'))}`;
};

const buildShopifyProductUrl = (handle) => {
  if (!handle) return '';

  return `https://${SHOPIFY_STORE_DOMAIN}/products/${encodeURIComponent(handle)}`;
};

const renderActiveMedia = (media, title) => {
  if (!media) {
    return <div className="lookbook-lightbox__placeholder">Product media loading</div>;
  }

  if (media.type === 'video') {
    return (
      <video
        className="lookbook-lightbox__active-video"
        src={media.url}
        poster={media.poster}
        controls
        playsInline
      />
    );
  }

  if (media.type === 'externalVideo' && media.url) {
    return (
      <iframe
        className="lookbook-lightbox__active-video"
        title={`${title} reel`}
        src={media.url}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return <img src={media.url} alt={media.alt || title} />;
};

const LookbookLightbox = () => {
  const dialogRef = useRef(null);
  const detailRequestRef = useRef(0);
  const [look, setLook] = useState(defaultLook);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [busyAction, setBusyAction] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const openLookbook = (sourceElement) => {
      const card = sourceElement?.closest?.('.product-card, .stl-card') || sourceElement;
      if (!dialogRef.current || !card) return;

      const productData = readProductData(card);
      const selectedVariant = productData?.selectedOrFirstAvailableVariant || null;
      const imageSrc = readImage(card);
      const title = readText(card, '.product-name, .stl-card__name', defaultLook.title);
      const price = readText(card, '.product-price, .stl-card__price', '');
      const eyebrow = readText(card, '.product-category-tag, .stl-badge', defaultLook.eyebrow);
      const handle = productData?.handle || readText(card, '.product-handle, .stl-product-handle', '');
      const variantId = selectedVariant?.id || readText(card, '.product-variant-id, .stl-variant-id', '');
      const isRental = card?.dataset?.rental === 'true';

      setLook({ handle, imageSrc, title, price, eyebrow, variantId, isRental });
      setProductDetails(null);
      setDetailsError('');
      setDetailsLoading(Boolean(handle));
      setSelectedVariantId(variantId);
      setActiveMediaIndex(0);
      setBusyAction('');
      setStatusMessage('');

      dialogRef.current.showModal();
      document.body.style.overflow = 'hidden';

      if (!handle) return;

      const requestId = detailRequestRef.current + 1;
      detailRequestRef.current = requestId;

      fetchProductDetails(handle)
        .then((details) => {
          if (detailRequestRef.current !== requestId) return;

          const preferredVariantId = variantId
            || details.selectedVariant?.id
            || details.variants?.find((variant) => variant.availableForSale)?.id
            || details.variants?.[0]?.id
            || '';

          setProductDetails(details);
          setSelectedVariantId(preferredVariantId);
          setDetailsLoading(false);
        })
        .catch((error) => {
          if (detailRequestRef.current !== requestId) return;
          setDetailsError(error?.message || 'Could not load more product details.');
          setDetailsLoading(false);
        });
    };

    window.__openLookbookLightbox = openLookbook;
    window.__closeLookbookLightbox = () => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
    };

    return () => {
      detailRequestRef.current += 1;
      if (window.__openLookbookLightbox) delete window.__openLookbookLightbox;
      if (window.__closeLookbookLightbox) delete window.__closeLookbookLightbox;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const handleClose = () => {
      detailRequestRef.current += 1;
      document.body.style.overflow = '';
      setBusyAction('');
      setStatusMessage('');
      setDetailsLoading(false);
    };

    dialog.addEventListener('close', handleClose);

    return () => {
      dialog.removeEventListener('close', handleClose);
      document.body.style.overflow = '';
    };
  }, []);

  const mediaItems = useMemo(() => {
    if (productDetails?.media?.length) {
      return productDetails.media;
    }

    if (look.imageSrc) {
      return [{
        type: 'image',
        label: 'Hero',
        url: look.imageSrc,
        poster: look.imageSrc,
        alt: look.title,
      }];
    }

    return [];
  }, [look.imageSrc, look.title, productDetails]);

  const selectedVariant = useMemo(() => {
    const variants = productDetails?.variants || [];
    return variants.find((variant) => variant.id === selectedVariantId)
      || productDetails?.selectedVariant
      || (look.variantId ? { id: look.variantId, availableForSale: true } : null);
  }, [look.variantId, productDetails, selectedVariantId]);

  const activeMedia = mediaItems[Math.min(activeMediaIndex, Math.max(mediaItems.length - 1, 0))] || null;
  const title = productDetails?.title || look.title;
  const productType = productDetails?.productType || look.eyebrow;
  const variantLabel = getVariantLabel(selectedVariant);
  const price = formatMoney(selectedVariant?.price, look.price);
  const tags = (productDetails?.tags || []).filter(Boolean).slice(0, 5);
  const variants = productDetails?.variants || [];
  const showVariantSelector = variants.length > 1;
  const canAddToCart = Boolean(selectedVariant?.id) && selectedVariant?.availableForSale !== false;
  const enquiryUrl = buildEnquiryUrl({ title, price, variantLabel });

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || look.variantId;

    if (!variantId) {
      setStatusMessage('Missing product variant details for this look.');
      return;
    }

    setBusyAction('cart');
    setStatusMessage('Adding to cart...');

    try {
      await addVariantToCart(variantId, 1);
      openCartDrawer();
      dialogRef.current?.close();
    } catch (error) {
      setStatusMessage(error?.message || 'Could not add this item to cart.');
    } finally {
      setBusyAction('');
    }
  };

  const handleBuyNow = async () => {
    const variantId = selectedVariant?.id || look.variantId;

    if (!variantId) {
      setStatusMessage('Missing product variant details for this look.');
      return;
    }

    setBusyAction('buy');
    setStatusMessage('Redirecting to checkout...');

    try {
      await buyNowVariant(variantId, 1);
    } catch (error) {
      setStatusMessage(error?.message || 'Could not start checkout for this look.');
    } finally {
      setBusyAction('');
    }
  };

  const handleViewDetails = () => {
    const productUrl = buildShopifyProductUrl(look.handle);

    if (!productUrl) {
      setStatusMessage('Missing product page details for this look.');
      return;
    }

    window.location.assign(productUrl);
  };

  return (
    <dialog
      id={LIGHTBOX_ID}
      className="lookbook-lightbox"
      ref={dialogRef}
      aria-labelledby="lookbook-lightbox-title"
      aria-describedby="lookbook-lightbox-copy"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close();
        }
      }}
    >
      <button
        type="button"
        className="lookbook-lightbox__close"
        aria-label="Close product details"
        onClick={() => dialogRef.current?.close()}
      >
        X
      </button>

      <div className="lookbook-lightbox__gallery">
        <div className="lookbook-lightbox__stage">
          {renderActiveMedia(activeMedia, title)}
          {activeMedia && activeMedia.type !== 'image' && (
            <span className="lookbook-lightbox__media-pill">Reel</span>
          )}
        </div>

        <div className="lookbook-lightbox__thumbs" aria-label="Product media">
          {mediaItems.map((media, index) => (
            <button
              type="button"
              className={`lookbook-lightbox__thumb ${index === activeMediaIndex ? 'active' : ''}`}
              key={`${media.label}-${media.url}-${index}`}
              onClick={() => setActiveMediaIndex(index)}
              aria-label={`Show ${media.label}`}
            >
              {media.poster || media.url ? (
                <img src={media.poster || media.url} alt="" />
              ) : (
                <span>{media.label}</span>
              )}
              {media.type !== 'image' && <span className="lookbook-lightbox__play">Play</span>}
              <small>{media.label}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="lookbook-lightbox__content">
        <div className="lookbook-lightbox__scroll">
          <p className="lookbook-lightbox__eyebrow">{productType || 'Satrangi edit'}</p>
          <h3 className="lookbook-lightbox__title" id="lookbook-lightbox-title">{title}</h3>
          <p className="lookbook-lightbox__price">{price}</p>

          {detailsLoading && <p className="lookbook-lightbox__loading">Loading complete product story...</p>}
          {detailsError && <p className="lookbook-lightbox__status">{detailsError}</p>}

          {tags.length > 0 && (
            <div className="lookbook-lightbox__tags" aria-label="Product tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          <p className="lookbook-lightbox__copy" id="lookbook-lightbox-copy">
            Explore every angle, inspect the craft details, and enquire for sizing, styling, availability, and custom work.
          </p>

          {showVariantSelector && (
            <div className="lookbook-lightbox__variant-block">
              <p className="lookbook-lightbox__section-label">Select option</p>
              <div className="lookbook-lightbox__variant-grid">
                {variants.map((variant) => (
                  <button
                    type="button"
                    key={variant.id}
                    className={`lookbook-lightbox__variant ${variant.id === selectedVariant?.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={!variant.availableForSale}
                  >
                    {getVariantLabel(variant) || variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="lookbook-lightbox__actions">
            <button
              type="button"
              className="lookbook-lightbox__cta lookbook-lightbox__cta--primary"
              onClick={handleAddToCart}
              disabled={busyAction !== '' || !canAddToCart}
            >
              {busyAction === 'cart' ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              type="button"
              className="lookbook-lightbox__cta lookbook-lightbox__cta--secondary"
              onClick={handleBuyNow}
              disabled={busyAction !== '' || !canAddToCart}
            >
              {busyAction === 'buy' ? 'Buying...' : 'Buy Now'}
            </button>
            <button
              type="button"
              className="lookbook-lightbox__cta lookbook-lightbox__cta--tertiary"
              onClick={handleViewDetails}
            >
              View Details
            </button>
          </div>

          <a
            href={enquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lookbook-lightbox__enquiry-link"
          >
            Need fit or styling help? Enquire on WhatsApp
          </a>

          {!canAddToCart && (
            <p className="lookbook-lightbox__status">This option is available by enquiry only.</p>
          )}
          {statusMessage && <p className="lookbook-lightbox__status">{statusMessage}</p>}

          <div className="lookbook-lightbox__assurance" aria-label="Purchase support">
            <span>Secure Shopify checkout</span>
            <span>Studio fitting support</span>
            <span>WhatsApp styling guidance</span>
          </div>

          <div className="lookbook-lightbox__description">
            <p className="lookbook-lightbox__section-label">Details and care</p>
            {productDetails?.descriptionHtml ? (
              <div dangerouslySetInnerHTML={{ __html: productDetails.descriptionHtml }} />
            ) : (
              <p>
                A curated occasionwear piece from Satrangi Designer Studio. Full styling, sizing,
                availability, and customization guidance is available through enquiry.
              </p>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default LookbookLightbox;
