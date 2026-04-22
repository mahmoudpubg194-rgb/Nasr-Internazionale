export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  documents: string[];
  price?: string;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}
