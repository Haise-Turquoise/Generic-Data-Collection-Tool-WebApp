import React, { useLayoutEffect } from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import spreadSheetController from '../controllers/spreadSheet'
const categoryInsertMenu = (props)=>{
    const {open, callback} = props;
    

    let category = [];
    let InsertedID = {};
    
    // spreadSheetController.fetchCategoryAndAttribute().then(data=>{ console.log(data);updateCategory_Groups(data["Categories"]);})

    useLayoutEffect(()=>{
        spreadSheetController.fetchCategoryAndAttribute().then(data=>{ console.log(data);updateCategory_Groups(data["Categories"]);})
    }, []);

    const update_subform = (caller_layer, inputJson)=>{
        let formSection = document.getElementById('formSection');
        
        //onChange, remove every selection form after the target form
        let counter = 0
        const childs = formSection.childNodes
        let delIndex = Infinity;
        for(let i = 0; i < formSection.childNodes.length; i++){
          console.log(childs[i].nodeName)
          if(childs[i].nodeName == "FORM"){
            counter += 1;
            if (counter > caller_layer && delIndex == Infinity){
              delIndex = i + 1
            }
          }
          
          if (i >= delIndex){
            formSection.removeChild(formSection.childNodes[i])
          }
          
        }

        while (formSection.childNodes.length >= delIndex){
          formSection.removeChild(formSection.childNodes[formSection.childNodes.length - 1])
        }

        
        
        const selectionList = [];
        // Obtain selection path by navigating trhough the Json file
        for(let i = 1; i < formSection.childNodes.length; i++){

          let selection = formSection.childNodes[i]
          if (selection.nodeName == "FORM"){
            let option = null;
            for (let element of selection.childNodes){
                if (element.nodeName == "SELECT"){
                    option = element;
                    break;
                } 
            }
            selectionList.push(option[option.selectedIndex].text)
          }
             
        }
        
        let targetList = category
        let fullJsonLayer = {}
        // Navigate in the Json layer
        for(let item of selectionList){
          fullJsonLayer = targetList.filter((element)=>{return element.categoryGroup == item})[0];
          targetList = fullJsonLayer.childCategory;
        }
        // console.log(fullJsonLayer)
        // Navigate set the target layer
        if(fullJsonLayer.categories.length == 0 && fullJsonLayer.childCategory.length == 0){
        
          const form = document.createElement('FORM');
          const select = document.createElement("SELECT");
          form.appendChild(select);
          formSection.append(form);
          
        }else{
        
          if(fullJsonLayer.childCategory.length > 0){
            const form = document.createElement('FORM');
            const select = document.createElement("SELECT");
            
            let option = document.createElement('OPTION');
            let textNode = document.createTextNode('please select an option');
            option.appendChild(textNode);
            select.appendChild(option)
            fullJsonLayer.childCategory.sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup));
            fullJsonLayer.childCategory.forEach((element)=>{
              let option = document.createElement('OPTION');
              let name = element.categoryGroup;
              let textNode = document.createTextNode(name);
              option.appendChild(textNode);
              select.appendChild(option);
            })
            
            // Insert option node
            fullJsonLayer.categories.sort((a, b) => a.name.localeCompare(b.name));
            fullJsonLayer.categories.forEach((element)=>{
              let option = document.createElement('OPTION');
              option.setAttribute('id', element.id);
              let textNode = document.createTextNode(String(element.id) + " " +element.name);
              option.appendChild(textNode);
              select.appendChild(option);
            })
            
            select.addEventListener('change',()=>{update_subform(caller_layer+1, category)})
            form.appendChild(select);
            formSection.append(form);
            
          }else{
            const form = document.createElement('FORM');
            const select = document.createElement("SELECT");
            select.setAttribute("id", 'FinalLayer');
            
            let option = document.createElement('OPTION');
            let textNode = document.createTextNode('please select an option');
            option.appendChild(textNode);
            select.appendChild(option)
            fullJsonLayer.categories.sort((a, b) => a.name.localeCompare(b.name));
            fullJsonLayer.categories.forEach((element)=>{
              let option = document.createElement('OPTION');
              option.setAttribute('id', element.id);
              let textNode = document.createTextNode(String(element.id) + " " +element.name);
              option.appendChild(textNode);
              select.appendChild(option);
            })
            
            select.addEventListener('change',()=>{insertOptions()})
            form.appendChild(select);
            formSection.append(form);
          }
        }    
      }
      
      function updateCategory_Groups(category_group) {
        let property_name = document.getElementById('category_name');
        category = category_group;
        InsertedID = {};
        category.sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup));
        category.forEach((input)=>{
          let option = document.createElement("OPTION");
          let text = input.categoryGroup;
          let textnode = document.createTextNode(text);
          option.appendChild(textnode);
          property_name.appendChild(option);
        });
        console.log(category)
      }
      
      function updateCategory(categoryGroupName){
        let input_fields = document.getElementById('CategoryOptions');
        while(input_fields.childNodes.length != 0){
          input_fields.removeChild(input_fields.childNodes[0]);
        }
        
        let intro = document.createElement('OPTION');
        let introtext = document.createTextNode('Please select a category');
        intro.appendChild(introtext);
        input_fields.appendChild(intro);
        const categories = category.filter((group)=>group.categoryGroup == categoryGroupName)[0].categories
        console.log(categories)
        categories.sort((a, b) => a.name.localeCompare(b.name));
        console.log(categories)
        categories.forEach((category)=>{
          let option = document.createElement('OPTION');
          option.setAttribute("id", category.id)
          let textnode = document.createTextNode(category.name);
          option.appendChild(textnode);
          input_fields.appendChild(option);
        });
      }
      
      function insert(){
        let categories = {}
        let keys = Object.keys(InsertedID);
        keys.forEach((id)=>{
          let text = InsertedID[id].innerHTML;
          categories[id] = text.substring(6);
        })
        
          
        if (keys.length > 0){
          let input_row = document.getElementById('row_number').value;
          let row_num = input_row&&input_row!='' ? Number.parseInt(input_row):undefined
          callback(categories, row_num);
        }
      }
      
      function insertOptions(){
        let input_fields = document.getElementById('FinalLayer');
         if (input_fields){
          if (input_fields.selectedIndex){
            const text = input_fields[input_fields.selectedIndex].text;
            const id = input_fields[input_fields.selectedIndex].id
            if (!InsertedID[id]){
              let pnode = document.createElement('P');
              pnode.setAttribute("id", id);
              let textnode = document.createTextNode(text);
              pnode.appendChild(textnode);
              let selected = document.getElementById("Selected Options");
              pnode.addEventListener('click', ()=>{deleteOption(id)});
              selected.appendChild(pnode);
              InsertedID[id] = pnode;
            }
          }
        }
      }

      function deleteOption(id){
        let selected_field = document.getElementById('Selected Options');
        selected_field.removeChild(InsertedID[id])
        delete InsertedID[id];
      }

    return (
        <Dialog onClose={()=>{}} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <div id="formSection">
                <form>
                    <select name="category_name" id="category_name" onChange={()=>updateCategory(this.value)}>
                    <option>Please select a Catagory</option>
                    </select>
                </form>

                <form>
                    <select name="CategoryOptions" id="CategoryOptions">
                    </select>
                </form>
            </div>
            <input type="Number" id="row_number" placeholder="Enter a row number you want to insert after (optional)"/>
                <button onClick={insert}>Confirm</button>
            <div id="Selected Options"></div>
        </Dialog>
    );
}

export default categoryInsertMenu;