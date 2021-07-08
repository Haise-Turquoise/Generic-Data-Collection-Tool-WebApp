import { Schema, model } from 'mongoose';
import { OrganizationGroupDoc } from '../../types/organizationgroup';

const OrgSchema = new Schema<OrganizationGroupDoc>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
)

OrgSchema.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const OrgGroupModel = model<OrganizationGroupDoc>('OrganizationGroup', OrgSchema, 'OrganizationGroup');

export default OrgGroupModel;
