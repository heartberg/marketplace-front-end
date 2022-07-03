import { Injectable } from '@angular/core';

//import { IPFS, create } from 'ipfs-core';
import * as IPFS_ROOT_TYPES from 'ipfs-core-types/src/root';
import { create } from 'ipfs-http-client';
import { BehaviorSubject, } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IpfsDaemonService {

  private ipfsHttpClient = create({url: 'https://ipfs.infura.io:5001/api/v0'})

  uploadFile = async (file: any): Promise<string> => {
    try {
        const added = await this.ipfsHttpClient.add(file)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        return url;

    } catch (err) {
        console.log('Error uploading the file : ', err)
    }
    return ''
  }

  addMetaData = async (data: any): Promise<string> => {
    try {
      const added = await this.ipfsHttpClient.add(JSON.stringify(data))
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      return url;

    } catch (err) {
        console.log('Error uploading the file : ', err)
    }
    return ''
  }

}
