import { ObjectId } from 'mongodb';

export default interface Menu {
  name: string;
  items: ObjectId[];
  isSubMenu: boolean;
  subMenus: ObjectId[];
  type: string;
  isActive: boolean;
  orderId: number;
  url: string;
}

export interface MenuDoc extends Menu, Document {}
