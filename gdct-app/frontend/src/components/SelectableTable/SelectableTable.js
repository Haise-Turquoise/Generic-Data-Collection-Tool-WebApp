import React, { useCallback, useMemo } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import uniqid from 'uniqid';

import './SelectableTable.scss';

const CustomTableCell = ({ value, props }) => (
  <TableCell align="right" {...props}>
    {value}
  </TableCell>
);

const CustomTableCells = ({ columns, item, props }) =>
  columns.map(column => (
    <TableCell key={uniqid()} align="right" {...props}>
      {item[column.field]}
    </TableCell>
  ));

const CustomListItems = ({ columns, data, selectedKeys, getKey, handleSelect }) =>
  data.map(item => {
    const handleClick = useCallback(() => handleSelect(item), [handleSelect]);

    const isSelected = useMemo(() => getKey && selectedKeys[getKey(item)], [selectedKeys, getKey]);

    const key = useMemo(() => (getKey ? getKey(item) : uniqid()), [getKey, item]);

    return (
      <TableRow
        key={key}
        className={`list__item ${isSelected ? 'list__item--selected' : ''}`}
        onClick={handleClick}
      >
        <CustomTableCells columns={columns} item={item} />
      </TableRow>
    );
  });

const CustomTableBody = ({ columns, data, selectedKeys, getKey, handleSelect }) => (
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

const CustomTableColumns = ({ columns }) =>
  columns.map(column => <CustomTableCell key={uniqid()} value={column.title} />);

const CustomTableHead = ({ columns }) => (
  <TableHead>
    <TableRow>
      <CustomTableColumns columns={columns} />
      {/* <TableCell align="right">isActive</TableCell> */}
    </TableRow>
  </TableHead>
);

const CustomTable = ({ columns, selectedKeys, getKey, data, handleSelect }) => {
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
