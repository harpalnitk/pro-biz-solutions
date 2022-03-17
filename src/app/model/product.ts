export interface Product {
    id?:string;
    name:string;
    type: string;
    subType:string;
    make:string;
    desc?:string;
    discountId?: string;
    price:number;
    photoURL?:string;

    count:number;
    createdOn: Date;
    createdBy: string;
    updatedOn?: Date;
    updatedBy?: string;

    typeView?: string;
    subTypeView?:string;
    makeView?:string;
    discountValue?:number;
    discountDesc?:string;

}