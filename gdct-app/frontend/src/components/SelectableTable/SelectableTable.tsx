import React, { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
//@ts-ignore
import uniqid from 'uniqid';
import './SelectableTable.scss';

const CustomTableCell = ({ value, props }:{value:string, props:any}) => (
  <TableCell align="right" {...props}>
    {value}
  </TableCell>
);

const CustomTableCells = ({ columns, item, props }:{columns:{field:string}[], item:{[key:string]:any},props:any}) =>
  columns.map(column => (
    <TableCell key={uniqid()} align="right" {...props}>
      {item[column.field]}
    </TableCell>
  ));

const CustomListItems = ({ columns, data, selectedKeys, getKey, handleSelect }:
  {columns:{field:string}[], data:any, selectedKeys:any, getKey:(item:any)=>string, handleSelect:(item:any)=>void} ) =>
  data.map((item:any) => {
    const [done, setDone] = useState(false);
    const handleClick = useCallback(
      (e: any) => {
        setDone(!done);
        handleSelect(item);
      },
      [handleSelect],
    );

    const isSelected = useMemo(() => getKey && selectedKeys[getKey(item)], [selectedKeys, getKey]);

    const key = useMemo(() => (getKey ? getKey(item) : uniqid()), [getKey, item]);

    return (
      <TableRow
        key={key}
        className={`list__item ${done ? 'list__item--selected' : ''}`}
        onClick={handleClick}
      >
        {/*@ts-ignore*/}
        <CustomTableCells columns={columns} item={item} />
      </TableRow>
    );
  });

const CustomTableBody = ({ columns, data, selectedKeys, getKey, handleSelect }:
  {columns:{field:string}[], data:any, selectedKeys:any, getKey:(item:any)=>string, handleSelect:(item:any)=>void}) => (
  <TableBody>
    <CustomListItems
      columns={columns}
      data={data}
      getKey={getKey}
      selectedKeys={selectedKeys}
      handleSelect={handleSelect}
    />
  </TableBody>
);

const CustomTableColumns = ({ columns }:{columns:{field:string, title:string}[]}) =>
  //@ts-ignore
  columns.map(column => <CustomTableCell key={uniqid()} value={column.title}/>);

const CustomTableHead = ({ columns }:{columns:{field:string, title:string}[]}) => (
  <TableHead>
    <TableRow>
      {/*@ts-ignore*/}
      <CustomTableColumns columns={columns} />
      {/* <TableCell align="right">isActive</TableCell> */}
    </TableRow>
  </TableHead>
);

const CustomTable = ({ columns, selectedKeys, getKey, data, handleSelect }:{
  columns:{field:string, title:string}[], data:any, selectedKeys:any, getKey:(item:any)=>string, handleSelect:(item:any)=>void
}) => {
  return (
    <Table>
      <CustomTableHead columns={columns} />
      <CustomTableBody
        columns={columns}
        data={data}
        selectedKeys={selectedKeys}
        getKey={getKey}
        handleSelect={handleSelect}
      />
    </Table>
  );
};

export default CustomTable;
