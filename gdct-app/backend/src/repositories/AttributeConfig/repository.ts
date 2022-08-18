import AttributeConfigEntity from '../../entities/AttributeConfig/entity';
import BaseRepository from '../repository';
import AttributeConfigModel from '../../models/AttributeConfig/model';
import AttributeConfig, { AttributeConfigDoc} from '../../types/attributeconfig';
import AppError from '../../utils/AppError';

export default class AttributeConfigRepository extends BaseRepository<AttributeConfig, AttributeConfigDoc> {
  constructor() {
    super(AttributeConfigModel);
  }

  async deleteById(id: string) {
    // const AttributeConfig = await AttributeConfigModel.findById(id);
    // if (AttributeConfig) {
    // //   AttributeConfig.isActive = false;
        
    // }else{
    //   throw new AppError(`Cannot find AttributeConfig with ID: ${id}`);
    // }
    // return this.update(id, AttributeConfig);
    return AttributeConfigModel.findByIdAndDelete(id).then(AttributeConfig => {
        if (!AttributeConfig) return undefined;
        return new AttributeConfigEntity(AttributeConfig)
    });
  }

  async create(AttributeConfig: AttributeConfig) {
    // AttributeConfig.isActive = true;
    return AttributeConfigModel.create(AttributeConfig).then(AttributeConfig => new AttributeConfigEntity(AttributeConfig));
  }

  async update(id: string, AttributeConfig: Partial<AttributeConfig>) {
    return AttributeConfigModel.findByIdAndUpdate(id, AttributeConfig).then(
      (AttributeConfig: AttributeConfigDoc|null) => {
        if (!AttributeConfig) return undefined;
        return new AttributeConfigEntity(AttributeConfig)
      });
  }

  async find(query: Partial<AttributeConfig>) {
    return AttributeConfigModel.find(query).then((AttributeConfigs: AttributeConfigDoc[]|null) =>{
      if (AttributeConfigs){
        return AttributeConfigs.map(AttributeConfig => new AttributeConfigEntity(AttributeConfig));
      }else{
        return [];
      }
    });
  }

  async findById(id: string) {
    const result = await AttributeConfigModel.findById(id);
    if (!result){
      throw new AppError(`Cannot find AttributeConfig with ID: ${id}`);
    }
    return result;
  }

  async findAll() {
    return AttributeConfigModel.find();
  }

  async findSessionCheckingPeriod() {
    return AttributeConfigModel.findOne({ key: "Session Timer Checking Interval" });
  }

  async findOne(param: Partial<AttributeConfig>){
    return AttributeConfigModel.findOne(param);
  }
}