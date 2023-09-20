export class AppConsts {
  static remoteServiceBaseUrl: string =
    'https://qrscanner.serviceendpoints.co.za';
  static remoteContentBaseUrl: string = '<remote-content-base-url>';
  static VAPID_PUBLIC = '<vapid-public>';
  static siteBaseUrl: string = window.origin;
  static appSignature: string = 'c6a23dbe-5e8f-4d23-8820-2edd27a73602';
  static remoteServiceBaseUrlFormat: string;
  static appBaseUrl: string;
  static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

  static localeMappings: any = [];

  static readonly userManagement = {
    defaultAdminUserName: 'admin',
  };

  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token',
  };

  static readonly grid = {
    defaultPageSize: 10,
  };
}
