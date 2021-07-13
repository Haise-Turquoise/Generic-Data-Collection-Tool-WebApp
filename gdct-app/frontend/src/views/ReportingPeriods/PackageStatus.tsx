import React, { useMemo, useEffect, useState } from 'react';

import moment from 'moment';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
//@ts-ignore
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import {
  calculateOptions,
  //@ts-ignore
} from '../../tools/misc'

//@ts-ignore
import ErrorBanner from '../ErrorBanner';
import PackageStatusController from '../../controllers/PackageStatus';
import PackageStatus from '../../types/packagestatus';

const PackageStatusHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Program</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const PackageStatusTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [packageStatus, setPackageStatus] = useState<PackageStatus[] | undefined>(undefined)

  useEffect(() => {
    PackageStatusController.fetch().then((res: unknown) => {
      setPackageStatus(res as PackageStatus[])
    })
  }, [])

  // table vars for loading
  const preColumns: Column<PackageStatus>[] = [{ title: 'Name', field: 'name' }];
  const prePackageStatus: PackageStatus[] = [
    {
      name: 'LOADING... ',
      _id: '',
      org: {
        id: 0,
        name: ''
      },
      program: {
        name: '',
        code: ''
      },
      subIndex: null,
      submissionNote: {
        updatedBy: '',
        updatedDate: '',
      },
      submissionPeriod: {
        name: '',
      },
      template: {
        name: ''
      },
      templateType: {
        name: ''
      },
    },
  ];

  // Convert Date format
  packageStatus?.forEach((pkgStatus: PackageStatus)  => {
    // console.log(pkgStatus.submissionNote.updatedDate)
    if (pkgStatus.submissionNote.updatedDate === "") {
      return
    }
    const logtime = new Date(pkgStatus.submissionNote.updatedDate);
    pkgStatus.submissionNote.updatedDate = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  // Prepare the columns for material table
  const columns: Column<PackageStatus>[] = useMemo(
    () => [
      { title: 'Package', field: 'name' },
      { title: 'Template', field: 'template.name' },
      { title: 'Template Type', field: 'templateType.name' },
      { title: 'Reporting Period', field: 'submissionPeriod.name' },
      { title: 'Org ID', field: 'org.id' },
      { title: 'Organization', field: 'org.name' },
      { title: 'Submission', field: 'submission.name' },
      { title: 'Status', field: 'status.name' },
      { title: 'Updated At', field: 'submissionNote.updatedDate' },
    ],
    [],
  );

  const options: Options<PackageStatus> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  useEffect(()=>{
    setRowNum(packageStatus?.length || 1)
  }, [packageStatus])

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!packageStatus ? columns : preColumns}
      data={!!packageStatus ? packageStatus : prePackageStatus}
      options={options}
    />
  );
};

// any type since no props used in table
const PackageStatuses = (props: any) => (
  <div className="programsPage">
    <PackageStatusHeader />
    <ErrorBanner
      title={'Cannot delete the selected program since it is referenced in the master value table'}
      targetStore={selectProgramsStore}
    />
    <PackageStatusTable {...props} />
  </div>
);

export default PackageStatuses;
