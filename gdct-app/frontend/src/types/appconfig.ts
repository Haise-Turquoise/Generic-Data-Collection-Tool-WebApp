export default interface AppConfig {
  _id: string;
  key: string;
  value: string;
  appSys: string;
  sys: string;
  isActive?: boolean;
  updatedAt: string;
  updatedBy: string;
}
