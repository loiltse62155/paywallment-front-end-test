import { Component, OnInit } from '@angular/core';
import { PaymentServiceService } from '../service/payment-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  projectKey = environment.projectKey;
  privateKey = environment.privateKey;
  countryCode:string;
  constructor(
    private service: PaymentServiceService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.spinner.show();
    this.countryCode = "VN";
  }

  getData() {
    this.spinner.show();
    this.service.getPaymentMethod(this.projectKey, this.privateKey, this.countryCode).subscribe(
      (data: any) => {
        console.log(data);
        this.spinner.hide();

      },
      err => {
        console.log(err)
      }
    )
  }

}
