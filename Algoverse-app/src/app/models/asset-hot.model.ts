export interface AssetHotModel {
  assetHot: AssetHotObj[];
}

interface AssetHotObj {
  assetId: number;
  file: string;
  name: string;
  creator: {
    wallet: string;
    name: string;
    profileImage: string;
    verified: boolean;
    wonVotingPeriods: any[];
    volume: string;
  }
  collection: {
    collectionId: string;
    name: string;
    icon: string;
    category: string;
    stars: number;
    volume: number;
  }
  price: number;
  highestBid: number;
  stars: number
}
