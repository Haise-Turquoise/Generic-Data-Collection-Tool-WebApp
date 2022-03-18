import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { Button, Theme } from '@material-ui/core';
import { getAppSysRolesRequest } from '../../store/thunks/AppSysRole';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectAppSysRolesStore } from '../../store/AppSysRolesStore/selectors';
import SysRole from '../../types/sysrole';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  buttons: {},
  button: {},
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(sysRole: string, sysRoles: string[], theme: Theme) {
  return {
    fontWeight:
      sysRoles.indexOf(sysRole) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// is this function used? Can't find anything
export default function SignUp({ parentHandleChange, steps, activeStep, handleNext, handleBack }: {
  parentHandleChange: (name: string, value: unknown) => void,
  steps: string[],
  activeStep: number,
  handleNext: () => void,
  handleBack: () => void,
}) {
  const dispatch = useDispatch();
  const { appSysRoles }: { appSysRoles: SysRole[] } = useSelector(
    state => ({
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );

  const filteredSysRoles = appSysRoles.filter(role => {
    return (
      role.role === 'Business Admin' ||
      role.role === 'Template Designer' ||
      role.role === 'Template Approver'
    );
  });
  const classes = useStyles();
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ext, setExt] = useState('');
  const [sysRoles, setSysRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{phoneNumber: string}>();

  let sysRoleEmpty = true;

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 

  const handleChange = (e: ChangeEvent<{name?: string, value: unknown}>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        setTitle(value as string);
        parentHandleChange(name, value);
        break;
      case 'phoneNumber':
        setErrors({phoneNumber: ''})
        setPhoneNumber(value as string);
        if (!phoneRegExp.test(value as string)) {
          setErrors({phoneNumber: 'Error: not a phone number'})
        }
        parentHandleChange(name, value);
        break;
      case 'ext':
        setExt(value as string);
        parentHandleChange(name, value);
        break;
      case 'sysRoles':
        setSysRoles(value as string[]);
        parentHandleChange(name, sysRoles);
        break;
      default:
        break;
    }
    parentHandleChange(name || '', value);
  };

  useEffect(() => {
    dispatch(getAppSysRolesRequest());
  }, [dispatch]);

  useEffect(() => {
    console.log(sysRoles)
    if (sysRoles.length != 0){
      sysRoleEmpty = false;
    }
  }, [sysRoles])
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="title"
                name="title"
                value={title}
                variant="outlined"
                fullWidth
                id="title"
                label="Title"
                onChange={handleChange}
                autoFocus
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                error={Boolean(errors?.phoneNumber)}
                helperText={(errors?.phoneNumber)}
                value={phoneNumber}
                autoComplete="phoneNumber"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="ext"
                label="Ext"
                name="ext"
                value={ext}
                autoComplete="ext"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="demo-mutiple-chip-label">Select Role(s)</InputLabel>
              <Select
                fullWidth
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                required
                name="sysRoles"
                value={sysRoles}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected: unknown) => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(value => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {filteredSysRoles.length !== 0 &&
                  filteredSysRoles.map(sysRole => (
                    <MenuItem
                      key={sysRole._id}
                      value={`${sysRole.appSys}-${sysRole.role}`}
                      style={getStyles(sysRole._id!, sysRoles, theme)}
                    >
                      {`${sysRole.appSys}-${sysRole.role}`}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <div className={classes.buttons} style={{ marginTop: '2rem', textAlign: 'right' }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} className={classes.button}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              disabled={ sysRoles.length===0 || (Boolean(errors?.phoneNumber) && Boolean(phoneNumber))}
              onClick={ handleNext }
              className={classes.button}
              type="submit"
            >
              {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
