
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building, Search, Filter, ChevronRight, MapPin, 
  Home, Hotel, House, Plus, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Define types for the API response
interface RentalUnit {
  id: string;
  name: string;
  unitType: string;
  unitSize: string;
  unitPrice: number;
  interiorFeatures: string[];
  images: string[];
  availability: 'VACANT' | 'OCCUPIED';
}

interface Building {
  id: string;
  name: string;
  noOfFloors: number;
  noOfUnits: number;
  buildingFeatures: string[];
  images: string[];
  rentalUnits: RentalUnit[];
}

interface Estate {
  id: string;
  name: string;
  noOfBuildings: number;
  county: string;
  subcounty: string;
  estateFeatures: string[];
  description: string;
  images: string[];
}

interface PropertyResponse {
  success: boolean;
  estates: Array<{
    id: string;
    name: string;
    noOfBuildings: number;
    county: string;
    subcounty: string;
    estateFeatures: string[];
    description: string;
    images: string[];
    buildings: Building[];
    manager?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

const fetchProperties = async (): Promise<PropertyResponse> => {
  const response = await fetch('https://rentalke-server-2.onrender.com/api/v1/properties/estates/all');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: 'Error fetching properties',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    },
  });

  console.log("API response:", data); // Debug log

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VACANT':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case 'OCCUPIED':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Occupied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL':
        return <Home className="h-4 w-4 mr-1" />;
      case 'COMMERCIAL':
        return <Building className="h-4 w-4 mr-1" />;
      default:
        return <House className="h-4 w-4 mr-1" />;
    }
  };

  const filteredProperties = data?.estates?.filter(estate => {
    const matchesSearch = 
      estate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estate.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estate.subcounty.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage and view all properties in your portfolio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties by name, county or subcounty..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="RESIDENTIAL">Residential</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load properties</h2>
          <p className="text-muted-foreground mt-2">
            Please try again later or contact support.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : filteredProperties && filteredProperties.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {filteredProperties.map((property) => (
            <motion.div key={property.id} variants={itemVariants} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold">{property.name}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.county}, {property.subcounty}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.estateFeatures.map((feature, idx) => (
                    <Badge key={idx} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.buildings && property.buildings.length > 0 ? (
                  property.buildings.map((building) => (
                    <Card key={building.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={building.images[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'}
                            alt={building.name}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/10 text-primary">{building.noOfUnits} Units</Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Hotel className="h-4 w-4 mr-1" />
                              <CardDescription>
                                Building
                              </CardDescription>
                            </div>
                            <CardTitle className="text-lg mt-1">{building.name}</CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">Open menu</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Building</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Building
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {building.buildingFeatures.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{building.noOfFloors}</span> floors ·{' '}
                          <span className="font-medium">{building.noOfUnits}</span> units
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex-col items-start">
                        <div className="text-sm font-medium mb-2">Rental Units</div>
                        {building.rentalUnits && building.rentalUnits.length > 0 ? (
                          <div className="space-y-2 w-full">
                            {building.rentalUnits.slice(0, 2).map(unit => (
                              <div key={unit.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md w-full">
                                <div className="flex items-center">
                                  {getPropertyTypeIcon(unit.unitType)}
                                  <span className="text-sm">{unit.name} ({unit.unitSize})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">KSh {unit.unitPrice.toLocaleString()}</span>
                                  {getStatusBadge(unit.availability)}
                                </div>
                              </div>
                            ))}
                            {building.rentalUnits.length > 2 && (
                              <Button variant="ghost" size="sm" className="w-full">
                                View all {building.rentalUnits.length} units
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No rental units available</div>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6">
                    <House className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2">No buildings available in this estate</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No properties found</h2>
          <p className="text-muted-foreground mt-2">
            No properties match your current search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Properties;
