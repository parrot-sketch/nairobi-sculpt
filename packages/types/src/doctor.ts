// packages/types/src/doctor.ts - Doctor Profile Types

export interface DoctorSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  blog?: string;
}

export interface DoctorKeyStats {
  label: string;
  value: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  specializations: string[];
  experience: string;
  achievements: string[];
  biography: string;
  keyStats: DoctorKeyStats[];
  socialLinks: DoctorSocialLinks;
  procedures?: string[];
  affiliations?: string[];
  educationBackground?: string;
  awards?: string[];
  publications?: string[];
  slug: string; // For URL: /doctors/dr-john-paul-ogalo
}

export interface CreateDoctorInput {
  name: string;
  title: string;
  imageUrl: string;
  specializations: string[];
  experience: string;
  achievements: string[];
  biography: string;
  keyStats: DoctorKeyStats[];
  socialLinks: DoctorSocialLinks;
  procedures?: string[];
  affiliations?: string[];
  educationBackground?: string;
  awards?: string[];
  publications?: string[];
}
