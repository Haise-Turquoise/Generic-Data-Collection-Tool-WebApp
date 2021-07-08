import { Schema, model, Model, CallbackError } from 'mongoose';
import { OrganizationGroupDoc } from '../../types/organizationgroup';

const OrgSchema = new Schema<OrganizationGroupDoc>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
)

OrgSchema.pre(/^find/, function (this: Model<OrganizationGroupDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const OrgGroupModel = model<OrganizationGroupDoc>('OrganizationGroup', OrgSchema, 'OrganizationGroup');

export default OrgGroupModel;
