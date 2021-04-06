import { IMessage, IService } from './../service.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.interface';


@Injectable({
	providedIn: 'root'
})

export class ProductService implements IService {

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

	getAll(): Observable<Product[]> {
		return this.http.get<Product[]>(this.apiEndpoint + "getAllProducts", { headers: this.headers });
	}

	get(id: string): Observable<Product> {
		return this.http.get<Product>(this.apiEndpoint + "getProduct/" + id, { headers: this.headers });
	}

	create(item: Product): Observable<IMessage> {
		return this.http.post<IMessage>(this.apiEndpoint + "createProduct", item, { headers: this.headers });
	}

	delete(id: string): Observable<IMessage> {
		return this.http.delete<IMessage>(this.apiEndpoint + "deleteProduct/" + id, { headers: this.headers });
	}

	update(item: Product, id: string): Observable<IMessage> {
		return this.http.put<IMessage>(this.apiEndpoint + "modifyProduct/" + id, item, { headers: this.headers });
	}
}
