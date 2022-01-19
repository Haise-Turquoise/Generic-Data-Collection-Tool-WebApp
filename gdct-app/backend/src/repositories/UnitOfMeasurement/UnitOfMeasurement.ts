import BaseRepository from '../repository';
import UnitOfMeasurementModel from '../../models/UnitOfMeasurement';
import UnitOfMeasurement, { UnitOfMeasurementDoc } from '../../types/unitofmeasurement'

export default class UnitOfMeasurementRepository extends BaseRepository<UnitOfMeasurement, UnitOfMeasurementDoc> {
  constructor() {
    super(UnitOfMeasurementModel);
  }

  async findAll() {
    return UnitOfMeasurementModel.find();
  }

  async create(UnitData: UnitOfMeasurement) {
    return UnitOfMeasurementModel.create(UnitData);
  }

  async update(id: string, UnitData: UnitOfMeasurement) {
    return UnitOfMeasurementModel.findByIdAndUpdate(id, UnitData)
  }

  async findByUnit(unit: string) {
    return UnitOfMeasurementModel.findOne({ unit })
  }
}
