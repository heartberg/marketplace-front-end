export interface UserHotModel {
  userHot: userHotObj[];
}
interface userHotObj {
  wallet: string;
  name: string;
  profileImage: string;
  verified: string;
  wonVotingPeriods: any[];
  volume: any;
}
