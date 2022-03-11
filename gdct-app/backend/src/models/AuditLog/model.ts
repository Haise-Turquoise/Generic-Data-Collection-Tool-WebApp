import { Schema, model } from 'mongoose';
import { AuditLogDoc } from '../../types/auditlog';
const { ObjectId } = Schema.Types;

const AuditLogModel = model<AuditLogDoc>(
    'AuditLog',
    new Schema<AuditLogDoc>(
        {
            user: {type: Object},
            activity: {type: String},
            moduleName: {type: String},
            recordId: {type: ObjectId},
            oldValue: {type: Object},
            newValue: {type: Object},
            updatedAt: {type: Date, default: Date.now},
        },
        {
            minimize: false
        },
    ),
    'AuditLog',
);

export default AuditLogModel;
