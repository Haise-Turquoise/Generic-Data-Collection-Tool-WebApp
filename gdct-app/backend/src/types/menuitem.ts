import { Document } from 'mongoose';

export default interface MenuItem {
  name: string;
  url: string;
  description: string;
  role: string[];
  type: string;
  isActive: boolean;
  orderId: number;
}

export interface MenuItemDoc extends MenuItem, Document {}
