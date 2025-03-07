
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  Mail,
  Settings as SettingsIcon,
  Database,
  Globe,
  Shield,
  Smartphone,
  Save,
  Plus,
  Trash2,
  Edit,
  AlertTriangle
} from 'lucide-react';

// Define types for email templates
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  description?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Define types for system settings
interface SystemSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
  debugMode: boolean;
  defaultBookingDuration: number;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('email-templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    variables: [] as string[],
    description: ''
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Rentalke Admin',
    logo: '/logo.png',
    primaryColor: '#3B82F6',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    debugMode: false,
    defaultBookingDuration: 7
  });
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const { toast } = useToast();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://rentalke-server-2.onrender.com/api/v1";

  useEffect(() => {
    fetchEmailTemplates();
  }, []);

  const fetchEmailTemplates = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/email-templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data.templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const token = getToken();
      await axios.post(`${API_BASE_URL}/admin/email-templates`, {
        ...newTemplate,
        variables: newTemplate.variables.filter(v => v.trim() !== '')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
      
      setIsCreatingTemplate(false);
      setNewTemplate({
        name: '',
        subject: '',
        htmlContent: '',
        variables: [],
        description: ''
      });
      fetchEmailTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      const token = getToken();
      await axios.put(`${API_BASE_URL}/admin/email-templates/${editingTemplate.id}`, {
        name: editingTemplate.name,
        subject: editingTemplate.subject,
        htmlContent: editingTemplate.htmlContent,
        variables: editingTemplate.variables,
        description: editingTemplate.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "Email template updated successfully",
      });
      
      setEditingTemplate(null);
      fetchEmailTemplates();
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Error",
        description: "Failed to update email template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/admin/email-templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "Email template deleted successfully",
      });
      
      fetchEmailTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive"
      });
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      // This would normally call an API to save system settings
      // For now we'll just simulate success
      setTimeout(() => {
        toast({
          title: "Success",
          description: "System settings updated successfully",
        });
      }, 500);
    } catch (error) {
      console.error("Error saving system settings:", error);
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive"
      });
    }
  };

  const addVariableField = () => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        variables: [...editingTemplate.variables, '']
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        variables: [...newTemplate.variables, '']
      });
    }
  };

  const updateVariableField = (index: number, value: string) => {
    if (editingTemplate) {
      const updatedVars = [...editingTemplate.variables];
      updatedVars[index] = value;
      setEditingTemplate({
        ...editingTemplate,
        variables: updatedVars
      });
    } else {
      const updatedVars = [...newTemplate.variables];
      updatedVars[index] = value;
      setNewTemplate({
        ...newTemplate,
        variables: updatedVars
      });
    }
  };

  const removeVariableField = (index: number) => {
    if (editingTemplate) {
      const updatedVars = [...editingTemplate.variables];
      updatedVars.splice(index, 1);
      setEditingTemplate({
        ...editingTemplate,
        variables: updatedVars
      });
    } else {
      const updatedVars = [...newTemplate.variables];
      updatedVars.splice(index, 1);
      setNewTemplate({
        ...newTemplate,
        variables: updatedVars
      });
    }
  };

  const TemplateForm = ({ isEditing = false }: { isEditing?: boolean }) => {
    const data = isEditing ? editingTemplate : newTemplate;
    if (!data && isEditing) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={data?.name || ''}
              onChange={(e) => isEditing
                ? setEditingTemplate({...editingTemplate!, name: e.target.value})
                : setNewTemplate({...newTemplate, name: e.target.value})
              }
              placeholder="Welcome Email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={data?.subject || ''}
              onChange={(e) => isEditing
                ? setEditingTemplate({...editingTemplate!, subject: e.target.value})
                : setNewTemplate({...newTemplate, subject: e.target.value})
              }
              placeholder="Welcome to Rentalke!"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={data?.description || ''}
              onChange={(e) => isEditing
                ? setEditingTemplate({...editingTemplate!, description: e.target.value})
                : setNewTemplate({...newTemplate, description: e.target.value})
              }
              placeholder="Sent to new users after registration"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="htmlContent">Email Template Content (HTML)</Label>
            </div>
            <Textarea
              id="htmlContent"
              value={data?.htmlContent || ''}
              onChange={(e) => isEditing
                ? setEditingTemplate({...editingTemplate!, htmlContent: e.target.value})
                : setNewTemplate({...newTemplate, htmlContent: e.target.value})
              }
              placeholder="<html><body><h1>Welcome {{name}}!</h1><p>Thank you for joining us.</p></body></html>"
              rows={10}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Template Variables</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariableField}>
                <Plus className="h-4 w-4 mr-1" /> Add Variable
              </Button>
            </div>
            {data?.variables.map((variable, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={variable}
                  onChange={(e) => updateVariableField(index, e.target.value)}
                  placeholder="Variable name (e.g. name, email)"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeVariableField(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => isEditing ? setEditingTemplate(null) : setIsCreatingTemplate(false)}
          >
            Cancel
          </Button>
          <Button onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="email-templates">
            <Mail className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="mr-2 h-4 w-4" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notification Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Email Templates Tab */}
        <TabsContent value="email-templates" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Manage email templates for automated communications
                </CardDescription>
              </div>
              {!isCreatingTemplate && !editingTemplate && (
                <Button onClick={() => setIsCreatingTemplate(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isCreatingTemplate ? (
                <TemplateForm />
              ) : editingTemplate ? (
                <TemplateForm isEditing={true} />
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">Loading templates...</div>
                  ) : templates.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No email templates found</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsCreatingTemplate(true)}
                      >
                        Create your first template
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <Card key={template.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description || 'No description provided'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setEditingTemplate(template)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Subject:</span> {template.subject}
                            </p>
                            <div className="mt-2">
                              <span className="text-sm font-medium">Variables:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {template.variables.map((variable, i) => (
                                  <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">
                                    {variable}
                                  </span>
                                ))}
                                {template.variables.length === 0 && (
                                  <span className="text-xs text-muted-foreground">No variables defined</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    General Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        value={systemSettings.logo}
                        onChange={(e) => setSystemSettings({...systemSettings, logo: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          value={systemSettings.primaryColor}
                          onChange={(e) => setSystemSettings({...systemSettings, primaryColor: e.target.value})}
                        />
                        <input
                          type="color"
                          value={systemSettings.primaryColor}
                          onChange={(e) => setSystemSettings({...systemSettings, primaryColor: e.target.value})}
                          className="h-10 w-10 rounded border p-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultBookingDuration">Default Booking Duration (days)</Label>
                      <Input
                        id="defaultBookingDuration"
                        type="number"
                        value={systemSettings.defaultBookingDuration}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings, 
                          defaultBookingDuration: parseInt(e.target.value) || 1
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    System Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">
                          When enabled, the system will be unavailable to clients
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Debug Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed error logging (not recommended for production)
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.debugMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSystemSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email to users
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Smartphone className="mr-2 h-5 w-5" />
                    SMS Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via SMS to users (additional charges may apply)
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, smsNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">SMS Provider Configuration Required</p>
                    <p className="text-sm mt-1">
                      To enable SMS notifications, you need to configure an SMS provider in the system settings.
                      Contact your administrator for more information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSystemSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
