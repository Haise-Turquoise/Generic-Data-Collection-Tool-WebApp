import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import FileController from '../../controllers/File'
import path from 'path'

export default function Files() {
  const [url, setUrl] = useState<string | undefined>()

  useEffect(() => {
    FileController.offlineTool().then(setUrl)
  }, [])

  return (
    <div>
      <Button download="GT5.xlam" href={path.join(__dirname, '../../../public/GT5.xlam')} disabled={!url} color="primary" variant="contained">{url ? 'Download' : 'Loading'}</Button>
    </div>
  )
}
