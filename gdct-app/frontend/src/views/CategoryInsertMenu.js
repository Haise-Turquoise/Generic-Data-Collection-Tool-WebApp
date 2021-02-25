import React, { useLayoutEffect } from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import spreadSheetController from '../controllers/spreadSheet'
class categoryInsertMenu extends React.Component{
  constructor(props) {
    super(props);
    this.update_subform = this.update_subform.bind(this);
    this.updateCategory_Groups = this.updateCategory_Groups.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.insert = this.insert.bind(this);
    this.insertOptions = this.insertOptions.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.callback = this.props.callback;
    this.category = [];
    this.InsertedID = {};
  }
  // const {open, callback} = props;
  

  // let category = [];
  // let InsertedID = {};
  
  // spreadSheetController.fetchCategoryAndAttribute().then(data=>{ console.log(data);updateCategory_Groups(data["Categories"]);})

  // useLayoutEffect(()=>{
  //     spreadSheetController.fetchCategoryAndAttribute().then(data=>{ console.log(data);updateCategory_Groups(data["Categories"]);})
  // }, []);
  componentDidMount(){
    spreadSheetController.fetchCategoryAndAttribute().then(data=>{ 
      console.log(data);
      this.updateCategory_Groups(data["Categories"]);
    })
  }

  update_subform = (caller_layer, inputJson)=>{
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
    
    let targetList = this.category
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
        
        select.addEventListener('change',()=>{this.update_subform(caller_layer+1, this.category)})
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
        
        select.addEventListener('change',()=>{this.insertOptions()})
        form.appendChild(select);
        formSection.append(form);
      }
    }    
  }
  
    
  updateCategory_Groups = (category_group)=> {
    let property_name = document.getElementById('category_name');
    this.category = category_group;
    this.InsertedID = {};
    this.category.sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup));
    this.category.forEach((input)=>{
      let option = document.createElement("OPTION");
      let text = input.categoryGroup;
      let textnode = document.createTextNode(text);
      option.appendChild(textnode);
      property_name.appendChild(option);
    });
    console.log(this.category)
  }
    
  updateCategory = (e)=>{
    const categoryGroupName = e.target.value
    let input_fields = document.getElementById('CategoryOptions');
    while(input_fields.childNodes.length != 0){
      input_fields.removeChild(input_fields.childNodes[0]);
    }
    
    let intro = document.createElement('OPTION');
    let introtext = document.createTextNode('Please select a category');
    intro.appendChild(introtext);
    input_fields.appendChild(intro);
    console.log('name', categoryGroupName)
    console.log('here', this.category.filter((group)=>group.categoryGroup == categoryGroupName))
    const categories = this.category.filter((group)=>group.categoryGroup == categoryGroupName)[0].categories
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
    
  insert = ()=>{
    let categories = {}
    let keys = Object.keys(this.InsertedID);
    keys.forEach((id)=>{
      let text = this.InsertedID[id].innerHTML;
      categories[id] = text.substring(6);
    })
    
      
    if (keys.length > 0){
      let input_row = document.getElementById('row_number').value;
      let row_num = input_row&&input_row!='' ? Number.parseInt(input_row):undefined
      this.callback(categories, row_num);
    }
  }
    
  insertOptions = ()=>{
    let input_fields = document.getElementById('FinalLayer');
      if (input_fields){
      if (input_fields.selectedIndex){
        const text = input_fields[input_fields.selectedIndex].text;
        const id = input_fields[input_fields.selectedIndex].id
        if (!this.InsertedID[id]){
          let pnode = document.createElement('P');
          pnode.setAttribute("id", id);
          let textnode = document.createTextNode(text);
          pnode.appendChild(textnode);
          let selected = document.getElementById("Selected Options");
          pnode.addEventListener('click', ()=>{this.deleteOption(id)});
          selected.appendChild(pnode);
          this.InsertedID[id] = pnode;
        }
      }
    }
  }

  deleteOption = (id)=>{
    let selected_field = document.getElementById('Selected Options');
    selected_field.removeChild(this.InsertedID[id])
    delete this.InsertedID[id];
  }

  render(){
    return (
      <Dialog onClose={()=>{}} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
          <div id="formSection">
              <form>
                  <select name="category_name" id="category_name" onChange={this.updateCategory}>
                  <option>Please select a Catagory</option>
                  </select>
              </form>

              <form>
                  <select name="CategoryOptions" id="CategoryOptions">
                  </select>
              </form>
          </div>
          <input type="Number" id="row_number" placeholder="Enter a row number you want to insert after (optional)"/>
              <button onClick={this.insert}>Confirm</button>
          <div id="Selected Options"></div>
      </Dialog>
   );
  }
}

export default categoryInsertMenu;