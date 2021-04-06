import { Product } from './../products/product.interface';
import { IService } from './../service.interface';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from './../products/product.service';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap, take } from 'rxjs/operators';
import { Customer } from '../customer/customer.interface';
import { ConversionService } from '../products/conversion.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	providers: [CustomerService, ProductService]

})
export class TableComponent implements OnInit {

	@Input() items: any[];
	@Input() type: "ProductService" | "CustomerService";

	itemKeys: string[];
	errorList = {};
	addingMode: boolean;
	editingMode: boolean;

	currentExhangeRate: number;
	currencySymbol: string;

	selectedRecord: Product | Customer;

	service: IService;

	itemForm = new FormGroup({});

	constructor(
		private injector: Injector,
		public conversionService: ConversionService
	) { }

	ngOnInit(): void {
		this.itemKeys = Object.keys(this.items[0]);
		this.itemKeys.splice(0, 1);

		if (this.type === "ProductService") {
			this.service = this.injector.get(ProductService);
			this.conversionService.conversionSubject.pipe(
				tap(currencySymbol => this.currencySymbol = currencySymbol),
				switchMap(() => this.conversionService.getConversion()),
				tap((exchangeRate) => {
					this.currentExhangeRate = this.conversionService.currentCurrency !== "EUR"
						? exchangeRate[this.conversionService.currentCurrency]
						: 1;
				})
			).subscribe();
		}

		if (this.type === "CustomerService") {
			this.service = this.injector.get(CustomerService)
		}
	}

	toggleAddForm(): void {
		this.addingMode = !this.addingMode;
		this.errorList = [];
		if (this.addingMode) {
			this.itemKeys.forEach((key) => {
				this.itemForm.controls[key].setValue(null);
				this.itemForm.markAsPristine();
			})
		}
	}

	toggleEditForm(): void {
		this.editingMode = !this.editingMode;
		this.errorList = [];
	}

	addItem(): void {
		if (this.itemForm.valid) {
			this.service.create(this.itemForm.value).pipe(
				switchMap(() => this.service.getAll()),
				tap((items) => {
					this.items = items;
				})
			).subscribe();
		}
	}

	selectRecord(id: string): void {
		this.errorList = [];
		this.service.get(id).pipe(
			tap(item => {
				this.selectedRecord = item;
				this.editingMode = true;
				this.addingMode = false;
				this.itemKeys.forEach((key) => {
					this.itemForm.controls[key]?.setValue(this.selectedRecord[key]);
				})
			})
		).subscribe();
	}

	deleteItem(id: string) {
		this.service.delete(id).pipe(
			filter(isDeleted => !!isDeleted),
			switchMap(() => this.service.getAll()),
			tap((items) => {
				this.items = items
			})
		).subscribe();
	}

	createFormField(key: string): string {
		let type;
		let validators;
		let fieldExists = this.itemForm.controls[key];
		const formControl = new FormControl();

		if (key == "cost") {
			validators = [Validators.required, Validators.min(0.1)];
			type = "currency";
		}
		if (typeof (this.items[0][key]) === "string") {
			validators = [Validators.required, Validators.minLength(3)];
			type = "text";
		} else {
			validators = [Validators.required, Validators.min(1)];
			type = "number";
		}

		formControl.setValidators(validators);
		this.itemForm.addControl(key, formControl);
		if (!fieldExists && this.editingMode) {
			this.itemForm.controls[key].setValue(this.selectedRecord[key]);
		}
		return type;
	}

	updateRecord() {
		if (this.itemForm.valid) {
			this.service.update(this.itemForm.value, this.selectedRecord.id).pipe(
				switchMap(() => this.service.getAll()),
				tap((items) => {
					this.items = items;
					this.editingMode = false;
				})
			).subscribe();
		}
	}

	fetchErrors(key: string): void {
		delete this.errorList[key];
		if (this.itemForm.controls[key].errors) {
			Object.keys(this.itemForm.controls[key].errors).forEach(error => {
				switch (error) {
					case "minlength":
						this.errorList[key] = "The minimum length for the '" + key + "' field is " + this.itemForm.get(key).errors[error]["requiredLength"];
						break;
					case "required":
						this.errorList[key] = "The '" + key + "' field is required";
						break;
					case "min":
						this.errorList[key] = "The lowest allowed value for the '" + key + "' field is " + this.itemForm.get(key).errors[error]["min"];
						break;
					default:
						break;
				}
			});
		}
	}

}
