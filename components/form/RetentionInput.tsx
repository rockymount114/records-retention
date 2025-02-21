import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type RetentionInputProps = {
    defaultValue?: number;
  };

function RetentionInput() {
    const name = "retention"
  return (
        <div className="mb-2">
        
        <Label htmlFor={name} className="capitalize">{name} </Label>

        <Input id={name} name={name} type="number" min={0} max={9999} defaultValue={0} required />
     

        </div>
    
      
  )
}

export default RetentionInput