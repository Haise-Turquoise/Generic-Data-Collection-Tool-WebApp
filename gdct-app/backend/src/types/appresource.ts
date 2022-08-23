import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface AppResource {
  _id: ObjectId;
  id: number;
  resourceName: string;
  resourcePath: string;
  isProtected: 'TRUE' | 'FALSE' | 'true' | 'false';
  updatedAt: any;
  updatedBy: string;
}

export interface AppResourceDoc extends Document, AppResource {
  _id: ObjectId;
  id: number;
}
