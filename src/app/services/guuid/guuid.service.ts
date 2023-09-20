import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BasicResponse, QRUserDataResponse, QrServiceProxy, QuoteDetails } from '@shared/service-proxies/service-proxies';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class GuuidService {

  constructor(
    private qrService: QrServiceProxy
  ) { }

  // checkGuuid(guuid: string): Observable<BasicResponse> {
  //   return new Observable<BasicResponse>(observer => {
  //     if (guuid === '123456') {
  //       observer.next(new BasicResponse({ code: 200, message: "Good" }));
  //     } else {
  //       observer.next(new BasicResponse({ code: 400, message: "Bad" }));
  //     }
  //   });
  // }

  getVerificationDetails(guuid: string): Observable<QRUserDataResponse> {
    return this.qrService.getVerificationDetails(guuid);
  }

  verifyCode(guuid: string): Observable<BasicResponse> {
    return this.qrService.verifyQrCode(guuid);
  }

  getVerificationDetailsTest(guuid: string): Observable<QRUserDataResponse> {
    return of(new QRUserDataResponse({
      code: 200,
      details: new QuoteDetails({
        quoteId: '12345',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.email',
        mobile: '1234567890',
        uuid: uuid(),
        active: true,
        createdAt: 12356789,
        verifiedAt: 0,
        agentId: '12345'
      })
    }));
  }

  verifyCodeTest(guuid: string): Observable<BasicResponse> {
    return new Observable<BasicResponse>(observer => {
      if (guuid === '123456') {
        observer.next(new BasicResponse({ code: 200, message: "Good" }));
      } else {
        observer.next(new BasicResponse({ code: 400, message: "Bad" }));
      }
    });
  }
}
