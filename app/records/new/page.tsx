'use client'


import React from 'react'
import { useForm } from 'react-hook-form';

interface RecordForm {
    site: string;
    locationId: number;
    ownerId: number;
    boxId: number;
    status: string;
    disposition: string;
    retention: number;
    content: string;
    reviewDate: Date;
    deleteDate: Date;

}

const NewRecordPage = () => {
    useForm<RecordForm>({
        defaultValues: {
            site: '',
            locationId: 0,
            ownerId: 0,
            boxId: 0,
            status: '',
            disposition: '',
            retention: 0,
            content: '',
            reviewDate: new Date(),
            deleteDate: new Date(),
        }
    })
  return (
    <form className='mx-w-xl space-y-3'>
        {/* <TextField.Root placeholder="City Hall"></TextField.Root>

        <TextField.Root placeholder="Location" />
        <TextField.Root placeholder="Owner" />
        <TextField.Root placeholder="Retention" />
        <TextField.Root placeholder="Record Date" />

        <TextArea placeholder="Content" />

        <Button>Submit New Record</Button> */}

    </form>
  )
}

export default NewRecordPage