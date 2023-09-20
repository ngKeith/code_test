export class UrlHelper {
  /**
   * The URL requested, before initial routing.
   */
  static readonly initialUrl = location.href;
  static setInitialUrl: any;

  static getQueryParameters(): any {
    return UrlHelper.getQueryParametersUsingParameters(
      document.location.search
    );
  }

  static getQueryParametersUsingParameters(search: string): any {
    const result: { [key: string]: string } = {};
    const queryParameters = search.replace(/(^\?)/, '').split('&');

    queryParameters.forEach((param) => {
      const [key, value] = param.split('=');
      result[key] = value;
    });

    return result;
  }

  static getQueryParametersUsingHash(): any {
    const result: { [key: string]: string } = {};
    const queryParameters = document.location.hash
      .substr(1)
      .replace(/(^\?)/, '')
      .split('&');

    queryParameters.forEach((param) => {
      const [key, value] = param.split('=');
      result[key] = value;
    });

    return result;
  }

  static getInitialUrlParameters(): any {
    let questionMarkIndex = UrlHelper.initialUrl.indexOf('?');
    if (questionMarkIndex >= 0) {
      return UrlHelper.initialUrl.substr(
        questionMarkIndex,
        UrlHelper.initialUrl.length - questionMarkIndex
      );
    }

    return '';
  }

  static getReturnUrl(): string {
    const queryStringObj = UrlHelper.getQueryParametersUsingParameters(
      UrlHelper.getInitialUrlParameters()
    );
    if (queryStringObj.returnUrl) {
      return decodeURIComponent(queryStringObj.returnUrl);
    }

    return '';
  }

  static getSingleSignIn(): boolean {
    const queryStringObj = UrlHelper.getQueryParametersUsingParameters(
      UrlHelper.getInitialUrlParameters()
    );
    if (queryStringObj.ss) {
      return queryStringObj.ss;
    }

    return false;
  }

  static isInstallUrl(url: any): boolean {
    return url && url.indexOf('admin/install') >= 0;
  }
}
