import React, { useCallback, useEffect } from 'react';

import SortableTree from 'react-sortable-tree';
import { useSelector, shallowEqual, useDispatch, batch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { useParams } from 'react-router-dom';

import {
  updateCOATreesBySheetNameRequest,
  getCOATreesBySheetNameRequest,
} from '../../../store/thunks/COATree';

import GroupDialog from './COAGroupDialog';
import COADialog from './COADialog';

import './COATree.scss';
import 'react-sortable-tree/style.css';
import COATreeStore from '../../../store/COATreeStore/store';
import DialogsStore from '../../../store/DialogsStore/store';

const DeleteButton = ({ handleClick }) => (
  <IconButton aria-label="delete" onClick={handleClick}>
    <DeleteIcon />
  </IconButton>
);

const AddButton = ({ handleClick }) => (
  <IconButton aria-label="add" onClick={handleClick}>
    <AddIcon />
  </IconButton>
);

const COATreeActions = ({ sheetNameId }) => {
  const dispatch = useDispatch();
  const handleOpenGroupDialog = useCallback(() => {
    dispatch(DialogsStore.actions.OPEN_COA_GROUP_DIALOG());
  }, [dispatch]);

  const handleSave = useCallback(
    () => dispatch(updateCOATreesBySheetNameRequest(sheetNameId, true)),
    [dispatch],
  );

  return (
    <div className="header__actions">
      <TextField className="searchBar" variant="outlined" placeholder="Search node" />
      <Button variant="contained" color="primary" onClick={handleOpenGroupDialog}>
        Add Group
      </Button>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <GroupDialog sheetNameId={sheetNameId} />
    </div>
  );
};

const COATreeHeader = ({ sheetNameId }) => {
  return (
    <Paper className="header">
      <Typography variant="h5">COA Tree</Typography>
      {/* <HeaderActions/> */}
      <COATreeActions sheetNameId={sheetNameId} />
    </Paper>
  );
};

const COATreeTreeStructure = ({ sheetNameId }) => {
  const dispatch = useDispatch();

  const { localTree } = useSelector(
    ({ COATreeStore: { localTree } }) => ({
      localTree,
    }),
    shallowEqual,
  );
  const handleChange = useCallback(
    tree => dispatch(COATreeStore.actions.UPDATE_LOCAL_COA_TREE_UI({ tree })),
    [dispatch],
  );

  const nodeProps = useCallback(
    nodeProps => {
      const handleDelete = () =>
        dispatch(COATreeStore.actions.DELETE_COA_TREE_UI({ path: nodeProps.path }));
      const handleOpenCOADialog = () => {
        batch(() => {
          dispatch(DialogsStore.actions.OPEN_COA_DIALOG());
          dispatch(COATreeStore.actions.UPDATE_SELECTED_NODE_COA_TREE_UI({ nodeProps }));
        });
      };

      return {
        buttons: [
          <AddButton key={`add-button-${nodeProps.path}`} handleClick={handleOpenCOADialog} />,
          <DeleteButton key={`delete-button-${nodeProps.path}`} handleClick={handleDelete} />,
        ],
      };
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(getCOATreesBySheetNameRequest(sheetNameId, true));
  }, [dispatch, sheetNameId]);

  return (
    <Paper className="COATreeContent">
      <SortableTree
        className="COATreeContent__sortableTree"
        treeData={localTree}
        onChange={handleChange}
        generateNodeProps={nodeProps}
      />
      <COADialog />
    </Paper>
  );
};

const COATree = () => {
  const { _id: sheetNameId } = useParams();

  return (
    <div className="COATree">
      <COATreeHeader sheetNameId={sheetNameId} />
      <COATreeTreeStructure sheetNameId={sheetNameId} />
    </div>
  );
};

export default COATree;
