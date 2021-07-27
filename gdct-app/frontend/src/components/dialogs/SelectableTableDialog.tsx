import React from 'react';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
//@ts-ignore
import SelectableTable from '../SelectableTable';

const SelectableTableDialogActions = ({ handleClose }:{handleClose:()=>void}) => (
  <DialogActions>
    <Button color="secondary" variant="contained" onClick={handleClose}>
      Finish
    </Button>
  </DialogActions>
);

const SelectableTableDialogContent = ({ data, columns, selectedKeys, getKey, handleSelect }:
  {columns:{field:string, title:string}[], data:any, selectedKeys:any, getKey:(item:any)=>any, handleSelect:(item:any)=>void}
  ) => (
  <DialogContent>
    <SelectableTable
      columns={columns}
      data={data}
      selectedKeys={selectedKeys}
      getKey={getKey}
      handleSelect={handleSelect}
    />
  </DialogContent>
);

const SelectableTableDialog = ({
  selectedKeys,
  getKey,
  title,
  columns,
  isOpen,
  data,
  handleClose,
  handleSelect,
}:{
  columns:{field:string, title:string}[], data:any, selectedKeys:any, 
  getKey:(item:any)=>any, handleSelect:(item:any)=>void,title:string,
  isOpen:boolean, handleClose:()=>void,
}) => (
  <Dialog open={isOpen} onClose={handleClose}>
    <DialogTitle>{title}</DialogTitle>
    <SelectableTableDialogContent
      columns={columns}
      data={data}
      handleSelect={handleSelect}
      selectedKeys={selectedKeys}
      getKey={getKey}
    />
    <SelectableTableDialogActions handleClose={handleClose} />
  </Dialog>
);

export default SelectableTableDialog;
