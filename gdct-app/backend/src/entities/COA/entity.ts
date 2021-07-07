import Category, { CategoryDoc } from '../../types/category';

export default class COAEntity {
  public _id: string;
  public id: string;
  public name: string;
  public COA: string;
  public timestamp: Date;
  public updatedBy: string;
  public unitOfMeasure: string;

  constructor({ _id, id, name, COA, timestamp, updatedBy, unitOfMeasure }: CategoryDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.COA = COA;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.unitOfMeasure = unitOfMeasure;
  }
}
