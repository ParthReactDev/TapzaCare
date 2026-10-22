import React from 'react';
import { Animated } from 'react-native';
import { LayoutSection } from '../../models/BackendApi';
import { HeroBannerSection } from './HeroBannerSection';
import { CategoryChipsSection } from './CategoryChipsSection';
import { QuickActionsSection } from './QuickActionsSection';
import { ServiceGridSection } from './ServiceGridSection';
import { DoctorCarouselSection } from './DoctorCarouselSection';
import { OfferStripSection } from './OfferStripSection';

interface SectionRendererProps {
  section: LayoutSection;
  scrollY?: Animated.Value;
  onNavigate: (route: string) => void;
  onBookDoctor: (doctor: any) => void;
  onBookService: (service: any) => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  scrollY,
  onNavigate,
  onBookDoctor,
  onBookService,
}) => {
  // CRITICAL REQUIREMENT:
  // "unknown type → skip" (must render nothing and never crash)
  switch (section.type) {
    case 'hero_banner': {
      const bannerItem = (section.items?.[0] as any) || {};
      return (
        <HeroBannerSection
          key={section.id}
          data={bannerItem}
          background={section.background}
          scrollY={scrollY}
          onCtaPress={() => onNavigate('BookingsTab')}
        />
      );
    }

    case 'category_chips': {
      return (
        <CategoryChipsSection
          key={section.id}
          items={(section.items as any) || []}
          background={section.background}
          title={section.title}
        />
      );
    }

    case 'quick_actions': {
      return (
        <QuickActionsSection
          key={section.id}
          items={(section.items as any) || []}
          background={section.background}
          title={section.title}
          onNavigate={onNavigate}
        />
      );
    }

    case 'service_grid': {
      return (
        <ServiceGridSection
          key={section.id}
          items={(section.items as any) || []}
          background={section.background}
          title={section.title}
          onBookService={onBookService}
        />
      );
    }

    case 'doctor_carousel': {
      return (
        <DoctorCarouselSection
          key={section.id}
          items={(section.items as any) || []}
          background={section.background}
          title={section.title}
          onBookDoctor={onBookDoctor}
        />
      );
    }

    case 'offer_strip': {
      const offerItem = (section.items?.[0] as any) || {};
      return (
        <OfferStripSection
          key={section.id}
          data={offerItem}
          background={section.background}
          onPressAction={() => onNavigate('BookingsTab')}
        />
      );
    }

    default:
      // Unknown section type: safely skip (renders nothing)
      return null;
  }
};
