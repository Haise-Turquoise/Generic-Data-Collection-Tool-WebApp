import BaseRepository from '../repository';
import SubmissionStatus, { SubmissionStatusDoc } from '../../types/submissionstatus';
import SubmissionStatusModel from '../../models/SubmissionStatus';
import SubmissionStatusEntity from '../../entities/SubmissionStatus/entity';

export default class SubmissionStatusRepository extends BaseRepository<SubmissionStatus, SubmissionStatusDoc> {
  constructor() {
    super(SubmissionStatusModel);
  }

  find(query: Partial<SubmissionStatus> = {}) {
    return SubmissionStatusModel.find(query).then((subStats: SubmissionStatusDoc[]) => {
      return subStats.map(subStat => new SubmissionStatusEntity(subStat))
    })
  }

  // handle many queries at once
  async findMany(queries: Partial<SubmissionStatus>[] = [{}]) {
    let result: SubmissionStatus[] = []
    for (let query of queries) {
      const found = await SubmissionStatusModel.find(query)
      result = result.concat(found)
    }
    return result
  }

  async count(){
    let reportingPeriods = [];
    let numbers = [];


    return SubmissionStatusModel.aggregate([

      // {
      //     $group: 
      //     {
      //       _id: '$name', 
      //       total_products: { $sum: 1 }
          
      //     }
      // }
      // ,
      {
        $group: 
        {
          _id: {
            "submissionPeriod": '$submissionPeriod.name', 
            "name": '$template.name',
            
          },
          countSubmitted: {
            $sum: { 
              $cond: [
                { $or: 
                  [ {
                    $eq: ["$status.name", "Approved"],
                  }, 
                  {
                    $eq: ["$status.name", "Submitted"],
                  }, 
                  {
                    $eq: ["$status.name", "Reviewed"],
                  }, 
                    ] }
                , 1, 0,
              ],}
          },
          countUnsubmitted: {
            $sum: { 
              $cond: [
                {
                  $ne: ["$status.name", "Approved"],


                }, 1, 0,
              ],}
          },
          //total_products: { $sum: 1 }
        
        }
        //
    }
    ])
  }
}
