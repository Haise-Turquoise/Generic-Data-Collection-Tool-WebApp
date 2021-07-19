import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export default interface MasterValue {
  _id: ObjectId,
  submission: {
    _id: ObjectId,
    name: string,
  },
  reportingPeriod: string,
  program: {
    _id: ObjectId,
    name: string,
  },
  org: MasterValueOrg,
  templateType: {
    _id: ObjectId,
    name: string,
  },
  template: string,
  COATreeId: ObjectId,
  categoryId: string,
  attributeId: string,
  categoryGroup: string,
  categoryName: string,
  attributeName: string,
  value: number,
}

export interface MasterValueOrg{
  id: number,
  name: string,
}

export interface MasterValueDoc extends MasterValue, Document {
  _id: ObjectId
}
