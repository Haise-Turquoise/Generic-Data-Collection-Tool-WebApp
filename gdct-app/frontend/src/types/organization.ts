export default interface Organization {
  name: string;
  _id: string;
  id: number;
  effectiveDate: string;
  expiryDate?: null;
  IFISNum: string;
  province?: string;
  organizationGroupId: string[];
  programId: string[];
  authorizedPerson: string[];
  active?: boolean;
  address?: string;
  city?: string;
  code?: string;
  legalName?: string;
  location?: any[];
  manageUserIds?: string[];
  postalCode?: string;
  updatedBy: string;
}
