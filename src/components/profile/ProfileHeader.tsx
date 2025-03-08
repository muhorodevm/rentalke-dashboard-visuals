
import React from 'react';
import { User } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Settings, Shield } from 'lucide-react';
import { userProfile } from '@/data/dummyData';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  user: User | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 border rounded-lg bg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar className="h-24 w-24">
          {userProfile.avatar ? (
            <AvatarImage src={userProfile.avatar} alt={user.name || ""} />
          ) : (
            <AvatarFallback className="text-2xl">
              {user.name?.substring(0, 2).toUpperCase() || ""}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge className="inline-flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Shield className="h-3.5 w-3.5 mr-1" />
                Administrator
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="mt-1 font-semibold">January 2023</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium text-muted-foreground">Last Login</p>
              <p className="mt-1 font-semibold">Today, 10:30 AM</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="mt-1 font-semibold text-green-600">Active</p>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Experienced property management professional with a focus on residential properties and client satisfaction.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileHeader;
