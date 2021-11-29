import React, { useMemo, useEffect, useState } from 'react';
import moment from 'moment';

import FindInPageIcon from '@material-ui/icons/FindInPage';
import MaterialTable, { Action, Column, Options } from 'material-table';
import { Paper, Typography, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Button } from '@material-ui/core';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import {
  calculateOptions, formatTimestamp,
} from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import SubmissionStatusController from '../../controllers/SubmissionStatus';
import SubmissionNoteController from '../../controllers/submissionNote'
import SubmissionStatus from '../../types/submissionstatus';
import SubmissionNote from '../../types/submissionnote';

const SubmissionStatusHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Submission Status Report</Typography>
    </Paper>
  );
};

const SubmissionStatusTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus[] | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState('')
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  const handleOpen = (rowData: SubmissionStatus) => {
    if (!rowData.status || !rowData.submission || !rowData.submissionNote.submissionId) {
      return
    }
    // get all submission notes
    (async () => {
      const noteFilter: string[] = []
      let notes: SubmissionNote[] = await SubmissionNoteController.fetchBySubmissionId(rowData.submissionNote.submissionId)
      notes = notes
        .sort((a, b) => Date.parse(a.updatedDate) - Date.parse(b.updatedDate))
        .filter(note => !noteFilter.includes(note.role))
      setDetail(notes.reduce((acc, curr) => {
        const logtime = new Date(curr.updatedDate);
        curr.updatedDate = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
        return acc.concat(`- ${curr.role} by ${curr.updatedBy} on ${curr.updatedDate}\n`)
      }, ''))
      setOpen(true)
    })()
  }

  const handleClose = () => {
    setOpen(false)
    setDetail('Loading...')
  }

  const statusLookup: {[key: string]: string} = {}

  useEffect(() => {
    SubmissionStatusController.fetch().then((res: unknown) => {
      if (!res || !Array.isArray(res)) {
        setStatus('NOT ALLOWED')
        return
      }
      (res as SubmissionStatus[]).forEach((subStat) => {
        if (!subStat.subIndex) {
          subStat.submission = { name: 'Not Submitted' }
          subStat.status = { name: 'Not Opened' }
        }
        if (!statusLookup[subStat.status!.name]) {
          statusLookup[subStat.status!.name] = subStat.status!.name
        }
      })
      setSubmissionStatus(res as SubmissionStatus[])
    })
  }, [])

  // table vars for loading
  const preColumns: Column<SubmissionStatus>[] = [{ title: 'Name', field: 'name', filtering: false }];
  const prePackageStatus: SubmissionStatus[] = [
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
        submissionId: '',
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
      reportingPeriod: {
        submissionClosed: false,
      }
    },
  ];

  // Convert Date format
  submissionStatus?.forEach((subStatus: SubmissionStatus)  => {
    subStatus.submissionNote.updatedDate = formatTimestamp(subStatus.submissionNote.updatedDate);
  });

  // Prepare the columns for material table
  const columns: Column<SubmissionStatus>[] = useMemo(
    () => [
      { title: 'Package', field: 'name' },
      { title: 'Template', field: 'template.name' },
      { title: 'Template Type', field: 'templateType.name' },
      { title: 'Reporting Period', field: 'submissionPeriod.name' },
      { title: 'Org ID', field: 'org.id' },
      { title: 'Organization', field: 'org.name' },
      { title: 'Submission', field: 'submission.name' },
      { title: 'Status', field: 'status.name', lookup: statusLookup },
      { title: 'isOpen', field: 'reportingPeriod.submissionClosed', lookup: {false: 'Open', true: 'Closed'}},

      { title: 'Updated At', field: 'submissionNote.updatedDate' },
    ],
    [],
  );

  const options: Options<SubmissionStatus> = useMemo(() => ({...calculateOptions(readRowNum), filtering: true}), [readRowNum]);

  const actions: ((rowData: SubmissionStatus) => Action<SubmissionStatus>)[] = [
    (actionRowData: SubmissionStatus) => ({
      icon: () => <FindInPageIcon />, 
      tooltip: "Detail Information",
      onClick: (_: any, rowData: SubmissionStatus | SubmissionStatus[]) => {
        if (!Array.isArray(rowData)) {
          handleOpen(rowData);
        }
      },
      hidden: !actionRowData.status || actionRowData.status.name === 'Not Opened'
    })
  ]

  useEffect(()=>{
    setRowNum(submissionStatus?.length || 1)
  }, [submissionStatus])

  return (
    <div>
      <MaterialTable
        key={readRowNum}
        columns={!!submissionStatus ? columns : preColumns}
        data={!!submissionStatus ? submissionStatus : prePackageStatus}
        actions={!!submissionStatus ? actions : undefined}
        options={options}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-title">{"Detailed Submission Information:"}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{whiteSpace: 'pre-wrap'}}> 
            {detail}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// any type since no props used in table
const SubmissionStatuses = (props: any) => (
  <div className="programsPage">
    <SubmissionStatusHeader />
    <ErrorBanner
      title={'Cannot delete the selected program since it is referenced in the master value table'}
      targetStore={selectProgramsStore}
    />
    <SubmissionStatusTable {...props} />
  </div>
);

export default SubmissionStatuses;
