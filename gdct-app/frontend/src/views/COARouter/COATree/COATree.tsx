import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
//@ts-ignore
import SortableTree from 'react-sortable-tree';
import { useSelector, shallowEqual, useDispatch, batch } from 'react-redux';
import { Paper, Typography, Button, TextField, IconButton } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';

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
import CreateAuditLog from '../../AuditLog_Global';
import sheetNameController from '../../../controllers/sheetName';
import Swal from 'sweetalert2';
import COATreesStore from '../../../store/COATreesStore/store';

let Auditlog_Operations: string[] = [];

const DeleteButton = ({ handleClick }: { handleClick: () => void }) => (
  <IconButton aria-label="delete" onClick={handleClick}>
    <DeleteIcon />
  </IconButton>
);

const AddButton = ({ handleClick }: { handleClick: () => void }) => (
  <IconButton aria-label="add" onClick={handleClick}>
    <AddIcon />
  </IconButton>
);

const COATreeActions = ({ sheetNameId }: { sheetNameId: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleOpenGroupDialog = useCallback(() => {
    dispatch(DialogsStore.actions.OPEN_COA_GROUP_DIALOG());
  }, [dispatch]);

  const handleSave = () => {
    const res = dispatch(updateCOATreesBySheetNameRequest(sheetNameId));
    if (!res) {
      (async () => {
        const sheet = await sheetNameController.fetchById(sheetNameId);

        // Auditlog (At least one change is made)
        if (Auditlog_Operations.length > 0) {
          CreateAuditLog(
            null,
            'Update COA Tree',
            'CategoryTree',
            sheetNameId,
            { 0: `Changes happened on Sheet: ${sheet?.name}` },
            Auditlog_Operations,
          );
          Auditlog_Operations = [];
        }
      })();
      // Redirect back
      history.push('/admin/coa/tree');
    } else {
      Swal.fire({
        title: 'Error saving tree',
        text: res.toString(),
        icon: 'error',
      }).then(_res => {
        dispatch(COATreesStore.actions.FAIL_REQUEST(null))
      })
    }
  };

  return (
    <div className="header__actions">
      <TextField className="searchBar" variant="outlined" placeholder="Search node" />
      <Button variant="contained" color="primary" onClick={handleOpenGroupDialog}>
        Add Group
      </Button>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <GroupDialog sheetNameId={sheetNameId} Auditlog_Operations={Auditlog_Operations} />
    </div>
  );
};

const COATreeHeader = ({ sheetNameId }: { sheetNameId: string }) => {
  const location = useLocation<LocationState>();
  const sheetName = location.state.sheetName;
  return (
    <Paper className="header">
      <Typography variant="h5">COA Tree - {sheetName}</Typography>
      <COATreeActions sheetNameId={sheetNameId} />
    </Paper>
  );
};

const COATreeTreeStructure = ({ sheetNameId }: { sheetNameId: string }) => {
  const dispatch = useDispatch();

  const { localTree } = useSelector(
    // @ts-ignore
    ({ COATreeStore: { localTree } }) => ({
      localTree,
    }),
    shallowEqual,
  );
  const handleChange = useCallback(
    (tree:any) => dispatch(COATreeStore.actions.UPDATE_LOCAL_COA_TREE_UI({ tree })),
    [dispatch],
  );

  const nodeProps = useCallback(
    (nodeProps:any) => {
      const handleDelete = () => {
        dispatch(COATreeStore.actions.DELETE_COA_TREE_UI({ node: nodeProps }));
        if (nodeProps.node.content) {
          Auditlog_Operations.push(`Deleted Group: ${nodeProps.node.title}`);
        } else {
          Auditlog_Operations.push(
            `Deleted Node: ${nodeProps.node.title} under ${nodeProps.parentNode.title}`,
          );
        }
      };
      const handleOpenCOADialog = () => {
        batch(() => {
          dispatch(DialogsStore.actions.OPEN_COA_DIALOG());
          dispatch(COATreeStore.actions.UPDATE_SELECTED_NODE_COA_TREE_UI({ nodeProps }));
          Auditlog_Operations.push(`↓↓↓  Adding Node(s) under Group: ${nodeProps.node.title}  ↓↓↓`);
        });
      };
      if (nodeProps.node.content) {
        return {
          buttons: [
            <AddButton key={`add-button-${nodeProps.path}`} handleClick={handleOpenCOADialog} />,
            <DeleteButton key={`delete-button-${nodeProps.path}`} handleClick={handleDelete} />,
          ],
        };
      }
      return {
        buttons: [
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
      <COADialog Auditlog_Operations={Auditlog_Operations} />
    </Paper>
  );
};

interface LocationState {
  sheetName?: string,
}

const COATree = () => {
  const { _id: sheetNameId} = useParams<{ _id: string}>();  

  return (
    <div className="COATree">
      <COATreeHeader sheetNameId={sheetNameId}/>
      <COATreeTreeStructure sheetNameId={sheetNameId} />
      <Button
        variant="outlined"
        color="primary"
        href="/admin/coa/tree"
        style={{ marginTop: '0.8%' }}
      >
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
    </div>
  );
};

export default COATree;
