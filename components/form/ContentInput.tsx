import { Label } from '@/components/ui/label';
import { Textare, Textarea } from '@/components/ui/textarea';

type ContentInputProps = {
    name: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
};
function ContentInput({name, label, defaultValue, placeholder }:ContentInputProps){
    return (
        <div className="mb-2">
            <Label htmlFor={name} className='capitalize'>{label} </Label>
            <Textarea             
                id={name} 
                name={name} 
                placeholder='Please input your content here'
                // defaultValue={defaultValue || tempDefaultDescription}
                className='min-h-[100px] resize-none' />
        </div>
    );
}

const tempDefaultDescription = 'here is the default content description'
export default ContentInput;