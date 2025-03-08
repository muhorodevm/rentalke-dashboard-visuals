
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { propertiesData, Property, PropertyType } from '@/data/dummyData';
import { 
  Building, Search, Filter, ChevronRight, MapPin, 
  Home, Hotel, House, Plus 
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Properties = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const filteredProperties = propertiesData.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'estate':
        return <Building className="h-4 w-4 mr-1" />;
      case 'building':
        return <Hotel className="h-4 w-4 mr-1" />;
      case 'apartment':
        return <Home className="h-4 w-4 mr-1" />;
      case 'house':
        return <House className="h-4 w-4 mr-1" />;
      default:
        return <Building className="h-4 w-4 mr-1" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'under-maintenance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'under-construction':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground mt-1">
          Manage all your rental properties and real estate assets.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="estate">Estate</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="under-maintenance">Maintenance</SelectItem>
              <SelectItem value="under-construction">Construction</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="text-center">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedStatus('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  {property.image ? (
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Building className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge 
                    className={cn(
                      "absolute top-3 right-3 capitalize", 
                      getStatusColor(property.status)
                    )}
                  >
                    {property.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl truncate">{property.name}</CardTitle>
                    <Badge variant="outline" className="flex items-center">
                      {getPropertyTypeIcon(property.type)}
                      <span className="capitalize">{property.type}</span>
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-2 flex-grow">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Manager:</span>
                    <span className="font-medium">{property.manager}</span>
                  </div>
                  
                  {property.units && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Units:</span>
                      <span className="font-medium">{property.units}</span>
                    </div>
                  )}
                  
                  {property.area && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{property.area}</span>
                    </div>
                  )}
                  
                  {property.rent && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Rent:</span>
                      <span className="font-medium">{property.rent}</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-2 pb-4">
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/properties/${property.id}`} className="flex justify-between items-center">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Properties;
