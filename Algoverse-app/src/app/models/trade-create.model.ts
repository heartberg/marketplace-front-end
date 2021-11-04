export interface TradeCreateModel {
  assetId: string,
  price: number,
  tradeCreator: {
    wallet: string
  },
  amount: number
}
