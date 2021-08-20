import { Button } from '@material-ui/core'
import React from 'react'
import path from 'path'

export default function Files() {

  return (
    <div>
      <Button download="GT5.xlam" href={path.join(__dirname, '../../../public/GT5.xlam')} color="primary" variant="contained">Download</Button>
    </div>
  )
}
