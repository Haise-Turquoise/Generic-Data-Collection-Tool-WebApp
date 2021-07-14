import { Document } from 'mongoose';

export default interface OrganizationGroup {
  id: string;
  name: string;
  isActive: boolean;
}

export interface OrganizationGroupDoc extends OrganizationGroup, Document {
  id: string;
}
