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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Owner = {
  id: number;
  ownername: string;
  ownerlong: string;
  status: string;
  contact: string;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOwners, setIsLoadingOwners] = useState(true);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [activeMenu, setActiveMenu] = useState('owners');
  const [formData, setFormData] = useState({
    ownername: '',
    ownerlong: '',
    status: 'Active',
    contact: '',
    owner: '',
  });

  // Fetch owners on initial load
  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setIsLoadingOwners(true);
    try {
      const response = await fetch('/api/owners');
      
      console.log('Fetch owners response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch owners: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched owners data:', data);
      
      if (Array.isArray(data)) {
        setOwners(data);
      } else {
        console.error('Expected array but got:', typeof data);
        toast({
          title: 'Data Format Error',
          description: 'Owner data is not in the expected format',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch owners. Please check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingOwners(false);
    }
  };

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
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Create owner response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to create owner: ${response.status}`);
      }

      const newOwner = await response.json();
      console.log('Created owner:', newOwner);
      
      toast({
        title: 'Success',
        description: 'Owner created successfully',
      });

      // Reset form
      setFormData({
        ownername: '',
        ownerlong: '',
        status: 'Active',
        contact: '',
        owner: '',
      });
      
      // Manually add the new owner to the list without refetching
      if (newOwner && newOwner.id) {
        setOwners(prev => [newOwner, ...prev]);
      }
      
      // Also refresh the owners list to be safe
      fetchOwners();
    } catch (error) {
      console.error('Error creating owner:', error);
      toast({
        title: 'Error',
        description: 'Failed to create owner. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col h-screen">
        {/* Add New Owner Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-6">Add New Owner</h1>
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
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Owner'}
              </Button>
            </div>
          </form>
        </div>

        {/* Owners List with Scrollbar */}
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b">Owners List</h2>
          
          <div className="overflow-y-auto flex-1">
            {isLoadingOwners ? (
              <div className="py-8 text-center text-gray-500">
                Loading owners...
              </div>
            ) : owners && owners.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell>{owner.id}</TableCell>
                        <TableCell>{`${owner.ownername} ${owner.ownerlong}`}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(owner.status)}>
                            {owner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{owner.contact}</TableCell>
                        <TableCell>
                          {new Date(owner.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/owners/${owner.id}`)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No owners found. Create your first owner above.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}