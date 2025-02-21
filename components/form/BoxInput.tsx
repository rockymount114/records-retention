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

const name = 'boxId'; // Changed from 'boxNumber' to match schema

interface Box {
  id: number;
  boxNumber: number;
}

function BoxInput({ defaultValue }: { defaultValue?: number }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await fetch('/api/boxes');
        const data = await response.json();
        setBoxes(data);
      } catch (error) {
        console.error('Error fetching boxes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  if (loading) return <p>Loading boxes...</p>;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Box Number
      </Label>
      <Select
        defaultValue={defaultValue?.toString()}
        name={name} // Now 'boxId'
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {boxes.map((box) => (
            <SelectItem key={box.id} value={box.id.toString()}>
              {box.boxNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default BoxInput;