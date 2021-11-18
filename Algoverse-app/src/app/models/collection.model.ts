export interface CollectionModelInfo {
  collectionId: string,
  name: string,
  icon: string,
  banner: string,
  featuredImage: string,
  description: string,
  royalties: number,
  customURL: string,
  category: string,
  web: string,
  creator: {
    wallet : string,
    name: string,
    profileImage: string,
    verified: boolean,
    wonVotingPeriods: number[],
    volume: any
  },
  stars: number,
  volume: number

}
