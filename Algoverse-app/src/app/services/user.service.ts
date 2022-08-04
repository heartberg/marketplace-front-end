// @ts-ignore

import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {updateUser} from "../models";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  public mUserInfo: any | undefined;

  constructor(private _http: HttpClient) {
  }

  loadProfile(wallet: String): Observable<any> {
    const url = `${this.baseUrl}user/get/byWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  loadAllUsers(ordering: string): Observable<any> {
    const url = `${this.baseUrl}user/get/all?ordering=${ordering}`;
    return this._http.get<any>(url);
  }

  syncUserAssets(wallet: String): Observable<any> {
    const url = `${this.baseUrl}user/syncAssets/byWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  userUpdate(data: updateUser):Observable<any> {
    const url = `${this.baseUrl}user/update`;
    return this._http.post<any>(url, data);
  }

  loadUserOwnedAssets(address: string): Observable<any> {
    const url = `${this.baseUrl}asset/get/ownedAssetsByWallet?wallet=${address}&page=0`;
    return this._http.get<any>(url);
  }

  loadUserCreatedAssets(address: string): Observable<any> {
    const url = `${this.baseUrl}asset/get/createdAssetsForWallet?wallet=${address}&page=0`;
    return this._http.get<any>(url);
  }

  createProfile(wallet: String): Observable<any> {
    const url = `${this.baseUrl}user/create`;
    const params = {
      wallet
    }
    return this._http.post(url, params);
  }

  loadCollections(wallet: string): Observable<any> {
    const url = `${this.baseUrl}collection/get/byWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  loadCollectionItem(collectionId: string): Observable<any> {
    const url = `${this.baseUrl}collection/get/byId?id=${collectionId}`;
    return this._http.get<any>(url);
  }

  createCollection(params: any): Observable<any> {
    const url = `${this.baseUrl}collection/add`;
    return this._http.post(url, params);
  }

  createAsset(params: any): Observable<any> {
    const url = `${this.baseUrl}asset/add`;
    return this._http.post(url, params);
  }

  loadFeaturedArtists(): Observable<any> {
    const url = `${this.baseUrl}user/get/featured`;
    return this._http.get<any>(url);
  }

  loadHotCollections(days: number): Observable<any> {
    const url = `${this.baseUrl}collection/get/hot?lastDays=${days}`;
    return this._http.get<any>(url);
  }

  loadHotAssets(days: number): Observable<any> {
    const url = `${this.baseUrl}asset/get/hot?lastDays=${days}`;
    return this._http.get<any>(url);
  }

  loadHotSellers(days: number): Observable<any> {
    const url = `${this.baseUrl}user/get/hot/seller?lastDays=${days}`;
    return this._http.get<any>(url);
  }

  loadHotBuyers(days: number): Observable<any> {
    const url = `${this.baseUrl}user/get/hot/buyer?lastDays=${days}`;
    return this._http.get<any>(url);
  }

  loadHotCreators(days: number): Observable<any> {
    const url = `${this.baseUrl}user/get/hot?lastDays=${days}`;
    return this._http.get<any>(url);
  }

  loadTrades(address: string): Observable<any> {
    const url = `${this.baseUrl}trade/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  loadTradeItem(tradeId: string): Observable<any> {
    const url = `${this.baseUrl}trade/${tradeId}`;
    return this._http.get<any>(url);
  }

  getHot(): Observable<any> {
    const url = `${this.baseUrl}user/get/hot`;
    return this._http.get<any>(url);
  }

  getTradeIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}trade/getTradeIndex?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  optinAndRekeyToTrade(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}trade/optinAndRekey?indexAddress=${indexAddress}`;
    return this._http.get(url);
  }

  createTrade(params: any): Observable<any> {
    const url = `${this.baseUrl}trade/create`;
    return this._http.post(url, params);
  }

  cancelTrade(tradeId: string): Observable<any> {
    const url = `${this.baseUrl}trade/cancel?tradeId=${tradeId}`;
    return this._http.post(url, {tradeId});
  }

  acceptTrade(tradeId: string, accepter: string): Observable<any> {
    const url = `${this.baseUrl}trade/accept?tradeId=${tradeId}&acceptorWallet=${accepter}`;
    return this._http.post(url, {tradeId});
  }

  loadBids(address: string): Observable<any> {
    const url = `${this.baseUrl}bid/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  loadBidItem(bidId: string): Observable<any> {
    const url = `${this.baseUrl}bid/${bidId}`;
    return this._http.get<any>(url);
  }

  getBidIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}bid/getBidIndex?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  optinAndRekeyToBid(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}bid/optinAndRekey?indexAddress=${indexAddress}`;
    return this._http.get(url);
  }

  createBid(params: any): Observable<any> {
    const url = `${this.baseUrl}bid/create`;
    return this._http.post(url, params);
  }

  cancelBid(bidId: string): Observable<any> {
    const url = `${this.baseUrl}bid/cancel?bidId=${bidId}`;
    return this._http.post(url, {bidId});
  }

  acceptBid(bidId: string, accepter: string): Observable<any> {
    const url = `${this.baseUrl}bid/accept?bidId=${bidId}&acceptor=${accepter}`;
    return this._http.post(url, {});
  }

  loadTrendingItems(): Observable<any> {
    const url = `${this.baseUrl}global/trending`;
    return this._http.get<any>(url);
  }

  search(type: string, address: string, searchKey: string, category: string, collection: string,
    artist: string, lowPrice: number, highPrice: number, sortBy: string): Observable<any> {
    const url = `${this.baseUrl}global/search?type=${type}&address=${address}&searchKey=${searchKey}` +
      `&category=${category}&collection=${collection}&artist=${artist}&lowPrice=${lowPrice}` +
      `&highPrice=${highPrice}&sortBy=${sortBy}`;
    return this._http.get<any>(url);
  }

  loadMetaData(url: string): Observable<any> {
    return this._http.get<any>(url);
  }

  loadSwapItem(swapId: string): Observable<any> {
    const url = `${this.baseUrl}swap/${swapId}`;
    return this._http.get<any>(url);
  }

  loadSwaps(address: string): Observable<any> {
    const url = `${this.baseUrl}swap/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  loadStarredAssets(addr: string) {
    const url = `${this.baseUrl}asset/starredByAddress?address=${addr}`;
    return this._http.get<any>(url);
  }

  getSwapIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}swap/getSwapIndex?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  optinAndRekeyToSwap(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}swap/optinAndRekey?indexAddress=${indexAddress}`;
    return this._http.post(url, {indexAddress});
  }

  createSwap(params: any): Observable<any> {
    const url = `${this.baseUrl}swap/create`;
    return this._http.post(url, params);
  }

  cancelSwap(swapId: string): Observable<any> {
    const url = `${this.baseUrl}swap/cancel?swapId=${swapId}`;
    return this._http.post(url, {swapId});
  }

  acceptSwap(swapId: string, acceptorWallet: string): Observable<any> {
    const url = `${this.baseUrl}swap/accept?swapId=${swapId}&acceptorWallet=${acceptorWallet}`;
    return this._http.post(url, {swapId});
  }

  loadAuctions(address: string): Observable<any> {
    const url = `${this.baseUrl}auction/searchByAddress?wallet=${address}`;
    return this._http.get<any>(url);
  }

  loadAuctionItem(auctionId: any): Observable<any> {
    const url = `${this.baseUrl}auction/${auctionId}`;
    return this._http.get<any>(url);
  }

  loadAuctionsWithMyBids(wallet: string) {
    const url = `${this.baseUrl}auction/bidAuctionsByWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  getAuctionIndex(senderAddress: string) {
    const url = `${this.baseUrl}auction/getAuctionIndex?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  optinAndRekeyToAuction(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}auction/optinAndRekey?indexAddress=${indexAddress}`;
    return this._http.post(url, {indexAddress});
  }

  createAuction(params: any): Observable<any> {
    const url = `${this.baseUrl}auction/create`;
    return this._http.post(url, params);
  }

  closeAuction(auctionId: string): Observable<any> {
    const url = `${this.baseUrl}auction/close?auctionId=${auctionId}`;
    return this._http.post(url, {auctionId});
  }

  bidAuction(params: any): Observable<any> {
    const url = `${this.baseUrl}auction/bid`;
    return this._http.post(url, params);
  }

  getNotification(wallet: string): Observable<any> {
    const url = `${this.baseUrl}notification/get/forWallet?wallet=${wallet}`;
    return this._http.get<any>(url)
  }

  getCollectionStar(wallet: string, collectionId: string): Observable<any> {
    const url = `${this.baseUrl}collection/star/get?wallet=${wallet}&collectionId=${collectionId}`;
    return this._http.get<any>(url)
  }

  addCollectionStar(params: any): Observable<any> {
    const url = `${this.baseUrl}collection/star/add`;
    return this._http.post(url, params);
  }

  removeCollectionStar(starId: string): Observable<any> {
    const url = `${this.baseUrl}collection/star/remove/${starId}`;
    return this._http.delete(url);
  }

  getAssetStar(wallet: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}asset/star/get?wallet=${wallet}&assetId=${assetId}`;
    return this._http.get<any>(url)
  }

  addAssetStar(params: any): Observable<any> {
    const url = `${this.baseUrl}asset/star/add`;
    return this._http.post(url, params);
  }

  removeAssetStar(starId: string): Observable<any> {
    const url = `${this.baseUrl}asset/star/remove/${starId}`;
    return this._http.delete(url);
  }

  public receiveAssetInformation(assetUrl: string): Observable<any> {
    return this._http.get(assetUrl);
  }
}
