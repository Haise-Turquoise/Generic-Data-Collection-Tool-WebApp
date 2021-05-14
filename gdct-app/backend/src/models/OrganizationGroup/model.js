import { Schema, model } from 'mongoose';

const OrgSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
)

OrgSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const OrgGroupModel = model('OrganizationGroup', OrgSchema, 'OrganizationGroup');

export default OrgGroupModel;
