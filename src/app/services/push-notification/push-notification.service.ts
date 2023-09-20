import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const SERVER_URL =
  'https://qrscanner.serviceendpoints.co.za/notifications/';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private http: HttpClient) { }

  public sendSubscriptionToTheServer(
    subscription: PushSubscription,
    appId: string
  ) {
    let sub: any = subscription;
    return this.http.post(SERVER_URL + 'subscribe/' + appId, subscription);
  }
}
