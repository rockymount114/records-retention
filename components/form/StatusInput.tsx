import { Label } from '@/components/ui/label';
import { status } from '@/utils/statuses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'status';
function StatusInput({ defaultValue }: { defaultValue?: string }) {
    const renderIcon = (IconComponent: React.ComponentType) => {
        if (!IconComponent) return null;
        return <IconComponent />;
      };
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        {name}
      </Label>
      <Select
        defaultValue={defaultValue || status[0].label}
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {status.map((item) => {
            return (
              <SelectItem key={item.label} value={item.label}>
                <span className='flex items-center gap-2'>
                {renderIcon(item.icon)}
                {item.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
export default StatusInput;