import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';
import AuditLog, { AuditLogDoc } from '../../types/auditlog';
import ArchiveLogModel from '../../models/ArchiveLog';
import {dateStringTranslate} from '../../utils/misc';
import PurgeLogModel from '../../models/PurgeLog';


export default class AuditLogRepository extends BaseRepository<AuditLog, AuditLogDoc> {
  constructor() {
    super(AuditLogModel);
  }

  async findAll() {
    return AuditLogModel.find();
  }

  async findAllPurge() {
    return PurgeLogModel.find();
  }

  async create(AuditLogInfo: AuditLog) {
    AuditLogInfo.updatedAt = dateStringTranslate(new Date(AuditLogInfo.updatedAt));
    return AuditLogModel.create(AuditLogInfo);
  }

  async move(date: Date, user: String) {
    let archived = 0;
    let deleted = 0;
    //find all documents between a date range
    await AuditLogModel.find({"updatedAt": {"$gte": new Date("2010-05-10"), "$lte": date} })
      .then(d => {
        //console.log(d)
        ArchiveLogModel.insertMany(d)
          .then(doc => {
            console.log("save successfully " + doc.length + " documents ");
            archived = doc.length;
            
            AuditLogModel.deleteMany({"updatedAt": {"$gte": new Date("2010-05-10"), "$lte": date} })
            .then(doc => {
              console.log("delete successfully " + doc.deletedCount  + " documents ")
              deleted = doc.deletedCount!;

              PurgeLogModel.insertMany({
                "user" : user,
                "numberArchived" : archived,
                "numberDeleted": deleted,
                "archiveMarkerDate" : date,
                "purgeDate" : new Date,
              }).then(doc => {
                console.log(doc);
              })
              .catch(error => {
                console.log(error)
              })
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {
        console.log(error)
      })
    return ;
  }

  async findLast() {

    return PurgeLogModel.findOne().sort({ _id: -1 }).limit(1);
  }

  async findArchives(startDate: Date, endDate: Date) {
    return await ArchiveLogModel.find({"updatedAt": {"$gte": startDate, "$lte": endDate} });
  }

}
