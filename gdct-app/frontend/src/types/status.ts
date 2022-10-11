export default interface Status {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  forPackage: boolean;
  order?: number;
  updatedAt: string;
  updatedBy: string;
}
