import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import { RouteComponentProps, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';

import MaterialTable, { Column, MTableCell, Options } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//@ts-ignore
import { getUsersRequest } from '../../../store/thunks/users';
//@ts-ignore
import { getOrgsRequest } from '../../../store/thunks/organization';
//@ts-ignore
import { getProgramsRequest } from '../../../store/thunks/program';
//@ts-ignore
import { getTemplateTypesRequest } from '../../../store/thunks/templateType';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
//@ts-ignore
} from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectUsersStore } from '../../../store/UsersStore/selectors';
//@ts-ignore
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';
//@ts-ignore
import { selectProgramsStore } from '../../../store/ProgramsStore/selectors';
//@ts-ignore
import { selectTemplateTypesStore } from '../../../store/TemplateTypesStore/selectors';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc'
//@ts-ignore
import Loading from '../../../components/Loading';
//@ts-ignore
import UserController from '../../../controllers/user'

import Swal, { SweetAlertResult } from 'sweetalert2'

import User from '../../../types/user';
import Organization from '../../../types/organization';
import Program from '../../../types/program';
import TemplateType from '../../../types/templatetype';
type propType = { _id?: string }

interface TableData {
  user: string,
  date: string,
  organization: string,
  program: string,
  template: string,
  permission: string,
  appsys: string,
  rawKey: string,
}

interface RawData {
  appSys: string,
  creationDate: string,
  email: string,
  firstName: string,
  lastName: string,
  orgId: string,
  orgName: string,
  phoneNumber: string,
  programCode: string,
  programId: string,
  rawKey: string,
  role: string,
  templateCode: string,
  templateTypeId: string,
  username: string,
}

const HeaderActions = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">User Info</Typography>
    </Paper>
  );
};

const UserInfo = ({
  match: {
    params: { _id },
  },
}: RouteComponentProps<propType>) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getUsersRequest());
    dispatch(getOrgsRequest());
    dispatch(getProgramsRequest());
    dispatch(getTemplateTypesRequest());
  }, [dispatch]);

  const { userObject, isCallInProgress, organizations, programs, templateTypes }: {
    userObject: User,
    isCallInProgress: boolean,
    organizations: Organization[],
    programs: Program[],
    templateTypes: TemplateType[],
  } = useSelector(
    state => ({
      userObject: (selectFactoryRESTResponseTableValues(selectUsersStore)(state).filter(
        (elem: User) => elem._id == _id,
      ) || [{}])[0],
      isCallInProgress:
        selectFactoryRESTIsCallInProgress(selectUsersStore)(state) ||
        selectFactoryRESTIsCallInProgress(selectOrgsStore)(state) ||
        selectFactoryRESTIsCallInProgress(selectProgramsStore)(state) ||
        selectFactoryRESTIsCallInProgress(selectTemplateTypesStore)(state) ||
        false,
      organizations: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
      programs: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
      templateTypes: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state),
    }),
  );

  // parses user object for raw/table data
  const parseUser = (user: User): RawData[] => {
    const rawData: RawData[] = []
    for (let sysRole of user.sysRole) {
      for (let org of sysRole.org) {
        for (let prog of org.program) {
          for (let template of prog.template) {
            // add to rawData
            rawData.push({
              appSys: sysRole.appSys,
              creationDate: user.creationDate,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              orgId: org.orgId,
              orgName: org.orgName,
              phoneNumber: user.phoneNumber,
              programCode: prog.programCode,
              programId: prog.programId,
              rawKey: rawData.length.toString(),
              role: sysRole.role,
              templateCode: template.templateCode,
              templateTypeId: template.templateTypeId,
              username: user.username
            })
          }
        }
      }
    }
    return rawData
  }

  // raw data for communication with backend
  const [raw, updateRaw] = useState<RawData[]>([])
  // formatted data for table
  const [data, updateData] = useState<TableData[]>([]);
  const [readRowNum, setRowNum] = useState(1);

  useEffect(() => {
    if (userObject) {
      const extracted_data = parseUser(userObject)
      // rawKey links formatted data to raw data
      const organizations_map: {[key: string]: string} = {};
      const programs_map: {[key: string]: string} = {};
      const templateTypes_map: {[key: string]: string} = {};
      organizations.forEach(doc => (organizations_map[doc.id] = doc.name));
      programs.forEach(doc => (programs_map[doc._id] = doc.name));
      templateTypes.forEach(doc => (templateTypes_map[doc._id] = doc.name));
      updateRaw(extracted_data)
      updateData(() =>
        extracted_data.map(row => ({
          rawKey: row.rawKey,
          user: `Username: ${row.username}\nName: ${row.firstName} ${row.lastName}\nPhone: ${row.phoneNumber}\nEmail: ${row.email}`,
          date: `${row.creationDate}`,
          organization: `(${row.orgId})\n${
            row.orgName.length > 0 ? row.orgName : organizations_map[row.orgId]
          }`,
          program: `(${row.programCode})\n${programs_map[row.programId]}`,
          template: `${templateTypes_map[row.templateTypeId]}`,
          permission: `${row.role}`,
          appsys: `${row.appSys}`,
        })),
      );
    }
  }, [userObject, organizations, programs, templateTypes]);

  const columns: Column<TableData>[] = useMemo(
    () => [
      { title: 'User', field: 'user' },
      { title: 'Date', field: 'date' },
      { title: 'Organization', field: 'organization' },
      { title: 'Program', field: 'program' },
      { title: 'Template Type', field: 'template' },
      { title: 'Permission', field: 'permission' },
      { title: 'AppSys', field: 'appsys' },
    ],
    [],
  );

  const options: Options<TableData> = useMemo(
    () => calculateOptions(readRowNum),
    [readRowNum],
  );

  const editable = useMemo(
    () => ({
      onRowDelete: (tableData: TableData): Promise<any> => 
        new Promise((resolve, reject) => {
          const rawData = raw.find(obj => obj.rawKey === tableData.rawKey)
          if (!rawData) {
            reject('Data not found')
          }
          if (raw.length === 1) {
            // Warn user if they are about to delete last role before proceeding
            Swal.fire({
              title: 'You are about to delete the last role, this will deactivate the user.',
              showCancelButton: true,
              confirmButtonText: 'Continue',
            }).then((result: SweetAlertResult) => {
              if (result.isConfirmed) {
                UserController
                  .deletePermissionByUserEmail(rawData!.email, rawData!)
                  .then((res: unknown) => {
                    // on success remove item from list
                    updateData((prevData) => 
                      prevData.filter(data => data.rawKey !== tableData.rawKey)
                    )
                    updateRaw((prevRaw) =>
                      prevRaw.filter(raw => raw.rawKey !== tableData.rawKey)
                    )
                    resolve(res)
                  })
                  .catch((err: unknown) => reject(err))
              } else {
                reject('Action cancelled')
              }
            })
          } else {
            // if multiple roles left proceed
            UserController
              .deletePermissionByUserEmail(rawData!.email, rawData!)
              .then((res: unknown) => {
                // on success remove item from list
                updateData((prevData) => 
                  prevData.filter(data => data.rawKey !== tableData.rawKey)
                )
                updateRaw((prevRaw) =>
                  prevRaw.filter(raw => raw.rawKey !== tableData.rawKey)
                )
                resolve(res)
              })
              .catch((err: unknown) => reject(err))
          }
          
          
        }),
    }),
    [raw],
  );

  const components = useMemo(
    () => ({
      Cell: (props: any) => <MTableCell {...props} style={{ whiteSpace: 'pre-wrap' }} />,
    }),
    [],
  );

  const backButtonAction = () => {
    history.push({
      pathname: `/admin/user_management`
    })
  }

  useEffect(()=>{setRowNum(data.length)}, [data])

  return isCallInProgress ? (
    <Loading />
  ) : (
    <div className="userInfo">
      <HeaderActions />
    
      <MaterialTable
        key={readRowNum}
        components={components}
        columns={columns}
        data={data}
        editable={editable}
        options={options}
      />


      <Button
        type="button"
        className="UserInfo_SaveButton"
        color="primary"
        variant="contained"
        size="large"
        onClick={backButtonAction}
        style={{ marginTop: '0.8%' }}
        >

        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
    </div>
  );
};

export default UserInfo;
