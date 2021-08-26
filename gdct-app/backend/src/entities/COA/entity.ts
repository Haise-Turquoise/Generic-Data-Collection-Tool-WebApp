import { ObjectId } from 'mongodb';
import Category, { CategoryDoc } from '../../types/category';

export default class COAEntity {
  public _id: ObjectId;
  public id: string;
  public name: string;
  public COA: string;
  public updatedAt: Date;
  public updatedBy: string;
  public unitOfMeasure: string;

  constructor({ _id, id, name, COA, updatedAt, updatedBy, unitOfMeasure }: CategoryDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.COA = COA;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.unitOfMeasure = unitOfMeasure;
  }
}
