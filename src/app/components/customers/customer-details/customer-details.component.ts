import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  imageUrl: any = 'assets/img/cube.png';
  companyName = '';
  message = 'Hola Mundo!';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ){ }

  ngOnInit() {
    this.loadCustomer();
  }

  customProfile(): boolean {
    const pth = this.route.snapshot.routeConfig.path;
    if (pth === 'profile/:id') {
      return false;
    } else {
      return true;
    }
  }

  loadCustomer() {
    const cusId = this.route.snapshot.params.id;
    this.customerService.get_customer(cusId).subscribe(( res: any) => {
      this.imageUrl = res.picture;
      this.companyName = res.company_name;
    });
  }

  uploadFile(file: FileList) {
    if (file.length > 0) {
      const img = file.item(0);
      const cusId = this.route.snapshot.params.id;
      this.customerService.put_customerPicture(img, cusId).subscribe((res) => {
        this.loadCustomer();
      });
    }
  }
  updateProfile() {
    const cusId = this.route.snapshot.params.id;
    this.router.navigate(['customer/profile', cusId]);
  }
}
