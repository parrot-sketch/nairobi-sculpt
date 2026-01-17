# Phase 2: Doctor Profiles - Implementation Guide

**Status**: Ready to Begin ✅  
**Start Date**: January 16, 2026  
**Estimated Duration**: 1 Week (Days 8-14 of 6-week plan)  
**Dependencies**: ✅ Phase 1 Complete

## Overview

Phase 2 builds the Doctor Profiles feature using the design system foundation from Phase 1. This includes:
- Doctor listing page with filtering
- Doctor profile detail cards
- Image gallery component
- Backend API integration
- Full test coverage (95%+)

## Pre-Phase 2 Checklist

✅ Phase 1 components complete (Button, Card, Badge, Typography)  
✅ Tailwind design system configured  
✅ Jest testing infrastructure ready  
✅ Build pipeline working (0 errors)  
✅ Backend schema supports doctors (13 Prisma models)  
✅ Doctor seed data ready (5 doctors in database)  
✅ Docker development environment ready  

## Development Environment Setup

### 1. Start Docker Services
```bash
cd /home/parrot/nairobi-sculpt

# Quick start (all-in-one)
./dev-setup.sh

# Or manual setup
docker-compose up -d
docker-compose exec api pnpm exec prisma migrate dev
docker-compose exec api pnpm exec prisma db seed
```

### 2. Access Services
- **Web**: http://localhost:5173
- **API**: http://localhost:3000/api
- **Database**: localhost:5432
- **PgAdmin**: http://localhost:5050

### 3. Verify Setup
```bash
# Check API health
curl http://localhost:3000/health

# Check web app loads
curl http://localhost:5173

# List doctors via API
curl http://localhost:3000/api/doctors
```

## Phase 2 Implementation Plan

### Week 2 Timeline

**Day 8-9 (Tuesday-Wednesday): Foundation**
- [ ] Create DoctorCard component (uses Phase 1 Card)
- [ ] Create ImageGallery component
- [ ] Create FilterBar component
- [ ] Set up API service layer for doctor endpoints
- [ ] Unit tests for all components (10+ tests)

**Day 10-11 (Thursday-Friday): Listing Page**
- [ ] Create DoctorListing page component
- [ ] Implement pagination
- [ ] Add filtering (specialty, availability, rating)
- [ ] Add search functionality
- [ ] Integration tests with API (15+ tests)

**Day 12-13 (Saturday-Sunday): Detail Page**
- [ ] Create DoctorDetail page component
- [ ] Build appointment CTA section
- [ ] Add reviews/ratings section
- [ ] Implementation tests (10+ tests)

**Day 14 (Monday): Testing & Deployment**
- [ ] Full E2E tests
- [ ] Coverage verification (95%+)
- [ ] Code review & QA
- [ ] Deploy to staging
- [ ] Performance testing

## Component Architecture

### Components to Create

```
apps/web/src/components/
├── Doctor/
│   ├── DoctorCard.tsx          (reuses Phase 1 Card)
│   ├── DoctorCard.test.tsx     
│   ├── DoctorGrid.tsx           
│   ├── DoctorGrid.test.tsx     
│   └── index.ts
├── ImageGallery/
│   ├── ImageGallery.tsx        
│   ├── ImageGallery.test.tsx   
│   ├── ImageViewer.tsx         
│   └── index.ts
├── FilterBar/
│   ├── FilterBar.tsx           
│   ├── FilterBar.test.tsx      
│   ├── FilterOption.tsx        
│   └── index.ts
└── Appointment/
    ├── AppointmentCTA.tsx      
    ├── AppointmentCTA.test.tsx 
    └── index.ts
```

### Pages to Create

```
apps/web/src/pages/
├── DoctorListingPage.tsx       (using DoctorGrid, FilterBar)
├── DoctorListingPage.test.tsx  
├── DoctorDetailPage.tsx        (using DoctorCard, ImageGallery)
├── DoctorDetailPage.test.tsx   
└── styles/
    ├── doctor-listing.css      
    └── doctor-detail.css       
```

### API Integration Layer

```
apps/web/src/services/
├── api.ts                      (base API client)
├── doctorService.ts            (doctor endpoints)
├── doctorService.test.ts       
└── hooks/
    ├── useDoctors.ts           (fetch doctors list)
    ├── useDoctor.ts            (fetch single doctor)
    ├── useDoctorSearch.ts      (search functionality)
    └── __tests__/
        ├── useDoctors.test.ts  
        ├── useDoctor.test.ts   
        └── useDoctorSearch.test.ts
```

## Backend API Endpoints

The following endpoints should already exist from backend implementation:

```
GET    /api/doctors              # List all doctors with pagination
GET    /api/doctors/:id          # Get doctor details
GET    /api/doctors/:id/gallery  # Get doctor's image gallery
GET    /api/doctors/search       # Search doctors
POST   /api/doctors/:id/rate     # Submit rating (auth required)
GET    /api/specialties          # List medical specialties
GET    /api/doctors/by-specialty/:specialty  # Filter by specialty
```

Verify these exist:
```bash
curl http://localhost:3000/api/doctors
```

## Example Component Implementations

### DoctorCard Component
```tsx
import { Card, Badge, Button } from '@/components';
import type { DoctorProfile } from '@/types/doctor';

interface DoctorCardProps {
  doctor: DoctorProfile;
  onViewDetails: (id: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewDetails }) => {
  return (
    <Card hover elevated>
      <Card.Header className="relative">
        <img src={doctor.profileImage} alt={doctor.name} className="w-full h-48 object-cover rounded" />
        <Badge variant="success" size="sm" className="absolute top-2 right-2">
          Available
        </Badge>
      </Card.Header>
      <Card.Body>
        <h3 className="text-lg font-semibold">{doctor.name}</h3>
        <p className="text-sm text-gray-600">{doctor.specialties.join(', ')}</p>
        <div className="mt-2 flex gap-2">
          <Badge variant="info" size="sm">{doctor.yearsExperience} years</Badge>
          <Badge variant="primary" size="sm">★ {doctor.rating}</Badge>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" fullWidth onClick={() => onViewDetails(doctor.id)}>
          View Profile
        </Button>
      </Card.Footer>
    </Card>
  );
};
```

### DoctorListing Page
```tsx
import { useState } from 'react';
import { DoctorGrid } from '@/components/Doctor';
import { FilterBar } from '@/components/FilterBar';
import { useDoctors } from '@/services/hooks/useDoctors';

export const DoctorListingPage: React.FC = () => {
  const [filters, setFilters] = useState({
    specialty: '',
    sortBy: 'rating',
    page: 1,
  });

  const { doctors, loading, error } = useDoctors(filters);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Our Doctors</h1>
      
      <FilterBar onFilterChange={setFilters} />
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <DoctorGrid doctors={doctors} />
      )}
    </div>
  );
};
```

## Testing Strategy

### Unit Tests (per component)
```
DoctorCard:              8 tests
  • Renders doctor info
  • Shows availability badge
  • Displays rating
  • Click handler works
  • Responsive layout
  • Image handling
  • Variant display
  • Accessibility

DoctorGrid:              5 tests
  • Renders list of cards
  • Pagination works
  • Loading state
  • Empty state
  • Grid layout

FilterBar:               10 tests
  • All filter options work
  • Search works
  • Sort options work
  • Filter change handlers
  • Clear filters
  • Accessibility

ImageGallery:            8 tests
  • Renders images
  • Navigation works
  • Lightbox opens
  • Keyboard navigation
  • Mobile swipe
  • Loading states
```

### Integration Tests
```
DoctorListingPage:       12 tests
  • Page loads correctly
  • Fetches doctors from API
  • Filters work end-to-end
  • Search works end-to-end
  • Pagination works
  • Loading states
  • Error handling
  • Responsive design

DoctorDetailPage:        10 tests
  • Page loads with doctor data
  • Gallery renders all images
  • Appointments CTA visible
  • Reviews section loads
  • Related doctors shown
  • Navigation works
```

### E2E Tests
```
Doctor Journey:          5 tests
  • User can view doctors list
  • User can filter doctors
  • User can search doctors
  • User can view doctor details
  • User can initiate appointment
```

**Target Coverage**: 95%+  
**Target Test Count**: 50+ tests

## Type Definitions

Ensure these types are available in `packages/types/src`:

```tsx
// doctor.ts
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  yearsExperience: number;
  profileImage: string;
  gallery: string[];
  bio: string;
  rating: number;
  ratingCount: number;
  availability: DaySchedule[];
  consultationFee: number;
  appointmentDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface DaySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface DoctorSearchParams {
  specialty?: string;
  searchTerm?: string;
  sortBy?: 'rating' | 'experience' | 'name';
  page?: number;
  limit?: number;
}
```

## API Service Layer

Create `apps/web/src/services/doctorService.ts`:

```tsx
import axios from 'axios';
import type { DoctorProfile, DoctorSearchParams } from '@/types/doctor';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const doctorService = {
  // List all doctors
  async getDoctors(params?: DoctorSearchParams) {
    const response = await axios.get<{
      data: DoctorProfile[];
      total: number;
      page: number;
      limit: number;
    }>(`${API_BASE}/doctors`, { params });
    return response.data;
  },

  // Get single doctor
  async getDoctorById(id: string) {
    const response = await axios.get<DoctorProfile>(`${API_BASE}/doctors/${id}`);
    return response.data;
  },

  // Search doctors
  async searchDoctors(query: string) {
    const response = await axios.get<DoctorProfile[]>(`${API_BASE}/doctors/search`, {
      params: { q: query },
    });
    return response.data;
  },

  // Get doctor gallery
  async getDoctorGallery(doctorId: string) {
    const response = await axios.get<{ images: string[] }>(
      `${API_BASE}/doctors/${doctorId}/gallery`
    );
    return response.data.images;
  },

  // Rate doctor
  async rateDoctor(doctorId: string, rating: number, review?: string) {
    const response = await axios.post(`${API_BASE}/doctors/${doctorId}/rate`, {
      rating,
      review,
    });
    return response.data;
  },
};
```

## Development Workflow

### 1. Create Component Branch
```bash
git checkout -b feature/phase-2-doctors
```

### 2. Create Components
```bash
# Create DoctorCard
touch apps/web/src/components/Doctor/DoctorCard.tsx
touch apps/web/src/components/Doctor/DoctorCard.test.tsx

# Create other components...
```

### 3. Implement with TDD
```bash
# Write test first
# Implement component to pass test
# Run tests
docker-compose exec web pnpm test

# Run all tests with coverage
docker-compose exec web pnpm test:cov
```

### 4. Integration Tests
```bash
# Create page component
# Test with API service
# Run integration tests
docker-compose exec web pnpm test:watch
```

### 5. Submit for Review
```bash
git add .
git commit -m "feat(phase-2): implement doctor profiles

- Add DoctorCard component
- Add DoctorGrid component  
- Add FilterBar component
- Add ImageGallery component
- Create DoctorListing page
- Create DoctorDetail page
- API service layer
- 50+ unit/integration tests
- 95%+ code coverage"

git push origin feature/phase-2-doctors
```

## Success Criteria

✅ All components implemented  
✅ 50+ tests passing (95%+ coverage)  
✅ API integration working  
✅ Zero TypeScript errors  
✅ Build succeeds  
✅ Responsive design (mobile, tablet, desktop)  
✅ Accessibility compliance (WCAG 2.1)  
✅ Code review approved  
✅ Deployed to staging  
✅ E2E tests passing  

## Resources & References

- **Phase 1 Components**: [PHASE_1_QUICK_REFERENCE.md](./PHASE_1_QUICK_REFERENCE.md)
- **Type Definitions**: [packages/types/src/doctor.ts](packages/types/src/doctor.ts)
- **Backend API**: http://localhost:3000/api
- **Testing Guide**: See Phase 1 test examples
- **Design System**: [Tailwind Config](apps/web/tailwind.config.ts)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Estimated Component Code

```
DoctorCard:         ~80 lines
DoctorGrid:         ~50 lines
FilterBar:          ~120 lines
ImageGallery:       ~150 lines
AppointmentCTA:     ~60 lines
DoctorService:      ~80 lines
useDoctors Hook:    ~40 lines
DoctorListingPage:  ~60 lines
DoctorDetailPage:   ~100 lines
──────────────────────────
Total:              ~740 lines of components
Tests:              ~50 test cases
```

## Ready to Begin?

✅ Environment: Docker setup complete  
✅ Database: Seeded with 5 doctors  
✅ Design System: Phase 1 complete  
✅ Backend API: Ready to integrate  
✅ Testing Infrastructure: Jest configured  
✅ Documentation: Complete  

### Start Phase 2
```bash
cd /home/parrot/nairobi-sculpt

# Ensure services running
docker-compose ps

# Create feature branch
git checkout -b feature/phase-2-doctors

# Begin implementation!
```

---

**Next Phase**: Phase 3 - Services Catalog (Week 3)  
**Team**: Frontend Development  
**Repository**: nairobi-sculpt  
**Status**: 🚀 Ready to Launch Phase 2
