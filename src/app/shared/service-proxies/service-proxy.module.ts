import { NgModule } from '@angular/core';
import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.ServiceProxy,
    ApiServiceProxies.AdminServiceProxy,
    ApiServiceProxies.SecurityServiceProxy,
    ApiServiceProxies.PublicServiceProxy,
    ApiServiceProxies.QrServiceProxy
  ],
})
export class ServiceProxyModule { }
