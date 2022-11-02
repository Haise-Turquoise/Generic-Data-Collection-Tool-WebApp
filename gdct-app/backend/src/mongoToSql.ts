/***
 * This File is responseble for transfering data from mongodb to Azure sql
 */
const sql = require("mssql");

import MasterValueRepository from './repositories/MasterValue' 
import templateTypeRepository from './repositories/TemplateType'
import programRepository from './repositories/Program'
import organizationRepository from './repositories/Organization'
import reportingPeriodRepository from './repositories/ReportingPeriod'
import COARepository from './repositories/COA'
import attributeRepository from './repositories/ColumnName'
import categoryGroupRepository from './repositories/COAGroup'
import transferStatusRepository from  './repositories/TransferStatus'
import Container from 'typedi';
import { OrganizationDoc } from './types/organization';
import { CategoryGroupDoc } from './types/categorygroup';
import { CategoryDoc } from './types/category';
import { ReportingPeriodDoc } from './types/reportingperiod';
import { MasterValueDoc } from './types/mastervalue';
import { ProgramDoc } from './types/program';
import { TemplateTypeDoc } from './types/templatetype';

const config = {
  user: process.env.AzureDBUser,
  password: process.env.AzureDBPassword,
  server: process.env.AzureDBServer, 
  database: process.env.AzureDB,
  pool: {
    max: 50,
    min: 10,
    idleTimeoutMillis: 30000
  },
  options:{
    enableArithAbort:false
  }
};

 /* 
  This function is use for organization transfer, implemented in a sycrhonized way for ease of benchmarking
 */
const orgTransfer = async(conn:any)=>{

  // Send a request that delete everything in the organization table
  await conn.query`DELETE FROM dbo.organization`

  const organizationModel = Container.get(organizationRepository)
  console.log('\n\n');
  console.log('===============================org Transfer Satistics==============================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  // Query everything from org table in mongo DB 
  const mongoOrganization:OrganizationDoc[] = await organizationModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  // Create a table instantance for bulk update
  const table = new sql.Table('dbo.organization');

  // Set this to true if the table does not exist in Azure
  table.create = true;

  // Define all the columns, this has to be consistant with the table on Azure if it already exist
  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('id', sql.BigInt, { nullable: false });
  table.columns.add('name', sql.VarChar(500), { nullable: false });
  table.columns.add('IFISNum',sql.VarChar(50), { nullable: false });

  table.columns.add('province',sql.VarChar(10), { nullable: false });
  table.columns.add('organizationGroupId',sql.NVarChar(500), { nullable: false });
  table.columns.add('authorizedPerson',sql.NVarChar(500),{nullable: true});
  // table.columns.add('authorizedPersonName',sql.VarChar(50), { nullable: true });
  // table.columns.add('authorizedPersonEmail',sql.VarChar(50), { nullable: true });

  table.columns.add('programId',sql.NVarChar(500), { nullable: true });
  table.columns.add('address', sql.VarChar(100), { nullable: true });
  table.columns.add('city', sql.VarChar(100), { nullable: true });
  table.columns.add('code', sql.VarChar(100), { nullable: true });
  table.columns.add('legalName', sql.VarChar(500), { nullable: true });
  table.columns.add('location', sql.NVarChar(500), { nullable: true });

  table.columns.add('managerUserIds', sql.NVarChar(500), { nullable: true });
  table.columns.add('postalCode', sql.VarChar(100), { nullable: true });
  // table.columns.add('authorizedUserId', sql.VarChar(100), { nullable: true });
  // table.columns.add('contactUserId', sql.VarChar(100), { nullable: true }); 

  /* 
    Insert all the rows to the table instantce. 
    For anyone whos going to maintain / change my code in the future, 
    entries are order sensitive, please follow the order of the column.
    (^v^ )
  */
  mongoOrganization.forEach(entry=>{
    table.rows.add(
      String(entry._id),
      entry.id,
      entry.name,
      entry.IFISNum,

      entry.province,
      JSON.stringify(entry.organizationGroupId),
      entry.authorizedPerson?entry.authorizedPerson.name:'',
      entry.authorizedPerson?entry.authorizedPerson.email:'',

      JSON.stringify(entry.programId),
      entry.address,
      entry.city,
      entry.code,
      entry.legalName,
      JSON.stringify(entry.location),
      entry.postalCode,
      // entry.authorizedPerson.name,
      // entry.authorizedPerson.email
      // entry.authorizedUserId,
      // entry.contactUserId
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')

  // Initiate a request and pass the table instant in for a bulk update
  const request = conn.request();
  const responseCode = await request.bulk(table);

  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}


/* 
  This function is use for categoryGroup transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
 */
const categoryGroupTransfer = async(conn:any)=>{
  await conn.query`DELETE FROM dbo.CategoryGroup`
  const categoryGroupModel = Container.get(categoryGroupRepository)
  console.log('\n\n');
  console.log('===============================COAGroup Transfer Satistics==============================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongoCOAGroup:CategoryGroupDoc[] = await categoryGroupModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.CategoryGroup');
  table.create = false;

  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('name', sql.VarChar(500), { nullable: false });
  table.columns.add('isActive', sql.Bit, { nullable: true });


  mongoCOAGroup.forEach(entry=>{
    table.rows.add(
      String(entry._id),
      entry.name,
      entry.isActive,
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}

/* 
  This function is use for Attribute transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const AttributeTransfer = async(conn:any)=>{
  await conn.query`DELETE FROM dbo.Attribute`
  const attributeModel = Container.get(attributeRepository)
  console.log('\n\n');
  console.log('===============================Attribute Transfer Satistics==============================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongoAttribute = await attributeModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.Attribute');
  table.create = true;

  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('name', sql.VarChar(500), { nullable: false });
  table.columns.add('id', sql.VarChar(50), { nullable: false });


  mongoAttribute.forEach(entry=>{
    table.rows.add(
      String(entry._id),
      entry.name,
      entry.id,
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}


/* 
  This function is use for COA transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const COATransfer = async(conn:any)=>{

  await conn.query`DELETE FROM dbo.category`
  const COAModel = Container.get(COARepository);
  console.log('\n\n');
  console.log('===============================COA Transfer Satistics==============================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongoCOA:CategoryDoc[] = await COAModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.category');
  table.create = true;

  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('name', sql.VarChar(500), { nullable: false });
  table.columns.add('id', sql.VarChar(50), { nullable: false });
  table.columns.add('COA', sql.VarChar(500), { nullable: false });
  table.columns.add('unitOfMeasure', sql.VarChar(50), { nullable: true });


  mongoCOA.forEach(entry=>{
    table.rows.add(
      String(entry._id),
      entry.name,
      entry.id,
      entry.COA,
      entry.unitOfMeasure
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}

/* 
  This function is use for Reporting period transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const ReportingPeriodTransfer = async(conn:any)=>{
  await conn.query`DELETE FROM dbo.ReportingPeriod`;
  const reportingPeriodModel = Container.get(reportingPeriodRepository);
  console.log('\n\n');
  console.log('===============================ReportingPeriod Transfer Satistics==============================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongoReportingPeriod: ReportingPeriodDoc[] = await reportingPeriodModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.ReportingPeriod');
  table.create = true;

  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('name', sql.VarChar(100), { nullable: false });
  table.columns.add('code', sql.VarChar(500), { nullable: false });
  table.columns.add('submissionClosed', sql.Bit, { nullable: false });


  mongoReportingPeriod.forEach(entry=>{
    table.rows.add(
      String(entry._id),
      entry.name,
      entry.code,
      entry.submissionClosed
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}


/* 
  This function is use for MasterValue transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const MasterValueTransfer = async (conn:any) =>{
  conn.query`DELETE FROM dbo.MasterValue`
  const masterValueModel = Container.get(MasterValueRepository);
  console.log('\n\n');
  console.log('===========================MasterValue Transfer Satistics===========================\n')

  console.time('Total runtime');
  // console.time('SQL delete time')
  // const deleteRes = await conn.request().query('DELETE FROM dbo.MasterValue');
  // console.timeEnd('SQL delete time')

  console.time('Mongo query time');
  const res:MasterValueDoc[] = await masterValueModel.findAll();
  console.timeEnd('Mongo query time')

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.MasterValue');
  table.create = true;
  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('reportingPeriod', sql.VarChar(50), { nullable: false });
  table.columns.add('submission_id', sql.VarChar(50), { nullable: false });
  table.columns.add('submissionName', sql.VarChar(50), { nullable: false });
  table.columns.add('orgid', sql.Int, { nullable: false });
  table.columns.add('orgName', sql.VarChar(50), { nullable: false });
  table.columns.add('program_id', sql.VarChar(50), { nullable: false });
  table.columns.add('programName', sql.VarChar(50), { nullable: false });
  table.columns.add('templateName', sql.VarChar(50), { nullable: false });
  table.columns.add('templateType_id', sql.VarChar(50), { nullable: false });
  table.columns.add('templateTypeName', sql.VarChar(50), { nullable: false });
  table.columns.add('AttributeId', sql.VarChar(50), { nullable: false });
  table.columns.add('CategoryId', sql.VarChar(50), { nullable: false });
  table.columns.add('value', sql.Float, { nullable: false });
  table.columns.add('CategoryGroup1', sql.VarChar(50), {nullable: false});
  table.columns.add('CategoryGroup2', sql.VarChar(50), {nullable: true});
  table.columns.add('CategoryGroup3', sql.VarChar(50), {nullable: true});
  table.columns.add('CategoryGroup4', sql.VarChar(50), {nullable: true});
  table.columns.add('CategoryName', sql.VarChar(500), {nullable:false});
  table.columns.add('AttributeName',sql.VarChar(500), {nullable:false});
  res.forEach(element=>{
    const groups = element.categoryGroup.split(', ');
    const grouplen = groups.length;
    table.rows.add(
      String(element._id), 

      element.reportingPeriod,

      String(element.submission._id),
      element.submission.name,

      element.org.id,
      element.org.name,

      String(element.program._id),
      element.program.name,

      element.template,

      String(element.templateType._id),
      element.templateType.name,
      
      element.attributeId,
      element.categoryId,
      element.value,

      groups[0],
      grouplen < 2 ? null: groups[1],
      grouplen < 3 ? null: groups[2],
      grouplen < 4 ? null: groups[3],
      element.categoryName,
      element.attributeName

    )
  });
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time')
  console.timeEnd('Total runtime');

  console.log('Row Inserted: ', responseCode)
  // console.log('Row deleted: ', deleteRes.rowsAffected)
  console.log('=============================End of Transfer Satistics=============================\n')
}


/* 
  This function is use for program transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const programTransfer = async(conn:any)=>{
  await conn.query`DELETE FROM dbo.program`
  const programModel = Container.get(programRepository);
  console.log('\n\n');
  console.log('===========================program Transfer Satistics==========================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongoProgram:ProgramDoc[] = await programModel.find({});
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.program');
  table.create = true;
  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('code', sql.VarChar(500), { nullable: false });
  table.columns.add('name', sql.VarChar(500), { nullable: false });
  table.columns.add('isActive', sql.Bit, { nullable: true });
  mongoProgram.forEach(entry=>{
    table.rows.add(
      entry._id,
      entry.code,
      entry.name,
      entry.isActive,
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}

/* 
  This function is use for template type transfer, implemented in a sycrhonized way for ease of benchmarking
  The details are the same for all the transfer function. Plase refer to the first function for details
*/
const TemplateTypeTransfer = async(conn:any)=>{
  await conn.query`DELETE FROM dbo.templateType`
  const templateTypeModel = Container.get(templateTypeRepository)
  console.log('\n\n');
  console.log('===========================TemplateType Transfer Satistics==========================\n')

  console.time('Total runtime');
  console.time('Mongo query time');
  const mongotemplateTypes:TemplateTypeDoc[] = await templateTypeModel.findAll();
  console.timeEnd('Mongo query time');

  console.time('mongo to SQL reformat time')
  const table = new sql.Table('dbo.templateType');
  table.create = true;
  table.columns.add('_id', sql.VarChar(50), { nullable: false });
  table.columns.add('name', sql.VarChar(50), { nullable: false });
  table.columns.add('description', sql.VarChar(50), { nullable: false });
  table.columns.add('isActive', sql.Bit, { nullable: true });
  mongotemplateTypes.forEach(entry=>{
    table.rows.add(
      entry._id,
      entry.name,
      entry.description,
      entry.isActive
    )
  })
  console.timeEnd('mongo to SQL reformat time')

  console.time('SQL insertion time')
  const request = conn.request();
  const responseCode = await request.bulk(table);
  console.timeEnd('SQL insertion time');
  console.timeEnd('Total runtime');
  console.log('Row Inserted: ', responseCode);
  console.log('=============================End of Transfer Satistics=============================\n');
  
}

/* This is the the actual function where all the other function is called
   This function is implemented in a sychronized way for ease of reading.
*/
const transfer = async ()=>{
  const transferRepo = Container.get(transferStatusRepository);
  const res = await transferRepo.findTransferStatus();
  if (res && res.isActive){
    console.log('Starting Transfer')
    try{
      const pool = new sql.ConnectionPool(config);
      await pool.connect();
      await orgTransfer(pool);
      await categoryGroupTransfer(pool);
      await AttributeTransfer(pool);
      await COATransfer(pool);
      await ReportingPeriodTransfer(pool);
      await MasterValueTransfer(pool);
      await programTransfer(pool);
      await TemplateTypeTransfer(pool);
      await pool.close()
    }catch(err){
      console.log(err)
    }
  }else{
    console.log("TransferStatus not active")
  }
}
const startTransfer = (interval:number)=>{
  return setInterval(transfer, interval)
}
export default startTransfer;