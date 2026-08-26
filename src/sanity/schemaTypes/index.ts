import { page } from './page';
import {
  aboutSection,
  contactSection,
  gallerySection,
  heroSection,
  servicesSection,
} from './sections';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  siteSettings,
  page,
  heroSection,
  aboutSection,
  servicesSection,
  gallerySection,
  contactSection,
];
