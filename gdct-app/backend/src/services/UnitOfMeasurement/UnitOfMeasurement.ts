import Container from 'typedi';
import UnitOfMeasurementRepository from '../../repositories/UnitOfMeasurement';
import UnitOfMeasurement from '../../types/unitofmeasurement';
import ObjectId from 'mongodb'

// @Service()
export default class AuditLogService {
  private UnitOfMeasurementRepository: UnitOfMeasurementRepository;

  constructor() {
    this.UnitOfMeasurementRepository = Container.get(UnitOfMeasurementRepository);
  }

  async findAllUnits() {
    return this.UnitOfMeasurementRepository.findAll();
  }

  async createUnit(UnitData: UnitOfMeasurement) {
    return this.UnitOfMeasurementRepository.create(UnitData);
  }

  async updateUnit(UnitData: UnitOfMeasurement) {
    if (!UnitData._id) {
      return null
    }
    return this.UnitOfMeasurementRepository.update(UnitData._id!.toString(), UnitData)
  }

  async findByUnit(unit: string) {
    return this.UnitOfMeasurementRepository.findByUnit(unit)
  }

  async delete(id: string) {
    return this.UnitOfMeasurementRepository.delete(id)
  }
}
