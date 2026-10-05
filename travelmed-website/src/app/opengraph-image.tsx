import { ImageResponse } from 'next/og';
import { site } from '@/shared/config/site';
import { getFeaturedKit } from '@/shared/api/product';

export const alt = 'TravelMed — doctor-curated travel medical kit for international trips';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social share image for every page. */
export const revalidate = 300;

export default async function OpengraphImage() {
  const product = await getFeaturedKit();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #083B69 0%, #0B4F8C 55%, #0A3F70 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
            +
          </div>
          {site.name}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
            Travel medical kit for international trips
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: 'rgba(255,255,255,0.75)', maxWidth: 950 }}>
            {`${site.product.medicines} doctor-curated medicines · signed prescription · ${site.consults.count} free doctor consults`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {product && (
            <div style={{ display: 'flex', padding: '14px 28px', borderRadius: 16, background: '#14B8A6', fontSize: 32, fontWeight: 800 }}>
              {`Rs. ${Math.round(product.price).toLocaleString('en-IN')}`}
            </div>
          )}
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>Free express shipping across India</div>
        </div>
      </div>
    ),
    size
  );
}
