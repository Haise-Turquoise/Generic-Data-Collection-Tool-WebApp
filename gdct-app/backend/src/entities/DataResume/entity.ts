import { DataResumeDoc } from "../../types/dataresume";

export default class DataResumeEntity {
  public resumeArray: any[];
  public currentCount: number;
  public totalCount: number;

  constructor({
    resumeArray,
    currentCount,
    totalCount,
  }: DataResumeDoc) {
    this.resumeArray = resumeArray;
    this.currentCount = currentCount;
    this.totalCount = totalCount;
  }
}