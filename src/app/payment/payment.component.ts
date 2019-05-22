import { Component, OnInit } from '@angular/core';
import { PaymentServiceService } from '../service/payment-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Navigation } from 'selenium-webdriver';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  projectKey = environment.projectKey;
  privateKey = environment.privateKey;
  countryCode: string;
  paymendMethod: paymentMethodObject[];
  price: number;
  currencyUnit: string;
  cardNumber: number;
  data: formObject;
  countryList: any[] = [];
  selectedCountry: any;
  currentCountry: any;
  constructor(
    private service: PaymentServiceService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.spinner.show();
    // this.countryCode = "VN";
    this.initData();

  }

  initData() {
    this.price = 345;
    this.currencyUnit = "US$"
    this.getCountryList();

  }
  getCountryList() {
    this.service.getCountryCode().subscribe(
      (data: any) => {
        this.countryList = data;
        console.log(data);
        this.getCurrentCountry();
      }
    )
  }
  getCurrentCountry() {
    this.service.getCurrentCountry().subscribe(
      (data: any) => {
        console.log(data);
        this.countryCode = data.country_code;
        this.selectedCountry = this.countryList.filter(item => {
          return item['alpha2Code'] == this.countryCode;
        })[0];
        console.log(this.selectedCountry);
        this.getData();

      }
    )
  }
  checkCreditCard(value) {
    console.log(this.checkValidCardNumber(value));
  }
  checkValidCardNumber(value: string) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
        nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0;
  }
  getData() {
    this.spinner.show();
    if (this.selectedCountry)
      this.countryCode = this.selectedCountry['alpha2Code']
    this.service.getPaymentMethod(this.projectKey, this.privateKey,  this.countryCode).subscribe(
      (data: paymentMethodObject[]) => {
        this.spinner.hide();
        this.paymendMethod = data;
        console.log(this.paymendMethod);

      },
      err => {
        this.spinner.hide();
        this.paymendMethod = [];
        console.log(err)
      }
    )
  }
  payment(form: NgForm) {
    console.log(form)
  }
}


export class paymentMethodObject {
  id?: string = '';
  img_class?: string = '';
  img_url?: string = '';
  name?: string = '';
  new_window?: boolean = true;
  ps_type_id?: number = 0;
}
export class formObject {
  cardName?: string = '';
  cardNumber?: number = 0;
  cardMon?: number = 0;
  cardYear?: number = 0;
  cardCVV?: number = 0;
}
