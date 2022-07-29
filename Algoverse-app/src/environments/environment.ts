// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://algoverse.azurewebsites.net/',
  // baseUrl: 'http://localhost:5000/',
  ipfs_base: "https://ipfs.infura.io/ipfs/",

  ALGOD_URL:"https://testnet-algorand.api.purestake.io/ps2",
  ALGOD_TOKEN:"Z4lUOOfIOm8thZUeUK9n349ImUCpiCC190RtGnm6",
  ALGOD_INDEXER_ADDRESS:"https://testnet-algorand.api.purestake.io/idx2",

  // ALGOD_URL:"http://localhost",
  // ALGOD_TOKEN:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  // ALGOD_INDEXER_ADDRESS:"http://localhost",

  FEE_APP_ID: 101663109,
  STORE_APP_ID: 101663840,
  TRADE_APP_ID: 101664818,
  BID_APP_ID: 101664718,
  SWAP_APP_ID: 101664942,
  AUCTION_APP_ID: 101665071,
  STAKING_APP_ID: 101664113,
  TEAM_WALLET_ADDRESS: "UCAX3M5HS7PWWLB6HDCM2O7JE4HC3RGBPNWFRP4SYU62ZS5NSS2GFOKIOU"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
