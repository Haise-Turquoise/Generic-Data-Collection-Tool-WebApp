import { Schema, model } from 'mongoose';
import { PurgeLogDoc } from '../../types/purgelog';
const { ObjectId } = Schema.Types;

const PurgeLogModel = model<PurgeLogDoc>(
    'PurgeLog',
    new Schema<PurgeLogDoc>(
        {
            user: {type: Object},
            numberArchived: {type: Number},
            numberDeleted: {type: Number},
            archiveMarkerDate: {type: Date},
            purgeDate: {type: Date, default: Date.now},
        },
        {
            minimize: false
        },
    ),
    'PurgeLog',
);

export default PurgeLogModel;