import { SvgIconProps } from "@material-ui/core";
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

export interface MappedMenu {
    name: string,
    url: string,
    type: string,
    icon: React.ReactElement<SvgIconProps>,
    orderId: number,
}

export interface SubmissionStatus {
    _id: {
      submissionPeriod: string, 
      name: string,
    };
    countSubmitted : number;
    countUnsubmitted: number;
  
}