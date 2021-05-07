import React, { useEffect, useState, useRef } from 'react';
import usersController from '../../../controllers/Users'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const OrgselectionMenu = (props) => {

  const [orgList, setOrglist] = useState([]);
  const [status, setStatus] = useState(false);
  const orgRef = useRef(null);

  const insert = ()=>{
    const input_fields = document.getElementById('org_name');
    console.log(input_fields)
    // @ts-ignore
    if (input_fields.selectedIndex){
      // @ts-ignore
      let text = input_fields[input_fields.selectedIndex].text;
      // @ts-ignore
      let id = input_fields[input_fields.selectedIndex].id;
      console.log(id)
      props.callback(id, text);
    }
    setStatus(false);
  }

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    usersController.fetchByEmail(currentUser).then(data=>{
      let orgArr = []
      data.sysRole.forEach(element => {
        element.org.forEach(org => {
          const {orgId, orgName} = org;
          orgArr.push({orgId, orgName})
        });
      });
      setOrglist(orgArr);
    })
  }, [status])

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={()=>{setStatus(true)}}>
        Select Organization
      </Button>
      <Dialog onClose={()=>{setStatus(false)}} aria-labelledby="simple-dialog-title" open={status} fullWidth={true}>
        <DialogTitle id="simple-dialog-title">Organization</DialogTitle>
        <div id="formSection" >
          <form>
            <select name="org_name" id="org_name" ref={orgRef}>
              <option>Please select an Organization</option>
              {orgList.map(e=><option id={e.orgId}>{e.orgId}</option>)}
            </select>
          </form>
        </div>
        <button onClick={insert}>Confirm</button>
      </Dialog>
    </div>
  );
}

export default OrgselectionMenu;