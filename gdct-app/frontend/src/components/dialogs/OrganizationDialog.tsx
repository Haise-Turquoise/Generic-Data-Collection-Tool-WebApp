import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
//@ts-ignore
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getOrgsRequest } from '../../store/thunks/organization';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectOrgsStore } from '../../store/OrganizationsStore/selectors';
//@ts-ignore
import { selectIsOrganizationDialogOpen } from '../../store/DialogsStore/selectors';
import { state } from '../../store/types';

const OrganizationDialog = ({ handleChange }:{handleChange:(_id:string)=>void}) => {
  const dispatch = useDispatch();

  const { isOrganizationDialogOpen, organizations } = useSelector(
    (state: state) => ({
      isOrganizationDialogOpen: selectIsOrganizationDialogOpen(state),
      organizations: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_TEMPLATE_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    (data: any) => {
      handleChange(data._id);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isOrganizationDialogOpen && !organizations.length) dispatch(getOrgsRequest());
  }, [dispatch, isOrganizationDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  return (
    //@ts-ignore
    <SelectableTableDialog
      title="Organization"
      columns={columns}
      isOpen={isOrganizationDialogOpen}
      data={organizations}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

OrganizationDialog.propTypes = {
  handleChange: PropTypes.func,
};

export default OrganizationDialog;
