import { Label } from '@/components/ui/label';
import { locations } from '@/utils/locations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'location';
function LocationsInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        {name}
      </Label>
      <Select
        defaultValue={defaultValue || locations[0].label}
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locations.map((item) => {
            return (
              <SelectItem key={item.label} value={item.label}>
                <span className='flex items-center gap-2'>
                  <item.icon /> {item.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
export default LocationsInput;