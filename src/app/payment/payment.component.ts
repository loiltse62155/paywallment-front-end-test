import { Component, OnInit } from '@angular/core';
import { PaymentServiceService } from '../service/payment-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  countryList: any[];
  selectedCountry: any;
  currentCountry: any;
  selectedMethod: string;
  paymentForm: FormGroup;
  error = { errorDate: "", errorCardNumber: "", errorCVV:"" };
  constructor(
    private service: PaymentServiceService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }
  ngOnInit() {
    this.spinner.show();
    this.initData();
  }
  initData() {
    this.price = 345;
    this.currencyUnit = "US$";
    this.selectedMethod = "";
    this.countryList = [];
    this.getCountryList();
    this.paymentForm = new FormGroup({
      cardName: new FormControl(),
      cardNumber: new FormControl(),
      cardMonth: new FormControl(),
      cardYear: new FormControl(),
      cardCVV: new FormControl
    });
  }
  getCountryList() {
    this.service.getCountryCode().subscribe(
      (data: any) => {
        this.countryList = data;
        this.getCurrentCountry();
      }
    )
  }
  createForm() {
    this.paymentForm = this.formBuilder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardMonth: ['', Validators.required],
      cardYear: ['', Validators.required],
      cardCVV: ['', Validators.required],
    });
  }
  getCurrentCountry() {
    this.service.getCurrentCountry().subscribe(
      (data: any) => {
        this.countryCode = data.country_code;
        this.selectedCountry = this.countryList.filter(item => {
          return item['alpha2Code'] == this.countryCode;
        })[0];
        this.getData();
      }
    )
  }
  checkCreditCard(value) {
    this.resetNoti();
    if (!this.checkValidCardNumber(value)) {
      this.error.errorCardNumber = "Please enter a 16-digit valid number";
    }
  }
  checkValidCardNumber(value: string) {
    let arr = (value + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
  }
  getData() {
    this.spinner.show();
    if (this.selectedCountry)
      this.countryCode = this.selectedCountry['alpha2Code']
    this.service.getPaymentMethod(this.projectKey, this.privateKey, this.countryCode).subscribe(
      (data: paymentMethodObject[]) => {
        this.spinner.hide();
        this.paymendMethod = data;

      },
      err => {
        this.spinner.hide();
        this.paymendMethod = [];
      }
    )
  }
  resetNoti() {
    this.error = { errorDate: "", errorCardNumber: "", errorCVV:"" };
  }
  payment() {
    let temp = this.paymentForm.value;
    let today = new Date();
    let mm = (String(today.getMonth() + 1).padStart(2, '0') as any) * 1;
    let yy = (today.getFullYear().toString().substr(-2) as any) * 1;
    this.resetNoti();
    if (temp.cardMonth * 1 < 1 || temp.cardMonth * 1 > 12 || (temp.cardMonth * 1 < mm && temp.cardYear*1 == yy) || temp.cardYear * 1 < yy) {
      this.error.errorDate = "Please enter a valid date";
      return;
    }
    if (temp.cardNumber.length < 16 && this.checkValidCardNumber(temp.cardNumber) == false) {
      this.error.errorCardNumber = "Please enter a 16-digit valid number";
      return;
    }
    if (temp.cardCVV.length < 3 ) {
      this.error.errorCVV = "Please enter a valid CVV";
      return;
    }
    this.router.navigate(["/success"]);
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

