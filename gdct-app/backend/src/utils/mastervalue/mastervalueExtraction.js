import Container from 'typedi';
import pako from 'pako'
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import SheetNameRepository from '../../repositories/SheetName';
import MasterValueRepository from '../../repositories/MasterValue';
import { extractAttributeIds, extractCategoryData, getCellData } from './excel'

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
    id,
    submission,
    org,
    program,
    template,
    templateType,
    reportingPeriod,
  ){
    let { workbookData } = submission;

    const inflatedWorkbook = pako.inflate( workbookData.data, { to: 'string' });
    workbookData = JSON.parse(inflatedWorkbook);
  
    // Iterate through each sheet in the workbook
    for (const sheetName in workbookData.sheets){
  
      // Container for mastervalues to be populated
      const masterValues = [];
      // Current sheet
      const sheetData = workbookData.sheets[sheetName];
  
      // Extract attribute and category Ids present in the sheet
      const attributes = extractAttributeIds(sheetData);
      const categories = extractCategoryData(sheetData);
  
      const categoryIds = [];
      const currentYearAttributes = [];
  
      for (const row in categories) {
        categoryIds.push(categories[row]);
      }
  
      const openSubmissions = await reportingPeriodRepository.findSubmissionOpen();

      for (const column in attributes){
        const columnId = attributes[column].toString();
        
        const currentPeriod = columnId.slice(0,6);
        // let res = await reportingPeriodRepository.findSubmissionClosed({code: currentPeriod})
        for (let item in openSubmissions){
            if (openSubmissions[item].code === currentPeriod){
                currentYearAttributes.push(columnId);
                break;
            }
        }
        // if (!res[0].submissionClosed){
        //   currentYearAttributes.push(columnId);
        // }
      }
  
      // Check if the attribute and category Ids are valid
      const existingAttributes = await columNameRepository.batchFind(currentYearAttributes);
      const existingCategories = await coaRepository.batchFind(categoryIds);

  
      // Insert the existing attributes and categories into a new array
      const filteredAttributes = [];
      const filteredCategories = [];
  
      for (let attribute in existingAttributes){
        filteredAttributes.push(existingAttributes[attribute].id)
      }
  
      for (let category in existingCategories){
        filteredCategories.push(existingCategories[category].id)
      }
  
      // Delete existing mastervalues from the database (Will be populated by new values)
      await masterValueRepository.batchDelete(existingAttributes, existingCategories, org);
  
      
      let query = []
      // Delete attributes and categories that are not valid. This code is run because const categories and const attributes
      // contain information for position of the Ids in the cell
     for (const row in categories){
        categories[row] = categories[row].toString()
        if (!filteredCategories.includes(categories[row])){
          delete categories[row]
        } else {
          query.push(categories[row])
        }
      }
      // Delete all column
      for (const col in attributes){
        attributes[col] = attributes[col].toString()
        if (!filteredAttributes.includes(attributes[col])){
          delete attributes[col]
        }
      }

      // Get CategoryTree based on categoryId
      const sheetTitle = sheetData.properties.title;
      const sheetTitleId = await sheetNameRepository.findByName(sheetTitle)
      const categoryTrees = await coaTreeRepository.batchFindByCategoryId(query, sheetTitleId[0]._id)
  
      let categoryTreeList = {};
      const categoryGroupQuery = [];
      // Search for all layers of categoryTree. Should run maximum of five times according to the requirement
      await Promise.resolve(recursiveCategoryTreeSearch(categoryTrees, categoryTreeList, categoryGroupQuery, 0));
      let categoryGroupList = await coaGroupRepository.batchFind(categoryGroupQuery)

      const attributeIDAndName = await columNameRepository.findAll({_id:0});
      const categoryIDAndName = await coaRepository.batchFind(categoryIds, { _id: 0, COA: 0, __v: 0, unitOfMeassure: 0})
      
      const categoryIdTable = {};
      const attributeIdTable = {};

      attributeIDAndName.forEach(entry=>{
        attributeIdTable[entry.id] = entry.name;
      })

      categoryIDAndName.forEach(entry=>{
        categoryIdTable[entry.id] = entry.name;
      })

      
      const additionalAttributes = ["201799300", "202099300"];
      const Name = ["2017/18 Actual", "2020/21 Actual"]
      for (const row in categories) {
        for (const column in attributes) {
          const cellData = getCellData(sheetData, +row, +column);
          // Run if the cell is not empty
          if (cellData && cellData.value){ //change this line back
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
                if (currentCategoryId === categories[row]){
                  COATreeId = categoryTree;
                  // Looks through the categoryGroupList to find the matching categoryGroup
                  for (let itemTwo in categoryGroupList){
                    const categoryGroup = categoryGroupList[itemTwo]
                    if (categoryGroup._id.toString() === categoryTree.categoryGroupId.toString()){
                      string = string + categoryGroup.name + ', '
                      if (categoryTree.parentId){
                        const parentId = categoryTree.parentId.toString();
                        string = recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration);
                      }
  
  
                      string = string.substring(0, string.length - 2)
                      masterValues.push({
                        submission: { _id: submission._id, name: submission.name },
                        org,
                        program,
                        template,
                        templateType,
                        reportingPeriod: reportingPeriod.name,
                        attributeId: attributes[column],
                        categoryId: categories[row],
                        COATreeId: COATreeId._id,
                        categoryGroup: string,
                        value: cellData.value, //change this line back
                        categoryName:categoryIdTable[categories[row]],
                        attributeName:attributeIdTable[attributes[column]],
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

        // //Please delete this line
        // for (let i = 0; i < additionalAttributes.length; i++) {
        //   const cellData = null;
        //   // Run if the cell is not empty
        //   if (!(cellData && cellData.value)){
        //     // For categoryTree 
        //     let iteration = 0;
        //     let string = ""
        //     let COATreeId;
        //     let found = false;
        //     // Searching through the first layer of categoryTrees
        //     for (let item in categoryTreeList[iteration]){
        //       const categoryTree = categoryTreeList[iteration][item];
        //       // Searching through the categoryId array in the categoryTree
        //       if (found){
        //         break;
        //       }
        //       for (let categoryId in categoryTree.categoryId){
        //         const currentCategoryId = categoryTree.categoryId[categoryId]
        //         if (found){
        //           break;
        //         }
        //         // Checks if the categoryId matches
        //         if (currentCategoryId === categories[row]){
        //           COATreeId = categoryTree;
        //           // Looks through the categoryGroupList to find the matching categoryGroup
        //           for (let itemTwo in categoryGroupList){
        //             const categoryGroup = categoryGroupList[itemTwo]
        //             if (categoryGroup._id.toString() === categoryTree.categoryGroupId.toString()){
        //               string = string + categoryGroup.name + ', '
        //               if (categoryTree.parentId){
        //                 const parentId = categoryTree.parentId.toString();
        //                 string = recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration);
        //               }
  
  
        //               string = string.substring(0, string.length - 2)
        //               masterValues.push({
        //                 submission: { _id: submission._id, name: submission.name },
        //                 org,
        //                 program,
        //                 template,
        //                 templateType,
        //                 reportingPeriod: reportingPeriod.name,
        //                 attributeId: additionalAttributes[i],
        //                 categoryId: categories[row],
        //                 COATreeId: COATreeId._id,
        //                 categoryGroup: string,
        //                 value: Math.random()*100000,
        //                 categoryName:categoryIdTable[categories[row]],
        //                 attributeName:Name[i],
        //               });
  
        //               found = true;
        //               iteration = 0;
        //               break;
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        // //Delete this section
      }
      Promise.all(masterValues).then(() => {
        masterValueRepository.bulkUpdate(id, masterValues);
      });
    }
  }
  
  function recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration){
    iteration = iteration + 1;
    const categoryTree = categoryTreeList[iteration]
    for (let item in categoryTree){
      if (categoryTree[item]._id.toString() === parentId){
        for (let itemTwo in categoryGroupList){
          if (categoryGroupList[itemTwo]._id.toString() === categoryTree[item].categoryGroupId.toString()){
            string = string + categoryGroupList[itemTwo].name + ', ';
            if (categoryTree[item].parentId){
              parentId = categoryTreeList[iteration][item].parentId.toString();
              string = recursiveString(parentId, categoryTreeList, categoryGroupList, string, iteration++)
            }
            return string;
          }
        }
      }
    }
  }
  
  async function recursiveCategoryTreeSearch(currentTree, categoryTreeList, categoryGroupQuery, iteration){
    let categoryTreeQuery = [];
    categoryTreeList[iteration] = currentTree;
    for (let item in currentTree){
      if (currentTree[item].parentId){
        categoryTreeQuery.push(currentTree[item].parentId.toString());
      }
      categoryGroupQuery.push(currentTree[item].categoryGroupId);
    }
    if (categoryTreeQuery.length){
      let nextTree = await coaTreeRepository.batchFindById(categoryTreeQuery)
      iteration = iteration + 1;
      await Promise.resolve(recursiveCategoryTreeSearch(nextTree, categoryTreeList, categoryGroupQuery, iteration));
    }
    return 0;
  }