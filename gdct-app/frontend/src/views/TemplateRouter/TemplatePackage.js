import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Formik, Form } from 'formik';
import {
  Button,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import uniqid from 'uniqid';
import { selectTemplatePackagesStore } from '../../store/TemplatePackagesStore/selectors';
import { selectFactoryValueById } from '../../store/common/REST/selectors';

import {
  getTemplatePackagePopulatedRequest,
  updateTemplatePackageRequest,
} from '../../store/thunks/templatePackage';
import { StatusIdButton, SubmissionPeriodIdButton } from '../../components/buttons';

import TemplateDialog from '../../components/dialogs/TemplateDialog';
import { DialogsStoreActions } from '../../store/DialogsStore/store';
import { TemplatePackagesStoreActions } from '../../store/TemplatePackagesStore/store';
import ProgramDialog from '../../components/dialogs/ProgramDialog';

// ! CLEAN UP - program and template have similar structures.

const init = {
  name: '',
  submissionPeriodId: {},
  templateIds: [],
  statusId: {},
  programIds: [],
};

const CustomButton = ({ text, handleClick }) => (
  <Button onClick={handleClick} size="small" className="p-0" variant="contained" color="primary">
    {text}
  </Button>
);

const Header = ({ handleSubmit }) => (
  <div className="d-flex justify-content-between p-2 mb-3">
    <Typography variant="h5">Template Packages</Typography>
    <Button onClick={handleSubmit} variant="contained" color="primary">
      Save
    </Button>
  </div>
);

const CustomField = ({ label, children, addButton = false, handleClick }) => (
  <div className="mb-2 mt-3">
    <div className="d-flex justify-content-between">
      <span className={`align-baseline ${addButton ? 'mr-5' : ''}`}>{label}</span>
      {addButton && <CustomButton text="Add" handleClick={handleClick} />}
    </div>
    {children}
  </div>
);

const FirstSection = ({ values, handleChangeStatus, handleChangeSubmissionPeriod }) => (
  <div>
    <CustomField label="Status">
      <StatusIdButton value={values.statusId.name} onChange={handleChangeStatus} isPopulated />
    </CustomField>
    <CustomField label="Submission Period">
      <SubmissionPeriodIdButton
        value={values.submissionPeriodId.name}
        onChange={handleChangeSubmissionPeriod}
        isPopulated
      />
    </CustomField>
  </div>
);

const SecondSection = ({ values, handleRemoveTemplate }) => {
  const dispatch = useDispatch();

  const handleOpenTemplateDialog = useCallback(() => {
    dispatch(DialogsStoreActions.OPEN_TEMPLATE_DIALOG());
  }, [dispatch]);

  return (
    <div>
      <CustomField label="Templates" handleClick={handleOpenTemplateDialog} addButton>
        <List>
          {values.templateIds.map(template => (
            <ListItem key={uniqid()}>
              <ListItemText className="mr-5" primary={template.name} />
              <ListItemSecondaryAction>
                <CustomButton text="Delete" handleClick={() => handleRemoveTemplate(template)} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CustomField>
    </div>
  );
};

const ThirdSection = ({ values, handleRemoveProgram }) => {
  const dispatch = useDispatch();

  const handleOpenTemplateDialog = useCallback(() => {
    dispatch(DialogsStoreActions.OPEN_PROGRAM_DIALOG());
  }, [dispatch]);

  return (
    <CustomField label="Programs" handleClick={handleOpenTemplateDialog} addButton>
      <List>
        {values.programIds.map(program => (
          <ListItem key={uniqid()}>
            <ListItemText className="mr-5" primary={program.name} />
            <ListItemSecondaryAction>
              <CustomButton text="Delete" handleClick={() => handleRemoveProgram(program)} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </CustomField>
  );
};

const Sections = ({
  values,
  handleRemoveTemplate,
  handleRemoveProgram,
  handleChangeStatus,
  handleChangeSubmissionPeriod,
}) => (
  <div className="d-flex justify-content-between">
    <FirstSection
      values={values}
      handleChangeStatus={handleChangeStatus}
      handleChangeSubmissionPeriod={handleChangeSubmissionPeriod}
    />
    <SecondSection values={values} handleRemoveTemplate={handleRemoveTemplate} />
    <ThirdSection values={values} handleRemoveProgram={handleRemoveProgram} />
  </div>
);

const Content = ({ setFieldValue, handleChange, values }) => {
  const handleChangeField = useCallback(
    field => data => {
      setFieldValue(field, data);
    },
    [setFieldValue, values],
  );

  const handleChangeSubmissionPeriod = handleChangeField('submissionPeriodId');
  const handleChangeStatus = handleChangeField('statusId');
  const handleChangeTemplates = handleChangeField('templateIds');
  const handleChangePrograms = handleChangeField('programIds');

  const selectedTemplates = useMemo(() => {
    const selected = {};

    values.templateIds.forEach(template => (selected[template._id] = true));

    return selected;
  }, [values]);

  const selectedPrograms = useMemo(() => {
    const selected = {};

    values.programIds.forEach(program => (selected[program._id] = true));

    return selected;
  }, [values]);

  const handleAddTemplate = useCallback(
    template => {
      let newTemplates = values.templateIds.filter(({ _id }) => _id !== template._id);

      if (newTemplates.length === values.templateIds.length)
        newTemplates = [...values.templateIds, template];

      handleChangeTemplates(newTemplates);
    },
    [values, handleChangeTemplates],
  );

  const handleAddProgram = useCallback(
    program => {
      let newPrograms = values.programIds.filter(({ _id }) => _id !== program._id);

      if (newPrograms.length === values.programIds.length)
        newPrograms = [...values.programIds, program];

      handleChangePrograms(newPrograms);
    },
    [values, handleChangePrograms],
  );

  const handleRemoveTemplate = useCallback(
    template => {
      handleChangeTemplates(values.templateIds.filter(({ _id }) => _id !== template._id));
    },
    [values, handleChangeTemplates],
  );

  const handleRemoveProgram = useCallback(
    program => {
      handleChangePrograms(values.programIds.filter(({ _id }) => _id !== program._id));
    },
    [values, handleChangePrograms],
  );

  return (
    <Paper className="pl-4 pr-4 pb-5 pt-4">
      <TextField
        className="mb-3"
        name="name"
        value={values.name}
        onChange={handleChange}
        variant="outlined"
        label="Name"
        size="small"
      />
      <Sections
        values={values}
        handleRemoveTemplate={handleRemoveTemplate}
        handleChangeStatus={handleChangeStatus}
        handleChangeSubmissionPeriod={handleChangeSubmissionPeriod}
        handleRemoveProgram={handleRemoveProgram}
      />
      <TemplateDialog
        selectedTemplates={selectedTemplates}
        handleChange={handleAddTemplate}
        shouldClose={false}
      />
      <ProgramDialog
        selectedPrograms={selectedPrograms}
        handleChange={handleAddProgram}
        shouldClose={false}
      />
    </Paper>
  );
};

const TemplatePackage = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();

  const { templatePackage } = useSelector(state => {
    const templatePackage = selectFactoryValueById(selectTemplatePackagesStore)(_id)(state);

    return {
      templatePackage: templatePackage || init,
    };
  }, shallowEqual);

  useEffect(() => {
    if (_id) {
      dispatch(getTemplatePackagePopulatedRequest(_id, true));
    }
    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
    };
  }, [dispatch, _id]);

  const handleSubmit = useCallback(
    populatedData => {
      const formattedTemplatePackage = {
        _id,
        name: populatedData.name,
        statusId: populatedData.statusId._id,
        submissionPeriodId: populatedData.submissionPeriodId._id,
        templateIds: populatedData.templateIds.map(({ _id }) => _id),
        programIds: populatedData.programIds.map(({ _id }) => _id),
      };

      dispatch(
        updateTemplatePackageRequest(formattedTemplatePackage, null, null, true, populatedData),
      );
    },
    [dispatch, _id],
  );

  return (
    <Formik enableReinitialize initialValues={templatePackage} onSubmit={handleSubmit}>
      {props => (
        <Form>
          <Header {...props} />
          <Content {...props} />
        </Form>
      )}
    </Formik>
  );
};

export default TemplatePackage;
