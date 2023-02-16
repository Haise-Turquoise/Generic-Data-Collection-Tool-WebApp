import { Schema, model } from 'mongoose';
import UnitOfMeasurement, { UnitOfMeasurementDoc } from '../../types/unitofmeasurement';

const Unit = new Schema<UnitOfMeasurementDoc>(
  {
    unitOfMeasurement: { type: String, required: true, index: true, unique: true },
    dataType: { type: String, required: true },
    note: { type: String, required: false },
    pattern: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
    updatedBy: { type: String },
  },
  { minimize: false, timestamps: true },
)

const UnitModel = model<UnitOfMeasurementDoc>('UnitOfMeasurement', Unit, 'UnitOfMeasurement');

export default UnitModel;
