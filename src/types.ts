export type { GameItem, PartnerCredit, GameExtraLink } from './lib/firebase';

export interface GameEdition {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  popular?: boolean;
}
