import { Button, Paper, makeStyles, Typography, Table, TableRow, TableBody, TableCell } from '@material-ui/core'
import React from 'react'
import '../../images/1download.png';
import '../../images/2open.png';
import '../../images/3developer.png';
import '../../images/4addins.png';
import '../../images/5mohtool.png';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),

  }
}))

function FilesHeader() {
  return (
    <div>
      <Button download="GT.xlam" href={'../../../public/GT.xlam'} color="primary" variant="contained">Download</Button>
    </div>
  )
}

const OfflineToolHeader = () => (
  <div className="d-flex justify-content-between p-2 mb-3">
    <Typography variant="h5">Offline Tool</Typography>
  </div>
);

export default function Files() {
  const classes = useStyles()
  return (
    <div>
      <OfflineToolHeader />
      <Paper elevation={5} className={classes.paper}>
        <FilesHeader />
        <Typography variant='h6'>Instructions:</Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>1.</TableCell>
              <TableCell>
                <Typography variant="body1" >  
                  Download the tool above
                </Typography>
              </TableCell>
              <TableCell><img src="/1download.png" alt="Download Tool" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2.</TableCell>
              <TableCell>
                <Typography variant="body1" >  
                  Open an excel file to build a template
                </Typography>
              </TableCell>
              <TableCell><img src="/2open.png" alt="Open Excel" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3.</TableCell>
              <TableCell>
                <Typography variant="body1" >  
                  Ensure developer tab is visible
                </Typography>
                <Typography variant="caption">
                  If not visible check Options - Customize Ribbon and check Developer on the right list
                </Typography>
              </TableCell>
              <TableCell><img src="/3developer.png" alt="Developer Tab" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4.</TableCell>
              <TableCell>
                <Typography variant="body1" >  
                  Open 'Excel Add-Ins' and browse for the downloaded tool
                </Typography>
              </TableCell>
              <TableCell><img src="/4addins.png" alt="Excel Add-Ins" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5.</TableCell>
              <TableCell>
                <Typography variant="body1" >  
                  The MOH Tool is ready to use!
                </Typography>
              </TableCell>
              <TableCell><img src="/5mohtool.png" alt="MOH Tool" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
