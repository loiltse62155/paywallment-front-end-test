import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  apiUrl = environment.apiUrl;
  countryCodeUrl = environment.countryUrl;
  currentCountry = environment.currentCountry;
  constructor(
    private http: HttpClient
  ) { }
  getPaymentMethod(projectKey, privateKey, country_code) {
    return this.http.get(`${this.apiUrl}?key=${projectKey}&country_code=${country_code}&sign_version=2&sign=${privateKey}`);
  }
  getCountryCode(){
    return this.http.get(this.countryCodeUrl);
  }
  getCurrentCountry(){
    return this.http.get(this.currentCountry);
    
  }

}
