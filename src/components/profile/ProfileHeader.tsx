
import React from 'react';
import { User } from '@/context/AuthContext';

interface ProfileHeaderProps {
  user: User | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      <p className="text-muted-foreground mt-1">
        Manage your account settings and preferences.
      </p>
    </div>
  );
};

export default ProfileHeader;
