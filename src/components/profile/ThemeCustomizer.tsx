
import React, { useState } from 'react';
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
import { motion } from 'framer-motion';

const colorThemes = [
  { name: 'Default', value: 'default' },
  { name: 'Purple', value: 'purple' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
];

const ThemeCustomizer: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('default');
  
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
                    <div className={`w-6 h-6 rounded-full bg-${color.value} border flex items-center justify-center`}>
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
            <Button className="w-full">
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
