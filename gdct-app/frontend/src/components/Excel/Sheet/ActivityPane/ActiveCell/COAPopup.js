import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import { DialogActions } from './components';

import { resetActiveCellDialog, setGroups } from '../../../../../store/actions/ui/excel/commands';

import './GroupPopup.scss';
import { getCOATreesRequest } from '../../../../../store/thunks/COATree';
import { selectFactoryRESTResponseValues } from '../../../../../store/common/REST/selectors';
import { selectCOATreesStore } from '../../../../../store/COATreesStore/selectors';
import { selectCOAsStore } from '../../../../../store/COAsStore/selectors';
import { getCOAsRequest } from '../../../../../store/thunks/COA';

const LinkIcon = ({ handleClick }) => (
  <Button variant="contained" color="primary" onClick={handleClick}>
    <Icon>send</Icon>
  </Button>
);

const GroupLink = ({ index, groupId, group, handleRemoveLink, handleUpdateGroupPointer }) => {
  const handleClickLink = () => {
    handleRemoveLink(index);
  };
  const handleClickGroup = () => handleUpdateGroupPointer(index);

  return (
    <div className="groups__groupLinksItem">
      <LinkIcon handleClick={handleClickLink} />
      <Button onClick={handleClickGroup} fullWidth>
        {groupId !== null && group !== null ? `${group}` : 'EMPTY'}
      </Button>
    </div>
  );
};

const GroupLinkListItems = ({ groups, handleRemoveLink, handleUpdateGroupPointer }) =>
  groups.map(({ _id, value }, index) => {
    return (
      <GroupLink
        key={`group-link-${index}`}
        index={index}
        groupId={_id}
        group={value}
        handleRemoveLink={handleRemoveLink}
        handleUpdateGroupPointer={handleUpdateGroupPointer}
      />
    );
  });

const GroupLinkList = ({
  groups,
  handleAddNewLink,
  handleRemoveLink,
  handleUpdateGroupPointer,
}) => {
  return (
    <div className="groups__groupLinks">
      <Typography variant="h6">Group Links</Typography>
      <GroupLinkListItems
        groups={groups}
        handleUpdateGroupPointer={handleUpdateGroupPointer}
        handleRemoveLink={handleRemoveLink}
      />
      <Button
        className="groups__button"
        variant="contained"
        color="primary"
        onClick={handleAddNewLink}
      >
        Add New Group
      </Button>
    </div>
  );
};

const GroupItems = ({ groups, selectedGroup, handleSelectGroup }) =>
  groups.map(({ _id, categoryGroupId }, index) => {
    const handleClickGroup = () =>
      handleSelectGroup({ _id, value: categoryGroupId ? categoryGroupId.name : '' });
    return (
      <ListItem
        key={`groups-group-${index}`}
        className={`${selectedGroup === _id ? 'groups__groupItem' : ''}`}
        onClick={handleClickGroup}
        button
      >
        <ListItemText primary={`${categoryGroupId ? categoryGroupId.name : ''}`} />
      </ListItem>
    );
  });

const GroupList = ({
  groups,
  selectedGroup,

  handleSelectGroup,
}) => {
  return (
    <div className="groups__groupListContainer">
      <Typography variant="h6">Select Group Nodes</Typography>
      <List className="groups__groupList">
        <GroupItems
          groups={groups}
          selectedGroup={selectedGroup}
          handleSelectGroup={handleSelectGroup}
        />
      </List>
    </div>
  );
};

const COAListItems = ({ COAIds, selectedCOAIds, handleSelectCOAId }) =>
  COAIds.map(({ _id, COA, name }) => {
    const handleClick = () => handleSelectCOAId(_id);

    return (
      <ListItem
        className={selectedCOAIds[_id] ? 'groups__COA--selected' : ''}
        key={_id}
        onClick={handleClick}
        button
      >
        <ListItemText primary={`${COA ? `${COA} : ` : ''}${name} `} />
      </ListItem>
    );
  });

const COAList = ({ COAIds = [], selectedCOAIds, handleSelectCOAId }) => (
  <div className="groups__COAContainer">
    <Typography variant="h6">COAs</Typography>
    <List className="groups__COA">
      <COAListItems
        COAIds={COAIds}
        selectedCOAIds={selectedCOAIds}
        handleSelectCOAId={handleSelectCOAId}
      />
    </List>
  </div>
);

const GroupSectionContent = ({
  groups,
  definedGroups,
  selectedGroup,
  COAIds,
  selectedCOAIds,
  handleRemoveLink,
  handleUpdateGroupPointer,
  handleSelectGroup,
  handleAddNewLink,
  handleSelectCOAId,
}) => (
  <div className="groups__groupSectionContent">
    <GroupLinkList
      groups={groups}
      handleUpdateGroupPointer={handleUpdateGroupPointer}
      handleRemoveLink={handleRemoveLink}
      handleAddNewLink={handleAddNewLink}
    />
    <GroupList
      groups={definedGroups}
      selectedGroup={selectedGroup}
      handleSelectGroup={handleSelectGroup}
    />
    <COAList
      COAIds={COAIds}
      selectedCOAIds={selectedCOAIds}
      handleSelectCOAId={handleSelectCOAId}
    />
  </div>
);

const GroupSection = ({
  groups,
  definedGroups,
  COAIds,
  selectedGroup,
  selectedCOAIds,
  handleRemoveLink,
  handleUpdateGroupPointer,
  handleSelectGroup,
  handleAddNewLink,
  handleSelectCOAId,
}) => (
  <div className="groups__groupSection">
    <GroupSectionContent
      groups={groups}
      COAIds={COAIds}
      definedGroups={definedGroups}
      selectedGroup={selectedGroup}
      selectedCOAIds={selectedCOAIds}
      handleRemoveLink={handleRemoveLink}
      handleUpdateGroupPointer={handleUpdateGroupPointer}
      handleSelectGroup={handleSelectGroup}
      handleAddNewLink={handleAddNewLink}
      handleSelectCOAId={handleSelectCOAId}
    />
  </div>
);

// ! There is no need for a group pointer now
// ! TODO: Remove group pointer and just use newGroups.length
// ! TODO: Convert this to redux -- however, the excel is being reworked so might be wasted effort.
const GroupPopup = ({ type }) => {
  const [newGroups, setNewGroups] = useState([]);
  const [groupPointer, setGroupPointer] = useState(-1);
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedCOAIds, setSelectedCOAIds] = useState({});

  const AllCOAIds = useSelector(state => selectFactoryRESTResponseValues(selectCOAsStore)(state));

  const { COATrees } = useSelector(
    state => ({
      COATrees: selectFactoryRESTResponseValues(selectCOATreesStore)(state),
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCOATreesRequest());
    dispatch(getCOAsRequest());
  }, [dispatch]);

  const handleCancel = useCallback(() => dispatch(resetActiveCellDialog()), [dispatch]);

  const handleUpdateGroupPointer = index => {
    if (index < groupPointer) {
      handleRemoveLink(index + 1);
    } else {
      setGroupPointer(index);
    }
  };
  const handleRemoveLink = index => {
    const changedGroups = newGroups.slice(0, index);
    setNewGroups(changedGroups);
    setGroupPointer(index - 1);
    setSelectedCOAIds({});
    setSelectedGroup(
      changedGroups.length ? changedGroups[changedGroups.length - 1]._id : undefined,
    );
  };
  const handleSelectGroup = ({ _id, value }) => {
    setNewGroups([
      ...newGroups.slice(0, groupPointer),
      { _id, value },
      ...newGroups.slice(groupPointer + 1),
    ]);
    if (_id !== selectedGroup) {
      setSelectedGroup(_id);
      setSelectedCOAIds({});
    }
    if (groupPointer < 1) handleUpdateGroupPointer(0);
  };

  const handleAddNewLink = () => {
    // Only add groups if there are no set groups or there's at least a consecutive group link
    // ! TODO : Add group only when possible
    if ((newGroups.length && newGroups[newGroups.length - 1]._id) || !newGroups.length) {
      setNewGroups([...newGroups, { _id: null, value: null }]);
      setGroupPointer(newGroups.length);
    }
  };

  // The child nodes of the parent
  const definedGroups = useMemo(() => {
    let definedGroups;

    if (groupPointer - 1 > -1) {
      const leafId = newGroups[groupPointer - 1]._id;
      definedGroups = COATrees.filter(COATree => COATree.parentId === leafId);
    } else {
      definedGroups = COATrees.filter(COATree => !COATree.parentId);
    }

    return definedGroups;
  }, [COATrees, selectedGroup, newGroups, groupPointer]);

  // The COA Ids of the leaf node
  const COAIds = useMemo(() => {
    let ids = [];
    if (!newGroups.length) return ids;

    const groupId = newGroups[newGroups.length - 1]._id;
    const foundGroup = COATrees.find(group => group._id === groupId);
    const groupMap = new Set();

    // console.log(foundGroup)

    if (foundGroup) {
      foundGroup.categoryId.forEach(_id => groupMap.add(_id));

      ids = AllCOAIds.filter(({ _id }) => groupMap.has(_id));
    }

    return ids;
  }, [newGroups, COATrees, AllCOAIds]);

  // console.log(COAIds)

  const handleAdd = useCallback(
    () => dispatch(setGroups({ category: type, newGroups, selectedCOAIds, COAIds })),
    [dispatch, newGroups, selectedCOAIds, COAIds],
  );

  const handleSelectCOAId = id =>
    setSelectedCOAIds({ ...selectedCOAIds, [id]: !selectedCOAIds[id] });

  return (
    <div className="dialog groups">
      <Typography variant="h6">Set COA group</Typography>
      <GroupSection
        type={type}
        groups={newGroups}
        definedGroups={definedGroups}
        COAIds={COAIds}
        selectedGroup={selectedGroup}
        selectedCOAIds={selectedCOAIds}
        handleRemoveLink={handleRemoveLink}
        handleUpdateGroupPointer={handleUpdateGroupPointer}
        handleSelectGroup={handleSelectGroup}
        handleAddNewLink={handleAddNewLink}
        handleSelectCOAId={handleSelectCOAId}
      />
      <DialogActions
        addText="Apply"
        cancelText="Finish"
        handleAdd={handleAdd}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default GroupPopup;
