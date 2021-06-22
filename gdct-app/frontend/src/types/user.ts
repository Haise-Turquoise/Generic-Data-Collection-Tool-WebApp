export default interface User {
    _id?: string;
    hashedUsername?: string;
    title: string;
    ext: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isActive?: boolean;
    username: string;
    email: string;
    startDate?: Date;
    approvedDate?: Date;
    isEmailVerified? : boolean;
    creationDate?: Date;
    endDate?: Date;
    timestamp?: Date; 
    updatedBy?: String;
    sysRole?: any[];
    password?:string;
    pendingPermissions?:any[];
    toBeApproved?:any[];
    newPermissionPending?:boolean;
    tempSysRole?:any[];
    newTemplates?:any[];

  }