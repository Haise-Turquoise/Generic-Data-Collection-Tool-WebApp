import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

export default interface UnitOfMeasurement {
    _id?: ObjectId,
    note?: string,
    unitOfMeasurement: string,
    dataType: string,
    pattern: string,
    createdAt: string,
    updatedBy: string,
    updatedAt: string ,
}

export interface UnitOfMeasurementDoc extends UnitOfMeasurement, Document {
    _id: ObjectId
}