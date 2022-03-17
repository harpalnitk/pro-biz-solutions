export interface DiscountHistory {
    id?:string;
    action:string;
    value?: number;
    date: Date;
    userId: string;
    userName: string;
}