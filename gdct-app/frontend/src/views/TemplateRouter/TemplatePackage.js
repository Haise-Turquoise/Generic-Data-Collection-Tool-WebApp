import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { Button, TextField, Paper, Typography,
         List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
import CreateAuditLog from '../AuditLog_Global';
import templatePackageController from '../../controllers/templatePackage';

// The header or the title of this page
const Header = () => (
  <div className="d-flex justify-content-between p-2 mb-3">
    <Typography variant="h5">Template Packages</Typography>
  </div>
);

const CustomButton = ({ text, handleClick }) => (
  <Button onClick={handleClick} size="small" className="p-0" variant="contained" color="primary">
    {text}
  </Button>
);

// children is a built in property, so even without passing in, it still exists
const CustomField = ({ label, children, addButton = false, handleClick = null }) => (
  <div className="mb-2 mt-3">
    <div className="d-flex justify-content-between">
      <span className={`align-baseline ${addButton ? 'mr-5' : ''}`}>{label}</span>
      {addButton && <CustomButton text="Add" handleClick={handleClick} />}
    </div>
    {children}
  </div>
);

// For showing Status and Submission Period on the left side
const FirstSection = ({ values, handleChangeStatus, handleChangeSubmissionPeriod }) => (
  <div>
    <CustomField label="Status">
      <StatusIdButton 
        value={values.statusId.name} 
        onChange={handleChangeStatus} isPopulated 
      />
    </CustomField>
    <CustomField label="Submission Period">
      <SubmissionPeriodIdButton
        value={values.submissionPeriodId.name}
        onChange={handleChangeSubmissionPeriod}
      />
    </CustomField>
  </div>
);

// For showing templates in the middle
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

// For showing the programs on the right side
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

// Combine all sections of Content
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

// For handling changes in each section, and popups for template and program addition
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

// Save and Back buttons at the bottom of the page
const Buttons = ({ handleSubmit }) => {
  // Redirect to the list of template packages page
  const history = useHistory();
  const redirect = () => { history.push('/admin/template/package') };
  return (
    <div>
      <Button onClick={redirect} variant="contained" color="primary" style={{marginTop: '0.8%'}}>
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="primary" style={{marginLeft: '1%', marginTop: '0.8%'}}>
        Save
      </Button>
    </div>
  )
};

const init = {
  name: '',
  submissionPeriodId: {},
  templateIds: [],
  statusId: {},
  programIds: [],
};

const TemplatePackage = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { templatePackage } = useSelector(state => {
    const templatePackage = selectFactoryValueById(selectTemplatePackagesStore)(_id)(state);
    return {
      templatePackage: templatePackage || init,
    };
  }, shallowEqual);

  useEffect(() => {
    if (_id) {
      dispatch(getTemplatePackagePopulatedRequest(_id));
    }
    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
    };
  }, [dispatch, _id]);

  const handleSubmit = useCallback(populatedData => {
    // Reformat data based on the callback of dispatch below
    const formattedTemplatePackage = {
      _id,
      name: populatedData.name,
      statusId: populatedData.statusId._id,
      submissionPeriodId: populatedData.submissionPeriodId._id,
      templateIds: populatedData.templateIds.map(({ _id }) => _id),
      programIds: populatedData.programIds.map(({ _id }) => _id),
      creationDate: populatedData.creationDate,
      timestamp: Date(),  
      updatedBy: localStorage.getItem('currentUser'),
    };

    // Find the old value before updating in order to Auditlog
    (async () => { 
      const oldTemplatePackage = await templatePackageController.fetchTemplatePackage(formattedTemplatePackage._id);
      CreateAuditLog(null, "Update Template Package", "TemplatePackage", oldTemplatePackage._id, oldTemplatePackage, formattedTemplatePackage);
    })();

    // Do Update
    const redirect = () => { history.push('/admin/template/package') };
    dispatch(updateTemplatePackageRequest(formattedTemplatePackage, redirect, null, true, populatedData));
  }, [dispatch, _id]);

  return (
    <Formik enableReinitialize initialValues={templatePackage} onSubmit={handleSubmit}>
      {props => {
        // if you wonder why handleSubmit is only passed in Formik, DON'T
        // everything is in props, components just take a portion of props that they need
        return (
          <Form>
            <Header />
            <Content {...props} />
            <Buttons {...props} />
          </Form>
        )
      }}
    </Formik>
  );
};

export default TemplatePackage;
