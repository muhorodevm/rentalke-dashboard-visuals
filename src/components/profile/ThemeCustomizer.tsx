
import React, { useState, useEffect } from 'react';
import { Check, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const colorThemes = [
  { name: 'Default', value: 'default', color: 'bg-blue-600' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-600' },
  { name: 'Green', value: 'green', color: 'bg-green-600' },
  { name: 'Blue', value: 'blue', color: 'bg-sky-600' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-600' },
  { name: 'Red', value: 'red', color: 'bg-red-600' },
];

const ThemeCustomizer: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('default');
  const { toast } = useToast();
  
  const ThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'light':
        return <Sun className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  // Apply the selected accent color
  useEffect(() => {
    const root = document.documentElement;
    
    // Reset to default colors first
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-foreground');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-foreground');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--secondary-foreground');

    // Apply new color theme
    switch (accentColor) {
      case 'purple':
        root.style.setProperty('--primary', '270 70% 46%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '273 68% 59%');
        root.style.setProperty('--secondary', '280 84% 39%');
        break;
      case 'green':
        root.style.setProperty('--primary', '142 71% 45%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '142 71% 45%');
        root.style.setProperty('--secondary', '143 64% 24%');
        break;
      case 'blue':
        root.style.setProperty('--primary', '217 91% 60%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '214 100% 60%');
        root.style.setProperty('--secondary', '221 83% 53%');
        break;
      case 'orange':
        root.style.setProperty('--primary', '24 94% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '20 90% 50%');
        root.style.setProperty('--secondary', '24 94% 35%');
        break;
      case 'red':
        root.style.setProperty('--primary', '0 84% 60%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '0 72% 51%');
        root.style.setProperty('--secondary', '0 74% 42%');
        break;
      // Default blue theme already set in CSS
    }
  }, [accentColor]);

  const handleApplyPreferences = () => {
    toast({
      title: "Preferences Applied",
      description: `Theme: ${theme}, Accent Color: ${accentColor}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Interface Theme</CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Light</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dark</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('system')}
                    >
                      <Laptop className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>System</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <RadioGroup 
              defaultValue="default" 
              value={accentColor}
              onValueChange={setAccentColor}
              className="grid grid-cols-3 gap-2"
            >
              {colorThemes.map((color) => (
                <div key={color.value}>
                  <RadioGroupItem
                    value={color.value}
                    id={`color-${color.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`color-${color.value}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className={`w-6 h-6 rounded-full ${color.color} border flex items-center justify-center`}>
                      {accentColor === color.value && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="mt-2 text-xs font-medium">{color.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => document.documentElement.style.fontSize = '14px'}
              >
                A
              </Button>
              <Button
                variant="outline"
                onClick={() => document.documentElement.style.fontSize = '16px'}
              >
                A
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => document.documentElement.style.fontSize = '18px'}
              >
                A
              </Button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button className="w-full" onClick={handleApplyPreferences}>
              <ThemeIcon />
              <span className="ml-2">Apply Preferences</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ThemeCustomizer;
