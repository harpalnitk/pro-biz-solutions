import { User } from "./user";

  
  export interface Contact{
    phones: string[];
  
  }
  export interface UserProfile extends User{
    firstName?: string;
    lastName?: string;
    gender?: string;
    about?: string;
    userType: 'S' | 'P' ;
    address?: string;
    contact?: Contact;
    updatedOn?: Date;
    updatedBy?: string;
    status: 'A' | 'I' | 'D';
  }

  export interface AdminProfile extends UserProfile{
    official?: Official;
    viewRole?: string;
    viewStatus?: string;
    viewUserType?: string;
  }

  export interface Official{
    designation: string,
    role: string
    }
  
export class ProfileConstants{
  public static readonly GENDERS = [
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
    {value: 'O', viewValue: 'Other'}
  ];
  public static readonly USER_TYPES = [
    {value: 'S', viewValue: 'System User'},
    {value: 'P', viewValue: 'Public User'},
  ];
  public static readonly USER_STATUS = [
    {value: 'A', viewValue: 'Active'},
    {value: 'I', viewValue: 'Inactive'},
    {value: 'D', viewValue: 'Disabled'},
  ];
  public static readonly USER_ROLES  = [
    // {value: 'U', viewValue: 'User'},
    {value: 'A', viewValue: 'Associate'},
    // 'E' CAN EDIT CONTENT
    {value: 'E', viewValue: 'Content Editor'},
    {value: 'M', viewValue: 'Manager'},
    {value: 'S', viewValue: 'Sr. manager'},
    // 'M' AND 'S' CAN  SEE USERS LIST AND EDIT CONTENT
    {value: 'D', viewValue: 'Admin'},
    {value: 'Y', viewValue: 'System Admin'}
    // ONLY 'D' AND 'Y' CAN ADD, EDIT, DELETE USERS AND SEE USERS LIST; THEY CAN ALSO EDIT CONTENT
  ];
}