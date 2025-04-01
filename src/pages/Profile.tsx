
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ThemeCustomizer from '@/components/profile/ThemeCustomizer';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <ProfileHeader/>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <Card className="p-6">
            <ProfileForm/>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
            <p className="text-muted-foreground mb-4">Manage your account security settings, change password and enable two-factor authentication.</p>
            <div className="text-center py-10">
              <p>Security settings coming soon...</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
          <ThemeCustomizer/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
