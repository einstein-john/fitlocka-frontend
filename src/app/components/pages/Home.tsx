import Hero from '../sections/Hero';
import BrandsBar from '../sections/BrandsBar';
import FilterRow from '../sections/FilterRow';
import FeaturedProducts from '../sections/FeaturedProducts';
import PromoSplit from '../sections/PromoSplit';
import NewArrivals from '../sections/NewArrivals';
import AboutStrip from '../sections/AboutStrip';
import Newsletter from '../sections/Newsletter';
import SeoHead, { defaultJsonLdOrganization, jsonLdWebSite } from '@/app/components/SeoHead';

export default function Home() {
  return (
    <>
      <SeoHead
        title="FITLOCKA — Retro jerseys & sport culture"
        description="Authentic retro jerseys from the eras that defined sport. Curated collections, global sourcing."
        canonicalPath="/"
        jsonLd={[defaultJsonLdOrganization(), jsonLdWebSite()]}
      />
      <Hero />
      <BrandsBar />
      <FilterRow />
      <FeaturedProducts />
      <PromoSplit />
      <NewArrivals />
      <AboutStrip />
      <Newsletter />
    </>
  );
}
