import { Document, ObjectId } from 'mongoose';
export default interface MasterValue {
  _id: string,
  submission: {
    _id: ObjectId,
    name: string,
  },
  reportingPeriod: string,
  program: {
    _id: ObjectId,
    name: string,
  },
  org: {
    id: number,
    name: string,
  },
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

export interface MasterValueDoc extends Document {
  submission: {
    _id: ObjectId,
    name: string,
  },
  reportingPeriod: string,
  program: {
    _id: ObjectId,
    name: string,
  },
  org: {
    id: number,
    name: string,
  },
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
