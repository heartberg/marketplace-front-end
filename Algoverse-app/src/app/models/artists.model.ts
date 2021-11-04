export interface ArtistsModel {
  artistModel: ArtistsModelObj[];
}

export interface ArtistsModelObj {
  wallet: string;
  name: string,
  profileImage: string,
  verified: boolean,
  wonVotingPeriods: any,
  volume: any;
}
