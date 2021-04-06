import { IMessage, IService } from './../service.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer } from './customer.interface';


@Injectable({
	providedIn: 'root'
})

export class CustomerService implements IService {

	headers = new HttpHeaders({ 'api-key': '9128790b81b605584ce1' });
	apiEndpoint = "https://graycrayon-api.herokuapp.com/";

	constructor(
		private http: HttpClient
	) {
		this.headers.append('accept', 'application/json');
		this.headers.append('Access-Control-Allow-Origin', '*');
		this.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
	}

	getAll(): Observable<Customer[]> {
		return this.http.get<Customer[]>(this.apiEndpoint + "getAllCustomers", { headers: this.headers });
	}

	get(id: string): Observable<Customer> {
		return this.http.get<Customer>(this.apiEndpoint + "getCustomer/" + id, { headers: this.headers });
	}

	create(item: Customer): Observable<IMessage> {
		return this.http.post<IMessage>(this.apiEndpoint + "createCustomer", item, { headers: this.headers });
	}

	delete(id: string): Observable<IMessage> {
		return this.http.delete<IMessage>(this.apiEndpoint + "deleteCustomer/" + id, { headers: this.headers });
	}

	update(item: Customer, id: string): Observable<IMessage> {
		return this.http.put<IMessage>(this.apiEndpoint + "modifyCustomer/" + id, item, { headers: this.headers });
	}

	getConversion(): Observable<number> {
		return of(1);
	}

}
function _notImplemented(): void {
	throw new Error('Function not implemented.');
}

