export interface Discount {
    id?: string;
    name:string;
    desc: string;
    value: number;
    createdOn: Date;
    createdBy: string;
    updatedOn?: Date;
    updatedBy?: string;
}