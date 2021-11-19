import BaseRepository from '../repository';
import SubmissionStatus, { SubmissionStatusDoc } from '../../types/packagestatus';
import SubmissionStatusModel from '../../models/SubmissionStatus';

export default class SubmissionStatusRepository extends BaseRepository<SubmissionStatus, SubmissionStatusDoc> {
  constructor() {
    super(SubmissionStatusModel);
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
