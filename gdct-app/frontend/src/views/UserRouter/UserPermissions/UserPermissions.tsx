import {
  Select,
  Input,
  MenuItem,
  makeStyles,
  useTheme,
  Chip,
  Theme,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
} from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, RouteProps, useHistory } from 'react-router';
import Swal from 'sweetalert2';
import AppSysRoleController from '../../../controllers/AppSysRole';
import usersController from '../../../controllers/Users';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';
import SysRole from '../../../types/sysrole';
import User from '../../../types/user';
type propType = { _id: string };

const useStyles = makeStyles(theme => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
  },
  container: {
    padding: theme.spacing(3),
    alignItems: 'center',
    placeItems: 'center',
    display: 'grid',
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
  formItem: {
    margin: theme.spacing(1)
  },
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

const updateUserSysRole = async (user: User, roles: string[], remove: string[]): Promise<User> => {
  const allSysRoles = await AppSysRoleController.fetch();
  for (let sysRoleString of roles) {
    const [appSys, role] = sysRoleString.split('-');
    if (
      user.sysRole.find(userSysRole => userSysRole.appSys === appSys && userSysRole.role === role)
    ) {
      // don't add duplicate role
      continue;
    }
    const foundSysRole = allSysRoles.find(
      sysRole => sysRole.appSys === appSys && sysRole.role === role,
    );
    if (foundSysRole) {
      user.sysRole.push({
        ...foundSysRole,
        org: [],
      });
    }
  }
  console.log('pre', user.sysRole, remove)
  // remove all sysRoles in remove
  user.sysRole = user.sysRole.filter(({ appSys, role }) => {
    return !remove.find(sysRoleString => {
      const [stringAppSys, stringRole] = sysRoleString.split('-')
      return appSys === stringAppSys && role === stringRole
    })
  })
  console.log('post', user.sysRole)
  return user;
};

function getStyles(sysRole: string, sysRoles: string[], theme: Theme) {
  return {
    fontWeight:
      sysRoles.indexOf(sysRole) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function UserPermissions({
  match: {
    params: { _id },
  },
}: RouteComponentProps<propType>) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [sysRoles, setSysRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | undefined>();
  const { appSysRoles }: { appSysRoles: SysRole[] } = useSelector(
    state => ({
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state).filter((sysRole: SysRole) => sysRole.isSuperRole),
    }),
    shallowEqual,
  );

  const handleChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setSysRoles(value as string[]);
  };

  const handleSubmit = async () => {
    if (!user) return;
    const name = `${user.firstName} ${user.lastName}`;
    const roles = sysRoles.reduce((acc, curr, index) => {
      const suffix: string = index === sysRoles.length ? '' : ', ';
      return `${acc}${curr}${suffix}`;
    }, '');
    const swalRes = await Swal.fire({
      title: 'Updating User',
      text: `${name} will have roles ${roles}`,
      icon: 'question',
      confirmButtonText: 'Update',
      showCancelButton: true,
    });
    if (swalRes.isConfirmed) {
      // find unselected roles out of those available
      const remove = appSysRoles.filter(appSysRole => !sysRoles.find(sysRole => {
        const [appSys, role] = sysRole.split('-')
        return appSysRole.appSys === appSys && appSysRole.role === role
      })).map(appSysRole => `${appSysRole.appSys}-${appSysRole.role}`)
      console.log('REM', remove)
      const updatedUser = await updateUserSysRole(user, sysRoles, remove);
      await usersController.update(updatedUser);
      history.push('/admin/user_management');
    }
  };

  useEffect(() => {
    dispatch(getAppSysRolesRequest());
  }, [dispatch]);

  useEffect(() => {
    (
      async () => {
        try {
          const user = await usersController.fetchById(_id)
          if (!user) return
          setUser(user)
          const appSysRoles = await AppSysRoleController.fetch()
          const matchRoles = appSysRoles.filter(sysRole => {
            return sysRole.isSuperRole && user.sysRole.find(uSysRole => {
              return uSysRole.appSys === sysRole.appSys && uSysRole.role === sysRole.role
            })
          }).map(sysRole => `${sysRole.appSys}-${sysRole.role}`)
          setSysRoles(matchRoles)
        } catch (e) {
          console.log('an error occurred')
        }

      }
    )()
  }, []);

  return (
    <Paper component="main" elevation={3} className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <Select
          fullWidth
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
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
          className={classes.formItem}
        >
          {appSysRoles.length !== 0 &&
            appSysRoles.map(sysRole => (
              <MenuItem
                key={sysRole._id}
                value={`${sysRole.appSys}-${sysRole.role}`}
                style={getStyles(sysRole._id!, sysRoles, theme)}
              >
                {`${sysRole.appSys}-${sysRole.role}`}
              </MenuItem>
            ))}
        </Select>
      </div>
      <div className={classes.formItem}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.push('/admin/user_management')}
        >
          Return
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Paper>
  );
}
