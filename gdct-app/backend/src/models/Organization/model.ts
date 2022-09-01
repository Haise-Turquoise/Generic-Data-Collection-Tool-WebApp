import { Schema, model } from 'mongoose';
import { OrganizationDoc } from '../../types/organization';
const { ObjectId } = Schema.Types;

const OrgModel = model<OrganizationDoc>(
  'Organization',
  new Schema<OrganizationDoc>(
    {
      id: { type: Number, required: true, min: 0 },
      IFISNum: { type: String, required: true, unique: true },
      code: { type: String, default: '' },
      name: { type: String, required: true },
      legalName: { type: String, default: '' },
      address: { type: String, default: '' },
      province: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      location: [{ type: String, default: '' }],

      organizationGroupId: [{ type: ObjectId, ref: 'OrganizationGroup' }],

      active: { type: Boolean, default: true },

      managerUserIds: [{ type: ObjectId, ref: 'User' }],
      contactUserId: { type: String, ref: 'User' },
      authorizedUserId: { type: String, ref: 'User' },

      programId: [{ type: ObjectId, ref: 'Program' }],

      effectiveDate: { type: String, required: true },
      expiryDate: { type: String, default: null },

      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'Organization',
);

export default OrgModel;
