export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
  }

  export class UserConstants {
    public static readonly ROLES  = [
      {value: 'U', viewValue: 'User'},
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

    public static readonly STATUS = [
      {value: '0', viewValue: 'Active'},
      {value: '1', viewValue: 'Inactive'},
      {value: '2', viewValue: 'Disabled'}
    ];
    public static readonly USER_TYPES = [
      {value: 'S', viewValue: 'System User'},
      {value: 'G', viewValue: 'Google User'},
      {value: 'F', viewValue: 'Facebook User'},
      {value: 'T', viewValue: 'Twitter user'},
      {value: 'P', viewValue: 'Public User'}
    ];
  }

  export interface Official{
    designation: string,
    role: string
    }
