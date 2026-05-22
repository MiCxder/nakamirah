export type Beat = {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  musical_key: string;
  cover: string;
  preview: string;
  tags?: string[];

  price_basic: number;
  price_premium: number;
  price_exclusive: number;
};