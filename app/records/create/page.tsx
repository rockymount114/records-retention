import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createRecordAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import LocationInput from '@/components/form/LocationInput';
import OwnersInput from '@/components/form/OwnerInput';
import StatusInput from '@/components/form/StatusInput';
import ContentInput from '@/components/form/ContentInput';
import DispositionInput from '@/components/form/DispositionInput';
import RetentionInput from '@/components/form/RetentionInput';

async function CreateRecordPage() {

    return (<section>

        <h1 className='text-2xl font-semibold mb-8 capitalize'>Create a record</h1>
        <div className='border p-8 rounded-md'>
          <h3 className='text-lg mb-4 font-medium'>General Info</h3>

          <FormContainer action={createRecordAction}>

            <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput
              name='site'
              type='text'
              label='Site'
              defaultValue='City Hall'
            />
            <FormInput
              name='box'
              type='text'
              label='Box'
              defaultValue=''
            />
            <FormInput
              name='location'
              type='text'
              label='Location (Row/Rack/Shelf/Space)'
              defaultValue=''
            />

            {/* <LocationInput/> */}
            <OwnersInput/>
            <DispositionInput/>

            <StatusInput/>
            <RetentionInput/>
            <ContentInput name='content' label='Content'/>

            </div>
          <SubmitButton text='Create a New Record' className='mt-12'/>
          </FormContainer>
          </div>
    </section>
      
    );
  }
  export default CreateRecordPage;