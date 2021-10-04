import {Injectable} from "@angular/core";

Moralis.initialize('YOUR_APP_ID');
//Server url from moralis.io
Moralis.serverURL = 'YOUR_SERVER_URL';

@Injectable(

)

let user;
let web3;
let result = '';

const provider = 'walletconnect';

function renderApp() {
  user = Moralis.User.current();
}

const arrrrr = async function authenticate() {
  try {
    user = await Moralis.Web3.authenticate({ provider });
    web3 = await Moralis.Web3.enable({ provider });
  } catch (error) {
    console.log('authenticate failed', error);
  }
  renderApp();
}

async function logout() {
  try {
    await Moralis.User.logOut();
  } catch (error) {
    console.log('logOut failed', error);
  }
  result = '';
  renderApp();
}

async function testCall() {
  try {
    result = await web3.eth.personal.sign('Hello world', user.get('ethAddress'));
  } catch (error) {
    console.log('testCall failed', error);
  }
  renderApp();
}

async function enableWeb3() {
  try {
    web3 = await Moralis.Web3.enable({ provider });
  } catch (error) {
    console.log('testCall failed', error);
  }
  renderApp();
}

renderApp();

export class walletConnectConnector {

}
