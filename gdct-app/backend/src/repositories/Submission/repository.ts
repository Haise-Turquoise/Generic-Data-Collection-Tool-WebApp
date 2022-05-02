import SubmissionEntity from '../../entities/Submission/Submission';
import BaseRepository from '../repository';
import SubmissionModel from '../../models/Submission';
import Submission, { SubmissionAggregated, SubmissionDoc } from '../../types/submission';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';
import UserSysRole from '../../types/usersysrole';

export default class SubmissionRepository extends BaseRepository<Submission, SubmissionDoc> {
  constructor() {
    super(SubmissionModel);
  }

  async delete(id: string) {
    return SubmissionModel.findByIdAndDelete(id)
    .then((submission: SubmissionDoc|null) =>{
      if (!submission) throw new AppError(`Delete failed, Item not found for submission item with ID: ${id}`);
      return new SubmissionEntity(submission)
    });
  }

  async create(submission: Submission) {
    return SubmissionModel.create(submission).then(
      submission => new SubmissionEntity(submission),
    );
  }

  async createMany(submissions: Submission[]) {
    return SubmissionModel.create(...submissions).then(res => res);
  }

  async update(id: string, submission: Partial<Submission>) {
    return SubmissionModel.findByIdAndUpdate(id, submission)
    .then((submission: SubmissionDoc|null) => {
      if (!submission) throw new AppError(`Update failed, Item not found for submission item with ID: ${id}`);
      return new SubmissionEntity(submission)
    }); 
  }

  async findByTemplatePackageId(templatePackageId: ObjectId) {
    return SubmissionModel.find({ templatePackageId });
  }

  async findByTemplatePackageIds(templatePackageIds: ObjectId[]) {
    return SubmissionModel.find({ templatePackageId: {$in:templatePackageIds}});
  }

  /**
   * Created by Sheldon Su 2021/05/13
   * This function uses mongoDB's pipeline feature to accelerate read and write speed, 
   * if the pipeline uses more than 100MB RAM during runtime, it will throw an error,
   * you will need to pass in param to increase the space allowed.
   * Check this link for more info:
   * https://docs.mongodb.com/manual/core/aggregation-pipeline-limits/
   * @param {Array<Number>} orgIds 
   * @param {Array<Object>} programIds 
   * @returns An array of objects
   */
  async fetchAllInfo(orgIds: number[], programIds: ObjectId[]){
    const aggratePipeLine = [
      {
        $match: { 
          orgId:{
            $in: orgIds
          }, 
          programId: {
            $in: programIds
          },
          isLatest:true
        }
      },

      // Join search from template package
      {
        $lookup:{
          from:'TemplatePackage',
          localField:'templatePackageId',
          foreignField:'_id',
          as:'templatePackage'
        }
      },
      // unwind package
      {
        $unwind: "$templatePackage"
      },
      // Join search with SubmissionPeriod collection
      {
        $lookup:{
          from:'SubmissionPeriod',
          localField:'submissionPeriodId',
          foreignField:'_id',
          as:'submissionPeriod'
        }
      },
      {
        $unwind: "$submissionPeriod"
      },
      // Join search program collection
      {
         $lookup:{
          from:'Program',
          localField:'programId',
          foreignField:'_id',
          as:'program'
        }
      },
      {
        $unwind: "$program"
      },
      {
         $lookup:{
          from:'Status',
          localField:'statusId',
          foreignField:'_id',
          as:'status'
        }
      },
      {
        $unwind: "$status"
      },
    ]

    if (orgIds.length == 0){
      aggratePipeLine[0] = {
        // @ts-ignore
        $match: { 
          programId: {
            $in: programIds
          },
          isLatest:true
        }
      }
    }
    
    return SubmissionModel.aggregate(aggratePipeLine);
  }

  async findByParentId(parentId: string) {
    return SubmissionModel.find({ parentId }).then((submission: SubmissionDoc[])=>{
      if(submission == undefined){return {}}
      else{
        return submission
      }
    });
  }

  async findAndSetFalse(id: ObjectId) {
    return SubmissionModel.findOneAndUpdate({ _id: id }, { isLatest: false });
  }

  async find() {
    return SubmissionModel.find({ isLatest: true });
  }

  async findByOrgIdAndProgramId(orgIds: number[], programIds: string[]) {
    if (orgIds.length == 0) return SubmissionModel.find({ programId: { $in: programIds }, isLatest: true });
    return SubmissionModel.find({ orgId: {$in: orgIds}, programId: { $in: programIds }, isLatest: true } as FilterQuery<SubmissionDoc>);
  }

  // Created on Nov 27, 2020
  // Updates submission with new workkbook
  async updateWorkbook(_id: string, workbookData: any){
    return SubmissionModel.findByIdAndUpdate( _id, { workbookData })
  }

  async findOneByTemplateIDs(templateIDs: ObjectId[]|string[]) {
    return SubmissionModel.findOne({ templateId:{$in:templateIDs}}, {_id:1});
  }

  async findQuery(query: Partial<Submission>) {
    return SubmissionModel.find(query)
  }

  async findQueryPopulate(query: Partial<Submission>) {
    return SubmissionModel.find(query)
      .populate('statusId')
      .populate('workflowProcessId')
      .populate('submissionPeriodId')
      .populate('programId')
      .populate('updatedBy')
      .populate('templatePackageId')
  }

  populateIdStep(from: string, localField: string) {
    return ({
      from,
      localField,
      foreignField: '_id',
      as: localField,
    })
  }

  async aggregateRoles(roles: UserSysRole[], populated = false): Promise<SubmissionAggregated> {
    const facets: {[key: number]: UserSysRole[]} = roles.reduce((acc, curr, index) => populated ? ({
      ...acc,
      [`${curr.programId}_${curr.organizationId}_${curr.templateTypeId}`]: [
        {
          $match: {orgId: parseInt(curr.organizationId), programId: new ObjectId(curr.programId)},
        },
        // populate needed fields
        {
          $lookup: this.populateIdStep("Status", "statusId")
        },
        {
          $lookup: this.populateIdStep("WorkflowProcess", "workflowProcessId")
        },
        {
          $lookup: this.populateIdStep("SubmissionPeriod", "submissionPeriodId")
        },
        {
          $lookup: this.populateIdStep("User", "updatedBy")
        },
        {
          $lookup: this.populateIdStep("TemplatePackage", "templatePackageId")
        },
        {
          $lookup: this.populateIdStep("Program", "programId")
        },
        {
          $lookup: {
            from: "Template",
            as: "templateId",
            let: { tmpid: "$templateId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$_id',
                          '$$tmpid'
                        ]
                      },
                      {
                        $eq: [
                          '$templateTypeId',
                          new ObjectId(curr.templateTypeId)
                        ]
                      }
                    ]
                  }
                }
              }
            ]
          }
        },
        // unwind lookups to first element
        {
          $project: {
            statusId: {$arrayElemAt: ["$statusId", 0]},
            workflowProcessId: {$arrayElemAt: ["$workflowProcessId", 0]},
            submissionPeriodId: {$arrayElemAt: ["$submissionPeriodId", 0]},
            updatedBy: {$arrayElemAt: ["$updatedBy", 0]},
            templatePackageId: {$arrayElemAt: ["$templatePackageId", 0]},
            programId: {$arrayElemAt: ["$programId", 0]},
            templateId: {$arrayElemAt: ["$templateId", 0]},
            // include all other fields as-is
            _id: 1,
            isPublished: 1,
            version: 1,
            isLatest: 1,
            name: 1,
            approver: 1,
            createdAt: 1,
            orgId: 1,
            submittedDate: 1,
            templateName: 1,
            updatedAt: 1,
            workbookData: 1,
            workflowId: 1,
          }
        },
      ]
    }) : ({
      ...acc,
      [`${curr.programId}_${curr.organizationId}_${curr.templateTypeId}`]:
        [{$match: {orgId: +curr.organizationId, programId: new ObjectId(curr.programId)}}]
    }), {});
    try {
      const pipeline = this._model.aggregate([
        {
          $facet: facets
        }
      ])
      return (await pipeline)[0]
    } catch (e) {
      console.error(e)
      return {};
    }
  }
}