import BaseRepository from '../repository';
import UnitOfMeasurementModel from '../../models/UnitOfMeasurement';
import UnitOfMeasurement, { UnitOfMeasurementDoc } from '../../types/unitofmeasurement';
import {dateStringTranslate} from '../../utils/misc';

export default class UnitOfMeasurementRepository extends BaseRepository<UnitOfMeasurement, UnitOfMeasurementDoc> {
  constructor() {
    super(UnitOfMeasurementModel);
  }

  async findAll() {
    return UnitOfMeasurementModel.find();
  }

  async create(UnitData: UnitOfMeasurement) {
    UnitData.updatedAt = dateStringTranslate(new Date(UnitData.updatedAt));
    if(UnitData.createdAt){UnitData.createdAt = new Date(UnitData.createdAt).toLocaleString();}
    return UnitOfMeasurementModel.create(UnitData);
  }

  async update(id: string, UnitData: UnitOfMeasurement) {
    UnitData.updatedAt = dateStringTranslate(new Date(UnitData.updatedAt));
    // @ts-ignore
    return UnitOfMeasurementModel.findByIdAndUpdate(id, UnitData)
  }

  async findByUnit(unit: string) {
    return UnitOfMeasurementModel.findOne({ unit })
  }
}
