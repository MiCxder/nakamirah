export type Beat = {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  musical_key: string;
  preview: string;
  cover?: string;

  price_basic: number;
  price_premium: number;
  price_exclusive: number;
};