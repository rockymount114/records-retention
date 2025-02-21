'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import OwnerInput from '@/components/form/OwnerInput';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

type Owner = {
  id: number;
  ownername: string;
  ownerlong: string;
  status: string;
  contact: string;
  createdAt: string;
};



export default function EditOwnerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState({
    ownername: '',
    ownerlong: '',
    status: 'Active',
    contact: '',
    owner: '',
  });

  const id = React.use(params).id;
  // Fetch owner data on load
  useEffect(() => {
    const fetchOwner = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/owners/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch owner: ${response.status}`);
        }
        
        const data = await response.json();
        setOwner(data);
        setFormData({
          ownername: data.ownername,
          ownerlong: data.ownerlong,
          status: data.status,
          contact: data.contact,
          owner: '', // This wasn't in your model, but keeping it for OwnerInput compatibility
        });
      } catch (error) {
        console.error('Error fetching owner:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch owner details.',
          variant: 'destructive',
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchOwner();
    }
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/owners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update owner: ${response.status}`);
      }

      toast({
        title: 'Success',
        description: 'Owner updated successfully',
      });
      
      // Navigate back to owners list
      router.push('/admin');
    } catch (error) {
      console.error('Error updating owner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update owner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading owner details...</p>
      </div>
    );
  }

  if (!owner && !isFetching) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Owner Not Found</h1>
        <p className="mb-4">The owner you're looking for does not exist.</p>
        <Button onClick={() => router.push('/admin')}>Back to Owners</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Owner</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownername">Owner Name</Label>
                <Input
                  id="ownername"
                  name="ownername"
                  value={formData.ownername}
                  onChange={handleChange}
                  placeholder="Enter Owner Name"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ownerlong">Owner Name Long</Label>
                <Input
                  id="ownerlong"
                  name="ownerlong"
                  value={formData.ownerlong}
                  onChange={handleChange}
                  placeholder="Enter Owner Name Long"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact information"
                  className="mt-1"
                  required
                />
              </div>
              
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => router.push('/admin')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Update Owner'}
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}