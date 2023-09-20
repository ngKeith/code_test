export class AuthApp {
  appId: string;
  serverSig?: string;

  constructor(appId: string, serverSig?: string) {
    this.appId = appId;
    this.serverSig = serverSig;
  }
}
