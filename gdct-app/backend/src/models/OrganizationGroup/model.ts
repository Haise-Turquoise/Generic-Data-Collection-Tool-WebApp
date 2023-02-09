import { Schema, model, Model, CallbackError } from 'mongoose';
import { OrganizationGroupDoc } from '../../types/organizationgroup';

const OrgGroup = new Schema<OrganizationGroupDoc>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    isActive: { type: Boolean },
    updatedAt: { type: String },
    updatedBy: { type: String },
    createdBy: { type: String }
  },
  { minimize: false },
)

// OrgGroup.pre(/^find/, function (this: Model<OrganizationGroupDoc>, next: (err: CallbackError) => void) {
//   this.find({ isActive: { $ne: false } });
//   next(null);
// });

const OrgGroupModel = model<OrganizationGroupDoc>('OrganizationGroup', OrgGroup, 'OrganizationGroup');

export default OrgGroupModel;
 