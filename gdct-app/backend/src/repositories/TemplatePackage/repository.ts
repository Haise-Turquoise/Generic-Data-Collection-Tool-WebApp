import Container from 'typedi';
import UserRepository from '../User';
import BaseRepository from '../repository';
import TemplateRepository from '../Template/repository';
import SubmissionPeriodRepository from '../SubmissionPeriod';
import TemplatePackageModel from '../../models/TemplatePackage';
import TemplatePackageEntity from '../../entities/TemplatePackage';
import StatusRepository from '../Status';
import UsersRepository from '../Users';
import TemplateModel from '../../models/Template';
import TemplatePackage, { TemplatePackageDoc } from '../../types/templatepackage';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';
import { ObjectID } from 'bson';

const populatedParams = 'submissionPeriodId templateIds statusId programIds';

// MongoDB implementation
// @Service()
export default class TemplatePackageRepository extends BaseRepository<TemplatePackage, TemplatePackageDoc> {
  private submissionPeriodRepository: SubmissionPeriodRepository;
  private usersRepository: UsersRepository;
  private userRepository: UserRepository;
  private templateRepository: TemplateRepository;
  private statusRepository: StatusRepository;

  constructor() {
    super(TemplatePackageModel);

    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
    this.usersRepository = Container.get(UsersRepository);
    this.userRepository = Container.get(UserRepository);
    this.templateRepository = Container.get(TemplateRepository);
    this.statusRepository = Container.get(StatusRepository);
  }

  async create({
    name,
    submissionPeriodId,
    templateIds,
    statusId,
    creationDate,
    userCreatorId,
    programIds,
    updatedBy,
    timestamp,
  }: TemplatePackage) {
    return this.submissionPeriodRepository
      .validate(submissionPeriodId)
      .then(() => this.templateRepository.validateMany(templateIds))
      .then(() => this.statusRepository.validate(statusId))
      .then(() =>
        TemplatePackageModel.create({
          name,
          submissionPeriodId,
          templateIds,
          statusId,
          creationDate,
          userCreatorId,
          programIds,
          updatedBy,
          timestamp,
        }),
      )
      .then(templatePackage => new TemplatePackageEntity(templatePackage));
  }

  async update(
    id: string,
    { name, submissionPeriodId, templateIds, statusId, creationDate, userCreatorId, programIds, updatedBy, timestamp, }: Partial<TemplatePackage>,
    isPopulated?: boolean,
  ) {
    // console.log('programIds', programIds)
    return (statusId ? this.statusRepository.validate(statusId) : new Promise<void>(resolve => resolve()))
      .then(() => {
        if (templateIds) return this.templateRepository.validateMany(templateIds);
      })
      .then(() => {
        if (submissionPeriodId) return this.submissionPeriodRepository.validate(submissionPeriodId);
      })
      .then(() =>
        
        TemplatePackageModel.findByIdAndUpdate(
          id,
          {
            name,
            submissionPeriodId,
            templateIds,
            statusId,
            creationDate,
            userCreatorId,
            programIds,
            updatedBy,
            timestamp,
          },
          { upsert: true, new: true },
        ).populate(isPopulated ? populatedParams : ''),
      )
      .then(templatePackage => new TemplatePackageEntity(templatePackage));
  }

  async findByProgramId(programId: string) {
    return TemplatePackageModel.find({ programIds: programId } as FilterQuery<TemplatePackageDoc>);
  }


  async retrieveFullPkgInfoByProgramId(programIds:ObjectID[]){
    //@ts-ignore
    const result = await TemplatePackageModel.find({ programIds: {$in:programIds}})
    .populate('templateIds', 'templateTypeId')
    return result;
  }

  async findByName(name: string) {
    return TemplatePackageModel.find({ name });
  }

  async find(query: Partial<TemplatePackage>, isPopulated?: boolean) {
    const realQuery: FilterQuery<TemplatePackageDoc> = {};
    let key: keyof TemplatePackage
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    const templatePackages = await TemplatePackageModel.find(realQuery).populate(
      isPopulated ? populatedParams : '',
    );

    return templatePackages.map(
      (templatePackage: TemplatePackageDoc) => new TemplatePackageEntity(templatePackage),
    );
  }

  async delete(id: string) {
    return TemplatePackageModel.findByIdAndDelete(id)
    .then((templatePackage: TemplatePackageDoc|null) => {
      if (!templatePackage) throw new AppError(`Delete failed for template package with ID: ${id}`);
      return new TemplatePackageEntity(templatePackage);
    });
  }

  async findByIds(ids: string[]){
    const templatePackages: TemplatePackageDoc[] = await TemplatePackageModel.find({ _id: { $in: ids } });
    
    return templatePackages.map(
      templatePackage => new TemplatePackageEntity(templatePackage),
    );
  }

  async findStatusById(id: string){
    const statusID: TemplatePackageDoc|null = await TemplatePackageModel.findById(id, {_id:0, statusId:1});
    if(!statusID) throw new AppError(`Query failed, Item not found for Status item with ID: ${id}`);
    return this.statusRepository.findById(statusID.statusId);
  }
  
  async findByUpdateBy(updatedBy: string) {
    return TemplatePackageModel.find({ updatedBy });
  }
}
