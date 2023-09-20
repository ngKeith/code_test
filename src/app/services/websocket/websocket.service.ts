// frontend/src/app/websocket.service.ts
import { EventEmitter, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AppConsts } from '../../shared/AppConsts';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  public receivedData: any[] = [];

  public messageReceived = new EventEmitter<any>();

  public connect(serverSig: string | null): void {
    if (!this.socket$ || this.socket$.closed) {
      const wsUrl = `wss://${AppConsts.remoteServiceBaseUrl.replace('https://', '').replace('http://', '')}/qr/ws?Authorization=${serverSig}`;
      this.socket$ = webSocket(wsUrl);
      // this.socket$ = webSocket('wss://qrscanner.serviceendpoints.co.za/qr/ws?Authorization=d17e859084231d9abe2af3c888e00a13');

      this.socket$.subscribe((data: any) => {
        this.receivedData.push(data);

        this.messageReceived.emit(data);
      });
      this.socket$.next({ data: 'test' });
    }
  }

  sendMessage(message: any) {
    this.socket$.next(message);
  }

  close() {
    this.socket$.complete();
  }
}
