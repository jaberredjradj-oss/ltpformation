export interface GoogleReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  /** ISO date (YYYY-MM-DD) when known from the public listing. */
  date?: string;
}

export interface GoogleReviewsData {
  averageRating: number;
  totalCount: number;
  /** Opens the public Google Maps listing (read reviews). */
  profileUrl: string;
  /** Opens Google’s official review form (write a review). */
  writeReviewUrl: string;
  reviews: GoogleReview[];
}
