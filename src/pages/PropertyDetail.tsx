
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertiesData, Property } from '@/data/dummyData';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  Home, 
  Ruler, 
  Building, 
  Hotel, 
  House,
  Edit,
  Trash2,
  Share2,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundProperty = propertiesData.find(p => p.id === id);
      setProperty(foundProperty || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'estate':
        return <Building className="h-5 w-5" />;
      case 'building':
        return <Hotel className="h-5 w-5" />;
      case 'apartment':
        return <Home className="h-5 w-5" />;
      case 'house':
        return <House className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Occupied</Badge>;
      case 'under-maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Maintenance</Badge>;
      case 'under-construction':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Under Construction</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleContactManager = () => {
    toast({
      title: "Contact Request Sent",
      description: "The property manager has been notified of your inquiry.",
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-60 bg-muted rounded-md"></div>
        <div className="h-80 w-full bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Property Not Found</h2>
          <p className="text-muted-foreground">The property you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" asChild>
            <Link to="/properties">Return to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/properties">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-lg overflow-hidden border">
          <AspectRatio ratio={16 / 9}>
            <img
              src={property.image || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="absolute top-4 right-4 flex gap-2">
            {getStatusBadge(property.status)}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button size="sm" variant="secondary">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getPropertyTypeIcon(property.type)}
                    <span className="text-sm font-medium capitalize">{property.type}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{property.name}</h2>
                  <p className="text-muted-foreground">{property.address}</p>
                </div>
                <div className="text-right">
                  {property.rent && (
                    <div className="text-2xl font-bold text-primary">{property.rent}</div>
                  )}
                  {property.area && (
                    <div className="flex items-center justify-end text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4 mr-1" />
                      {property.area}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{property.description || 'No description available.'}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {property.units && (
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="font-bold">{property.units}</span>
                    <span className="text-xs text-muted-foreground">Units</span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="font-bold">{new Date(property.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="text-xs text-muted-foreground">Added</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="font-bold capitalize">{property.status}</span>
                  <span className="text-xs text-muted-foreground">Status</span>
                </div>
                {property.area && (
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                    <Ruler className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="font-bold">{property.area}</span>
                    <span className="text-xs text-muted-foreground">Area</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="manager">Manager Info</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        24/7 Security
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Backup Generator
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Ample Parking
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        High-speed Internet
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Water Storage
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Landscaped Gardens
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Additional Information</h3>
                    <p className="text-muted-foreground">
                      Available for immediate occupation. Viewing can be arranged by contacting the property manager.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="manager" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${property.manager}&background=0D8ABC&color=fff`} />
                      <AvatarFallback>{property.manager.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{property.manager}</h3>
                      <p className="text-sm text-muted-foreground">Property Manager</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleContactManager}>Contact Manager</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full">Schedule Viewing</Button>
                <Button variant="outline" className="w-full">Download Details</Button>
                <Button variant="ghost" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Property
                </Button>
              </div>
            </CardContent>
          </Card>

          {property.type === 'building' && property.units && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Units Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Units</span>
                    <span className="font-medium">{property.units}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium text-green-600">
                      {Math.floor(property.units * 0.3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Occupied</span>
                    <span className="font-medium">
                      {Math.floor(property.units * 0.7)}
                    </span>
                  </div>
                  <Separator />
                  <div className="text-center pt-2">
                    <Button variant="link">View All Units</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Location</h3>
              <div className="rounded-md overflow-hidden border bg-muted aspect-square flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Map view available on click</p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {property.address}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
