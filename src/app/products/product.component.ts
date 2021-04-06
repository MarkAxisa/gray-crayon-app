import { Component } from '@angular/core';
import { Product } from './product.interface';
import { ProductService } from './product.service';
import { filter, take, tap } from 'rxjs/operators';
import { ConversionService } from './conversion.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent {

	products: Product[];
	conversions = [
		{
			text: "CAD",
			value: "cad"
		},
		{
			text: "USD",
			value: "usd"
		},
		{
			text: "GBP",
			value: "gbp"
		},
		{
			text: "EUR",
			value: "eur"
		},
	]

	constructor(
		public conversionService: ConversionService,
		private productService: ProductService,
	) {
		this.productService.getAll().pipe(
			filter(products => !!products),
			take(1),
			tap(products => {
				this.products = products;
			})
		).subscribe();
	}
}
