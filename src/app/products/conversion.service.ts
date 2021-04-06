import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyRate } from './product.interface';


@Injectable({
	providedIn: 'root'
})

export class ConversionService {

	headers = new HttpHeaders({ 'api-key': '9128790b81b605584ce1' });
	apiEndpoint = "https://graycrayon-api.herokuapp.com/";
	currentCurrency: string;
	conversionSubject = new BehaviorSubject("EUR");

	constructor(
		private http: HttpClient
	) {
		this.headers.append('accept', 'application/json');
		this.headers.append('Access-Control-Allow-Origin', '*');
		this.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

		this.currentCurrency = localStorage.getItem("currency");
		this.conversionSubject.next(this.currentCurrency.toUpperCase());
	}

	getConversion(): Observable<CurrencyRate> {
		return this.http.get<CurrencyRate>(this.apiEndpoint + "getConversion", { headers: this.headers });
	}

	switchCurrency(currency: string) {
		this.currentCurrency = currency;
		localStorage.setItem("currency", currency);
		this.conversionSubject.next(currency.toUpperCase());
	}
}
