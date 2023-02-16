import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
//@ts-ignore
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getOrganizationGroupRequest } from '../../store/thunks/organizationgroup';
//@ts-ignore
import { selectIsOrganizationGroupDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectOrganizationGroupStore } from '../../store/OrganizationGroupStore/selectors';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
import OrganizationGroup from '../../types/organizationgroup';
import { state } from '../../store/types';
const OrganizationGroupDialog = ({ selectedOrganizationGroups, handleChange, shouldClose = true }:{
  selectedOrganizationGroups:OrganizationGroup[],
  handleChange:(data:OrganizationGroup)=>void,
  shouldClose:boolean,
}) => {
  const dispatch = useDispatch();

  const { isOrganizationGroupDialogOpen, organizationgroup } = useSelector(
    (state: state) => ({
      isOrganizationGroupDialogOpen: selectIsOrganizationGroupDialogOpen(state),
      organizationgroup: selectFactoryRESTResponseTableValues(selectOrganizationGroupStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_ORGANIZATION_GROUP_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    (data: any) => {
      handleChange(data);
      if (shouldClose) handleClose();
    },
    [dispatch, shouldClose, handleChange],
  );

  useEffect(() => {
    if (isOrganizationGroupDialogOpen && !organizationgroup.length) dispatch(getOrganizationGroupRequest());
  }, [dispatch, isOrganizationGroupDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  const getKey:any = selectedOrganizationGroups ? (t:OrganizationGroup) => t._id : undefined;
  
  // Sort the organizationgroups alphabaticly 
  const sortedOrganizationGroup = organizationgroup.sort((a:OrganizationGroup, b:OrganizationGroup)=>a.name.localeCompare(b.name))

  return (
    <SelectableTableDialog
      title="OrganizationGroup"
      columns={columns}
      isOpen={isOrganizationGroupDialogOpen}
      data={sortedOrganizationGroup}
      getKey={getKey}
      selectedKeys={selectedOrganizationGroups}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default OrganizationGroupDialog;
