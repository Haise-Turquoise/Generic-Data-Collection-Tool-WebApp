export default interface UserPermission {
    organization:{id:number, name:string, authorizedPerson:{name:string, email:string}};
    program:{name:string, code:string, _id:string};
    submission:{name:string, _id:string};
    permission:string;
    approve:boolean;
    review:boolean;
    submit:boolean;
    view:boolean;
    viewCognos:boolean;
    input:boolean;
    status:string;
}