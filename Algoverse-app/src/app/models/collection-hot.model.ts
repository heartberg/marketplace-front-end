export interface CollectionHotModel {
  collectionHot: CollectionHotObj[];
}

interface CollectionHotObj {
  collectionId: string;
  name: string;
  icon: string;
  category: string;
  stars: number;
  volume: number;
}
