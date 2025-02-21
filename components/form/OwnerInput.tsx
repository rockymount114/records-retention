'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'ownerId'; // Change name to "ownerId" to match database field

interface Owner {
  id: number;
  ownername: string;
  ownerlong: string;
}

function OwnersInput({ defaultValue }: { defaultValue?: string }) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch('/api/owners');
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) return <p>Loading owners...</p>;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Owner
      </Label>
      <Select
        defaultValue={defaultValue || owners[0]?.id.toString()} // Use id as default
        name={name} // Use "ownerId" as the form field name
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {owners.map((owner) => (
            <SelectItem key={owner.id} value={owner.id.toString()}>
              {owner.ownerlong} {/* Display ownerlong, submit id */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default OwnersInput;