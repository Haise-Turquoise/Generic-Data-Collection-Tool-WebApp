import { ObjectId } from 'mongoose';
import { MasterValueDoc } from '../../types/mastervalue';

export default class MasterValueEntity {
  public submission: MasterValueDoc['submission'];
  public reportingPeriod: string;
  public program: MasterValueDoc['program'];
  public org: MasterValueDoc['org'];
  public templateType: MasterValueDoc['templateType'];
  public template: string;
  public COATreeId: ObjectId;
  public categoryId: string;
  public attributeId: string;
  public value: number;
  
  constructor({
    submission,
    reportingPeriod,
    program,
    org,
    templateType,
    template,
    COATreeId,
    categoryId,
    attributeId,
    value,
  }: MasterValueDoc) {
    this.submission = submission;
    this.reportingPeriod = reportingPeriod;
    this.program = program;
    this.org = org;
    this.templateType = templateType;
    this.template = template;
    this.COATreeId = COATreeId;
    this.categoryId = categoryId;
    this.attributeId = attributeId;
    this.value = value;
  }
}
