import Container from 'typedi';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import SheetNameRepository from '../../repositories/SheetName';
import MasterValueRepository from '../../repositories/MasterValue';
import { SubmissionDoc } from '../../types/submission';
import { ObjectId } from 'mongodb';;
import { MasterValueDoc, MasterValueOrg } from '../../types/mastervalue';
import { extractAttributeIds, extractCategoryIds } from './mastervaluePrepopulation';
import { CategoryTreeDoc } from '../../types/categorytree';
import AppError from '../AppError';

const reportingPeriodRepository = Container.get(ReportingPeriodRepository);
const coaTreeRepository = Container.get(COATreeRepository);
const coaGroupRepository = Container.get(COAGroupRepository);
const sheetNameRepository = Container.get(SheetNameRepository);
const columNameRepository = Container.get (ColumnNameRepository)
const coaRepository = Container.get(COARepository);
const masterValueRepository = Container.get(MasterValueRepository);

// Last Updated: Dec 21, 2020
// After a template package is approved, populate data inside the spreadsheet into the database
export async function mastervalueExtraction(
    id:string,
    submission: SubmissionDoc,
    org:MasterValueOrg,
    program:{ _id: ObjectId; name: string; },
    template:string,
    templateType: {_id: ObjectId, name: string},
    reportingPeriod:{ name: string },
  ){
    const { workbookData } = submission;

    // Iterate through the sheet
    for (const sheet of workbookData){

      const attributeMap = extractAttributeIds(sheet);
      const categoryMap = extractCategoryIds(sheet);
      const categoryIDs = Object.keys(categoryMap);
      const attributeIDs = Object.keys(attributeMap);
      if (categoryIDs.length > 0 && attributeIDs.length > 0){

        // Container for mastervalues to be populated
        const masterValues:Partial<MasterValueDoc>[] = [];
        const openSubmissions = await reportingPeriodRepository.findSubmissionOpen();
        const currentYearAttributes = [];

        // Find the current active attribute ID
        for (const attributeId of attributeIDs){
          const currentPeriod = attributeId.slice(0,6);

          for (let item in openSubmissions){
            if (openSubmissions[item].code === currentPeriod){
              currentYearAttributes.push(attributeId);
              break;
            }
          }
        }

        // Check if the attribute and category Ids are valid
        const existingAttributes = await columNameRepository.batchFind(currentYearAttributes);
        const existingCategories = await coaRepository.batchFind(categoryIDs);

        const filteredAttributes = existingAttributes.map(e=>e.id);
        const filteredCategories = existingCategories.map(e=>e.id);

        await masterValueRepository.batchDelete(filteredAttributes, filteredCategories, org.id);
      
        // Get CategoryTree based on categoryId
        const sheetTitle = sheet.name;
        const sheetTitleId = await sheetNameRepository.findByName(sheetTitle);
        if (!sheetTitleId || sheetTitle.length === 0) throw new AppError(`Sheet ID not found for name: ${sheetTitle}`);
        // @ts-ignore
        const categoryTrees = await coaTreeRepository.batchFindByCategoryId(filteredCategories, sheetTitleId[0]._id);

        let categoryTreeList:any = {};
        const categoryGroupQuery:string[] = [];

        // Search for all layers of categoryTree. Should run maximum of five times according to the requirement
        await Promise.resolve(recursiveCategoryTreeSearch(categoryTrees, categoryTreeList, categoryGroupQuery, 0));
        let categoryGroupList = await coaGroupRepository.batchFind(categoryGroupQuery);
        // @ts-ignore
        const attributeIDAndName = await columNameRepository.findAll({_id:0});
        // @ts-ignore
        const categoryIDAndName = await coaRepository.batchFind(categoryIDs, { _id: 0, COA: 0, __v: 0, unitOfMeassure: 0})

        const categoryIdTable:any = {};
        const attributeIdTable:any = {};

        attributeIDAndName.forEach(entry=>{
          attributeIdTable[entry.id] = entry.name;
        })

        categoryIDAndName.forEach(entry=>{
          categoryIdTable[entry.id] = entry.name;
        })
        
        for (const categoryID of filteredCategories){
          for (const attributeID of filteredAttributes){
            let ri = categoryMap[categoryID];
            let ci = attributeMap[attributeID];
            const targetCell = sheet.rows[ri].cells[ci];
            // Run if the cell is not empty
            if (targetCell && targetCell.text !== '' && !isNaN(targetCell.text)){

              // For categoryTree 
              let iteration = 0;
              let string = ""
              let COATreeId;
              let found = false;
              
              // Searching through the first layer of categoryTrees
              for (let item in categoryTreeList[iteration]){
                const categoryTree = categoryTreeList[iteration][item];
                // Searching through the categoryId array in the categoryTree
                if (found){
                  break;
                }
                for (let categoryId in categoryTree.categoryId){
                  const currentCategoryId = categoryTree.categoryId[categoryId]
                  if (found){
                    break;
                  }
                  // Checks if the categoryId matches
                  if (currentCategoryId === categoryID){
                    COATreeId = categoryTree;
                    // Looks through the categoryGroupList to find the matching categoryGroup
                    for (let itemTwo in categoryGroupList){
                      const categoryGroup = categoryGroupList[itemTwo]
                      if (categoryGroup._id.toString() === categoryTree.categoryGroupId.toString()){
                        string = string + categoryGroup.name + ', '
                        if (categoryTree.parentId){
                          const parentId = categoryTree.parentId.toString();
                          const newString = recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration);
                          if (!newString) throw new AppError("Undefined category group String");
                          string = newString
                        }
    
    
                        string = string.substring(0, string.length - 2)
                        masterValues.push({
                          submission: { _id: submission._id, name: submission.name },
                          org,
                          program,
                          template,
                          templateType,
                          reportingPeriod: reportingPeriod.name,
                          attributeId: attributeID,
                          categoryId: categoryID,
                          COATreeId: COATreeId._id,
                          categoryGroup: string,
                          value: targetCell.text, //change this line back
                          categoryName:categoryIdTable[categoryID],
                          attributeName:attributeIdTable[attributeID],
                        });
    
                        found = true;
                        iteration = 0;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        Promise.all(masterValues).then(() => {
          //@ts-ignore
          masterValueRepository.bulkUpdate(id, masterValues);
        });
      }
    }
  }
  
  function recursiveString(parentId:string, categoryTreeList:any, categoryGroupList:any, string:string, iteration:number){
    iteration = iteration + 1;
    const categoryTree = categoryTreeList[iteration]
    for (let item in categoryTree){
      if (categoryTree[item]._id.toString() === parentId){
        for (let itemTwo in categoryGroupList){
          if (categoryGroupList[itemTwo]._id.toString() === categoryTree[item].categoryGroupId.toString()){
            string = string + categoryGroupList[itemTwo].name + ', ';
            if (categoryTree[item].parentId){
              parentId = categoryTreeList[iteration][item].parentId.toString();
              const newString = recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration++);
              if (!newString) throw new AppError("Undefined categoryGroup String");      
              string = newString;
            }
            return string;
          }
        }
      }
    }
  }
  
  async function recursiveCategoryTreeSearch(currentTree:CategoryTreeDoc[], categoryTreeList:any, categoryGroupQuery:string[], iteration:number){
    let categoryTreeQuery = [];
    categoryTreeList[iteration] = currentTree;
    for (let item in currentTree){
      if (currentTree[item].parentId){
        categoryTreeQuery.push(currentTree[item].parentId.toString());
      }
      categoryGroupQuery.push(String(currentTree[item].categoryGroupId));
    }
    if (categoryTreeQuery.length){
      let nextTree = await coaTreeRepository.batchFindById(categoryTreeQuery)
      iteration = iteration + 1;
      await Promise.resolve(recursiveCategoryTreeSearch(nextTree, categoryTreeList, categoryGroupQuery, iteration));
    }
    return 0;
  }