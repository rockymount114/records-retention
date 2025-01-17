'use client'

import { TextField, TextArea , Button} from '@radix-ui/themes'
import React from 'react'

const NewRecordPage = () => {
  return (
    <div className='mx-w-xl space-y-3'>
        <TextField.Root placeholder="City Hall">
        </TextField.Root>

        <TextArea placeholder="Location" />

        <Button>Submit New Record</Button>

    </div>
  )
}

export default NewRecordPage