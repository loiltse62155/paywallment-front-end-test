import { Component, OnInit } from '@angular/core';
import { PaymentServiceService } from '../service/payment-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(
    private service: PaymentServiceService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.spinner.show();
  }

  getData() {
    this.spinner.show();
    this.service.getPaymentMethod().subscribe(
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
