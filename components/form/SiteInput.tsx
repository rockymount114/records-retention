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

const name = 'siteId'; // Matches form field name

interface Site {
  id: number;
  name: string;
}

function SiteInput({ defaultValue }: { defaultValue?: number }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites');
        const data = await response.json();
        setSites(data);
        
        // Set default value after data is fetched
        if (data.length > 0) {
          // Use provided defaultValue if it exists and matches a site, otherwise use first site
          const initialValue = defaultValue && data.some((site: Site) => site.id === defaultValue)
            ? defaultValue.toString()
            : data[0].id.toString();
          setSelectedSite(initialValue);
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [defaultValue]); // Add defaultValue as dependency

  if (loading) return <p>Loading sites...</p>;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Site
      </Label>
      <Select
        value={selectedSite} // Controlled component
        onValueChange={setSelectedSite} // Update state when selection changes
        defaultValue={selectedSite} // Fallback for initial render
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id.toString()}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SiteInput;