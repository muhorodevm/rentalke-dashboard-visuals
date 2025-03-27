
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, ArrowUpDown, MoreHorizontal, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Define interfaces for property data
interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface PropertyDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'pending';
  units: number;
  rent: number;
  owner: PropertyOwner;
  createdAt: string;
  imageUrl?: string;
}

interface PropertyResponse {
  properties: PropertyDetail[];
  totalCount: number;
}

// Mock API function - replace with actual API call
const fetchProperties = async (): Promise<PropertyResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    properties: [
      {
        id: 'prop1',
        name: 'Sunset Gardens Estate',
        address: '123 Sunset Blvd',
        city: 'Los Angeles',
        type: 'Residential',
        status: 'available',
        units: 24,
        rent: 2500,
        owner: {
          id: 'owner1',
          name: 'Devon Lane',
          email: 'devon@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        createdAt: '2023-01-15',
        imageUrl: 'https://images.unsplash.com/photo-1600047509807-f8e71bbe9d74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'
      },
      {
        id: 'prop2',
        name: 'Green Towers',
        address: '456 Green Ave',
        city: 'New York',
        type: 'Commercial',
        status: 'occupied',
        units: 120,
        rent: 4000,
        owner: {
          id: 'owner2',
          name: 'Jane Cooper',
          email: 'jane@example.com',
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        createdAt: '2023-02-20',
        imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        id: 'prop3',
        name: 'Riverside Apartments',
        address: '789 River Dr',
        city: 'Chicago',
        type: 'Residential',
        status: 'maintenance',
        units: 56,
        rent: 1800,
        owner: {
          id: 'owner3',
          name: 'Esther Howard',
          email: 'esther@example.com',
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        createdAt: '2023-03-05',
        imageUrl: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        id: 'prop4',
        name: 'Westlands Commercial Plaza',
        address: '101 Business Park',
        city: 'San Francisco',
        type: 'Commercial',
        status: 'pending',
        units: 45,
        rent: 5000,
        owner: {
          id: 'owner1',
          name: 'Devon Lane',
          email: 'devon@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        createdAt: '2023-04-10',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
    ],
    totalCount: 4
  };
};

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Fetch properties using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    meta: {
      onError: (err: Error) => {
        toast({
          title: "Error loading properties",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });
  
  // Filter properties based on search term
  const filteredProperties = data?.properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Helper function to render property status badge
  const getStatusBadge = (status: PropertyDetail['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Maintenance</Badge>;
      case 'pending':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Render property card skeleton during loading
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="aspect-video relative">
          <Skeleton className="absolute inset-0" />
        </div>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-2/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your real estate portfolio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="sm:ml-auto w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" /> 
          Filter
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem>Newest first</DropdownMenuItem>
            <DropdownMenuItem>Oldest first</DropdownMenuItem>
            <DropdownMenuItem>Highest rent</DropdownMenuItem>
            <DropdownMenuItem>Lowest rent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {error ? (
        <div className="py-12 text-center">
          <p className="text-destructive text-lg mb-4">Failed to load properties</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg mb-2">No properties found</p>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredProperties.map(property => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/properties/${property.id}`}>View Details</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Property</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Remove Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    {property.address}, {property.city}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{property.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.units} {property.units === 1 ? 'unit' : 'units'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${property.rent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(property.status)}
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={property.owner.avatar} />
                        <AvatarFallback>
                          {property.owner.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {property.owner.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <a href={`/properties/${property.id}`}>View Details</a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
