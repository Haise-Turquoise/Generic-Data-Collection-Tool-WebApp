import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const AuditLogModel = model(
    'AuditLog',
    new Schema(
        {
            _id: {type: ObjectId},
            user: {type: Object},
            activity: {type: String},
            module: {type: Object},
            timestamp: {type: Date, default: Date.now},
        },
        { 
            minimize: false 
        },
    ),
    'AuditLog',
);

export default AuditLogModel;
