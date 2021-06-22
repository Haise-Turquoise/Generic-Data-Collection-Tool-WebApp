import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import spreadSheetController from '../../../../controllers/spreadSheet';
import Button from '@material-ui/core/Button';
import './CategoryInsertionMenu.scss';

// This component responsible for category insertion dialog
class categoryInsertMenu extends React.Component {
  constructor(props) {
    super(props);
    this.update_subform = this.update_subform.bind(this);
    this.insert = this.insert.bind(this);
    this.insertOptions = this.insertOptions.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.callback = this.props.callback;
    this.category = [];
    this.InsertedID = {};
    this.state = { update: false, open: false };
    this.categoryRef = React.createRef();
    this.data = [];
  }

  // Get data from server and pass it into
  componentDidMount() {
    spreadSheetController.fetchCategoryAndAttribute().then(data => {
      // TODO: change the hard code for balance sheet to the current sheet in the next line.
      const unsortedData = data['Categories'].filter(
        entry => entry['sheetName'] === 'Balance Sheet',
      );
      this.data = unsortedData.sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup));
      this.category = this.data;
    });
  }

  // Navigate to the next level of the Nested Json Array
  update_subform = caller_layer => {
    let formSection = document.getElementById('formSection');

    //onChange, remove every selection form after the target form
    let counter = 0;
    const childs = formSection.childNodes;
    let delIndex = Infinity;

    // clear the layers below that level
    for (let i = 0; i < formSection.childNodes.length; i++) {
      if (childs[i].nodeName == 'FORM') {
        counter += 1;
        if (counter > caller_layer && delIndex == Infinity) {
          delIndex = i + 1;
        }
      }

      if (i >= delIndex) {
        formSection.removeChild(formSection.childNodes[i]);
      }
    }

    while (formSection.childNodes.length >= delIndex) {
      formSection.removeChild(formSection.childNodes[formSection.childNodes.length - 1]);
    }

    const selectionList = [];

    // Obtain selection path by navigating through the Json file
    for (let i = 0; i < formSection.childNodes.length; i++) {
      let selection = formSection.childNodes[i];
      if (selection.nodeName == 'FORM') {
        let option = null;
        for (let element of selection.childNodes) {
          if (element.nodeName == 'SELECT') {
            option = element;
            break;
          }
        }
        // @ts-ignore
        selectionList.push(option[option.selectedIndex].text);
      }
    }

    let targetList = this.category;
    let fullJsonLayer = {};

    // Navigate in the Json layer
    for (let item of selectionList) {
      fullJsonLayer = targetList.filter(element => {
        return element.categoryGroup == item;
      })[0];
      targetList = fullJsonLayer.childCategory;
    }

    // Navigate in the target layer
    // If it does not have a sub category or children,
    if (fullJsonLayer.categories.length == 0 && fullJsonLayer.childCategory.length == 0) {
      const form = document.createElement('FORM');
      const select = document.createElement('SELECT');
      form.appendChild(select);
      formSection.append(form);
    } else {
      // Else, populate the new selection box with child categories or categoies
      if (fullJsonLayer.childCategory.length > 0) {
        const form = document.createElement('FORM');
        const select = document.createElement('SELECT');

        let option = document.createElement('OPTION');
        let textNode = document.createTextNode('please select an option');
        option.appendChild(textNode);
        select.appendChild(option);
        // Sort the data in place
        fullJsonLayer.childCategory.sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup));
        fullJsonLayer.childCategory.forEach(element => {
          let option = document.createElement('OPTION');
          let name = element.categoryGroup;
          let textNode = document.createTextNode(name);
          option.appendChild(textNode);
          select.appendChild(option);
        });

        // Insert option node
        fullJsonLayer.categories.sort((a, b) => a.name.localeCompare(b.name));
        fullJsonLayer.categories.forEach(element => {
          let option = document.createElement('OPTION');
          option.setAttribute('id', element.id);
          let textNode = document.createTextNode(String(element.id) + ' ' + element.name);
          option.appendChild(textNode);
          select.appendChild(option);
        });

        // @ts-ignore
        // Add change handler
        select.addEventListener('change', () => {
          this.update_subform(caller_layer + 1, this.category);
        });
        form.appendChild(select);
        formSection.append(form);
      } else {
        // Genereate the final selection layer
        const form = document.createElement('FORM');
        const select = document.createElement('SELECT');
        select.setAttribute('id', 'FinalLayer');

        let option = document.createElement('OPTION');
        let textNode = document.createTextNode('please select an option');
        option.appendChild(textNode);
        select.appendChild(option);
        fullJsonLayer.categories.sort((a, b) => a.name.localeCompare(b.name));
        fullJsonLayer.categories.forEach(element => {
          let option = document.createElement('OPTION');
          option.setAttribute('id', element.id);
          option.setAttribute('class', element.unitOfMeasure);
          let textNode = document.createTextNode(String(element.id) + ' ' + element.name);
          option.appendChild(textNode);
          select.appendChild(option);
        });

        select.addEventListener('change', () => {
          this.insertOptions();
        });
        form.appendChild(select);
        formSection.append(form);
      }
    }
    this.setState({ update: !this.state.update });
  };

  insert = () => {
    // @ts-ignore
    let categories = {};
    let keys = Object.keys(this.InsertedID);
    keys.forEach(id => {
      // @ts-ignore
      let text = this.InsertedID[id].innerText;
      let unit = this.InsertedID[id].className;
      categories[id] = [text.substring(6), unit];
    });

    if (keys.length > 0) {
      // @ts-ignore
      let input_row = document.getElementById('row_number').value;
      // @ts-ignore
      let row_num = input_row && input_row != '' ? Number.parseInt(input_row) : undefined;
      this.callback(categories, row_num);
    }
    keys.forEach(id => {
      this.deleteOption(id);
    });
    this.InsertedID = {};
    this.setState({ open: false });
  };

  insertOptions = () => {
    let input_fields = document.getElementById('FinalLayer');
    if (input_fields) {
      // @ts-ignore
      if (input_fields.selectedIndex) {
        // @ts-ignore
        const text = input_fields[input_fields.selectedIndex].text;
        // @ts-ignore
        const id = input_fields[input_fields.selectedIndex].id;
        // @ts-ignore
        const className = input_fields[input_fields.selectedIndex].className;
        if (!this.InsertedID[id]) {
          let pnode = document.createElement('P');
          pnode.setAttribute('id', id);
          pnode.setAttribute('class', className);
          let textnode = document.createTextNode(text);
          pnode.appendChild(textnode);
          let selected = document.getElementById('SelectedOptions');
          pnode.addEventListener('click', () => {
            this.deleteOption(id);
          });
          selected.appendChild(pnode);
          this.InsertedID[id] = pnode;
        }
      }
    }
  };

  deleteOption = id => {
    let selected_field = document.getElementById('SelectedOptions');
    selected_field.removeChild(this.InsertedID[id]);
    delete this.InsertedID[id];
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            this.setState({ open: true });
          }}
        >
          Insert Category
        </Button>
        <Dialog
          onClose={() => {
            this.setState({ open: false });
          }}
          aria-labelledby="simple-dialog-title"
          open={this.state.open}
          fullWidth={true}
        >
          <DialogTitle id="simple-dialog-title">Insert Category</DialogTitle>
          <div id="formSection" ref="formSection">
            <form>
              <select
                name="category_name"
                id="category_name"
                ref={this.categoryRef}
                onChange={() => {
                  this.update_subform(
                    1,
                    // @ts-ignore
                    this.category,
                  );
                }}
              >
                <option>Please select a Catagory</option>
                {this.data.map(x => (
                  <option>{x.categoryGroup}</option>
                ))}
              </select>
            </form>
          </div>
          <p id="info">Selected Categories (Click item to cancel):</p>
          <div id="SelectedOptions"></div>
          <input
            type="Number"
            id="row_number"
            placeholder="Enter a row number you want to insert at (optional)"
          />
          <button onClick={this.insert}>Confirm</button>
        </Dialog>
      </div>
    );
  }
}

export default categoryInsertMenu;
