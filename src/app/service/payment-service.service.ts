import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor(
    private http: HttpClient
  ) { }
  getPaymentMethod() {
    return this.http.get("https://api.paymentwall.com/api/payment-systems/?key=f09ca3bf35e6900a672feadb12bc9aa7&country_code=VN&sign_version=2&sign=56358700c2a7940527056fd45d008fa9");
  }

}
