export type Photo = {
  id: string;
  src: string;   // path under /public/photos
  alt?: string;
  takenAt?: string; // ISO date
  placeId?: string;
  tags?: string[];
};

export type Review = {
  id: string;
  slug: string;
  placeId: string;
  title: string;
  rating: number; // 1-5
  dateVisited: string; // ISO
  cost?: string;
  tags?: string[];
  pros?: string[];
  cons?: string[];
  tips?: string[];
  body?: string;
  photos?: string[]; // photo ids
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  country?: string;
  coords?: { lat: number; lng: number };
  categories?: string[];
  coverPhotoId?: string;
  averageRating?: number;
  reviewIds?: string[];
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  coverPhotoId?: string;
  summary?: string;
  placeIds?: string[];
  photoIds?: string[];
};
