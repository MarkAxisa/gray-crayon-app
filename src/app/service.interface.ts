import { Observable } from 'rxjs';
import { Customer } from './customer/customer.interface';
import { Product } from './products/product.interface';

export interface IService {
	get(id: string): Observable<Product | Customer>;

	getAll(): Observable<Product[] | Customer[]>;

	create(item: Product | Customer): Observable<IMessage>;

	delete(id: string): Observable<IMessage>;

	update(item: Product | Customer, id: string): Observable<IMessage>;

}

export interface IMessage {
	[s: string]: boolean
}
