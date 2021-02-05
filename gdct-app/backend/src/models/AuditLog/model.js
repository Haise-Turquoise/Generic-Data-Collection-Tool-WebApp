import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const AuditLogModel = model(
    'AuditLog',
    new Schema(
        {
            user: {type: Object},
            activity: {type: String},
            moduleName: {type: String},
            recordId: {type: ObjectId},
            oldValue: {type: Object},
            newValue: {type: Object},
            timestamp: {type: Date, default: Date.now},
        },
        {
            minimize: false
        },
    ),
    'AuditLog',
);

export default AuditLogModel;
