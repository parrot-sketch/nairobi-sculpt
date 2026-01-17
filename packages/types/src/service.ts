// packages/types/src/service.ts - Service Types

export interface Service {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  benefits: string[];
  risks?: string[];
  recovery: {
    downtime: string;
    fullRecovery: string;
    restrictions: string[];
  };
  doctorIds: string[]; // References to DoctorProfile ids
  pricing?: {
    minPrice: number;
    maxPrice: number;
    currency: string;
  };
  beforeAfterGallery?: {
    before: string[];
    after: string[];
  };
  faq?: {
    question: string;
    answer: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface CreateServiceInput {
  categoryId: string;
  name: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  benefits: string[];
  risks?: string[];
  recovery: {
    downtime: string;
    fullRecovery: string;
    restrictions: string[];
  };
  doctorIds: string[];
  pricing?: {
    minPrice: number;
    maxPrice: number;
    currency: string;
  };
}
