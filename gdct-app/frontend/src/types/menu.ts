
import MenuItem from "./menuitems";
export default interface Menu{
    items:MenuItem[];
    isSubMenu:boolean;
    type:string;
    isActive:boolean;
    name:string;
    createAt:Date;
    updateAt:Date;
    orderId:number;
    url:string;
    subMenus:this[];
}