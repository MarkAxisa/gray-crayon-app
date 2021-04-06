export interface Product {
	id: string;
	type: string;
	description: string;
	manufacturer: string;
	cost: number;
	quantity: number;
}

export interface CurrencyRate {
	id: string;
	base: string;
	date: string;
	timestamp: number;
	cad: number;
	usd: number;
	gbp: number;
}