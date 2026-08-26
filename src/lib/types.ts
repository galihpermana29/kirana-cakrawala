export interface SanityImage {
  asset?: { _ref: string };
  hotspot?: unknown;
  crop?: unknown;
  alt?: string;
}

export interface SanityColor {
  hex: string;
}

export interface SiteSettings {
  companyName: string;
  tagline?: string;
  logo?: SanityImage;
  primaryColor?: SanityColor;
  accentColor?: SanityColor;
  footerText?: string;
}

export interface HeroSection {
  _type: 'heroSection';
  _key: string;
  heading: string;
  subheading?: string;
  image?: SanityImage;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface AboutSection {
  _type: 'aboutSection';
  _key: string;
  heading: string;
  body?: string;
  image?: SanityImage;
}

export interface ServiceItem {
  _key: string;
  title: string;
  description?: string;
  image?: SanityImage;
}

export interface ServicesSection {
  _type: 'servicesSection';
  _key: string;
  heading: string;
  intro?: string;
  items?: ServiceItem[];
}

export interface GallerySection {
  _type: 'gallerySection';
  _key: string;
  heading?: string;
  images?: SanityImage[];
}

export interface ContactSection {
  _type: 'contactSection';
  _key: string;
  heading: string;
  intro?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type Section =
  | HeroSection
  | AboutSection
  | ServicesSection
  | GallerySection
  | ContactSection;

export interface Page {
  title: string;
  sections: Section[];
}
