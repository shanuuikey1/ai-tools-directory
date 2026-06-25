import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component — wraps react-helmet-async with sensible defaults for every page.
 * All pages should import this and pass their own title/description.
 */
const SEO = ({ 
  title = 'Ghar Pahuch Seva',
  description = 'Book trusted home service professionals in Chhindwara — cleaning, plumbing, electrical, beauty, AC repair, and more.',
  keywords = 'home services, chhindwara, plumber, electrician, cleaning, beauty, AC repair, carpenter, pest control',
  image = '/hero.png',
  url = 'https://gharpahuchseva.com',
  type = 'website',
}) => {
  const fullTitle = title === 'Ghar Pahuch Seva' 
    ? title 
    : `${title} — Ghar Pahuch Seva`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Ghar Pahuch Seva',
          description: 'Book trusted home service professionals in Chhindwara',
          url: url,
          image: image,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chhindwara',
            addressRegion: 'Madhya Pradesh',
            addressCountry: 'IN',
          },
          telephone: '+91-9999-9999-99',
          priceRange: '₹₹',
          openingHours: 'Mo-Su 00:00-23:59',
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
