import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public passingData: any = null
  public collections: Array<any> = []
  public editProfileData: any;

  constructor() {}

  set setEditProfileData(profileData: any) {
    this.editProfileData = profileData;
  }

  get getEditProfileData(): any {
    return this.editProfileData;
  }

  public getCollectionByName(name: string) {
    for (let collection of this.collections) {
      if (collection.name == name) {
        return collection;
      }
    }
    return null;
  }

}
