import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Customer } from './customer.interface';
import { CustomerService } from './customer.service';

@Component({
	selector: 'app-customer',
	templateUrl: './customer.component.html',
	styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {

	customers: Customer[];

	constructor(
		public customerService: CustomerService,
	) {
		this.customerService.getAll().pipe(
			tap(customers => {
				this.customers = customers;
			})
		).subscribe();
	}
}
