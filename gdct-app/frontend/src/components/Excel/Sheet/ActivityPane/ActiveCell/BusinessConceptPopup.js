import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { setActiveCellDialog, setGroups } from '../../../../../store/actions/ui/excel/commands';
import { getColumnNamesRequest } from '../../../../../store/thunks/columnName';
import { selectFactoryRESTResponseValues } from '../../../../../store/common/REST/selectors';
import { selectColumnNamesStore } from '../../../../../store/ColumnNamesStore/selectors';

const DialogActions = ({ handleClick }) => (
  <Button fullWidth onClick={handleClick}>
    Finish
  </Button>
);

const BusinessConceptsItems = ({ businessConcepts, type }) =>
  businessConcepts.map(({ _id, ID, name }) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(
      () => dispatch(setGroups({ category: type, id: _id, columnName: name })),
      [dispatch],
    );

    return (
      <ListItem
        key={_id}
        className="businessConcepts__item"
        alignItems="flex-start"
        button
        onClick={handleClick}
      >
        <div className="businessConcepts__id">{ID}</div>
        <div className="businessConcepts__value">{name}</div>
      </ListItem>
    );
  });

const BusinessConceptsList = ({ businessConcepts, type }) => (
  <List className="businessConcepts">
    <BusinessConceptsItems type={type} businessConcepts={businessConcepts} />
  </List>
);

const BusinessConceptDialog = ({ type }) => {
  const [filter, setFilter] = useState('');

  const dispatch = useDispatch();

  const { columnNames } = useSelector(state => ({
    columnNames: selectFactoryRESTResponseValues(selectColumnNamesStore)(state),
  }));

  console.log(columnNames);

  useEffect(() => {
    dispatch(getColumnNamesRequest());
  }, [dispatch]);

  const textFieldRef = useRef();

  useEffect(() => {
    textFieldRef.current.focus();
  }, [textFieldRef]);

  const handleChangeFilter = ({ target: { value } }) => setFilter(value);
  const handleClick = () => textFieldRef.current.focus();

  const handleCloseDialog = () => dispatch(setActiveCellDialog(''));

  return (
    <div className="dialog" onClick={handleClick}>
      <Typography variant="h6">Set {type}</Typography>
      <TextField
        placeholder="Search concepts"
        inputRef={textFieldRef}
        onChange={handleChangeFilter}
      />
      <BusinessConceptsList type={type} businessConcepts={columnNames} />
      <DialogActions handleClick={handleCloseDialog} />
    </div>
  );
};

export default BusinessConceptDialog;
