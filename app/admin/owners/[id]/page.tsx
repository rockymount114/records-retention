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
  const [activeMenu, setActiveMenu] = useState('owners');
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
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeMenu === 'owners' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveMenu('owners')}
                >
                  Owners Management
                </Button>
              </li>
              {/* Add more menu items here as needed */}
              <li>
                <Button
                  variant={activeMenu === 'other' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveMenu('other')}
                >
                  Other Menu Item
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content - Loading State */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">Loading owner details...</p>
          </div>
        </div>
        
        <Toaster />
      </div>
    );
  }

  if (!owner && !isFetching) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeMenu === 'owners' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveMenu('owners')}
                >
                  Owners Management
                </Button>
              </li>
              {/* Add more menu items here as needed */}
              <li>
                <Button
                  variant={activeMenu === 'other' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveMenu('other')}
                >
                  Other Menu Item
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content - Not Found State */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Owner Not Found</h1>
            <p className="mb-4">The owner you're looking for does not exist.</p>
            <Button onClick={() => router.push('/admin')}>Back to Owners</Button>
          </div>
        </div>
        
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant={activeMenu === 'owners' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => router.push('/admin')}
              >
                Owners Management
              </Button>
            </li>
            {/* Add more menu items here as needed */}
            <li>
              <Button
                variant={activeMenu === 'other' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveMenu('other')}
              >
                Other Menu Item
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Edit Owner</h1>
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
              </div>

              <div className="space-y-4">
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
      </div>
      
      <Toaster />
    </div>
  );
}