import { Customer } from './customers';

export interface Transaction {
    id?: number,
    sender: Customer,
    receiver: Customer,
    amount: number,
    type: string,
    time?: string,
}