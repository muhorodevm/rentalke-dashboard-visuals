
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { systemHealthData } from '@/data/dummyData';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

const SystemHealth: React.FC = () => {
  const getStatusIcon = (status: string, value: number) => {
    if (status === 'critical') {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    } else if (status === 'warning' || value < 70) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-rentalke-green" />;
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.3
      }
    })
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Current status of system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealthData.map((item, index) => (
              <motion.div 
                key={item.name}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status, item.value)}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
                <Progress
                  value={item.value}
                  className={cn("h-2", {
                    "bg-secondary [&>div]:bg-destructive": item.value < 50,
                    "bg-secondary [&>div]:bg-amber-500": item.value >= 50 && item.value < 70,
                    "bg-secondary [&>div]:bg-rentalke-green": item.value >= 70
                  })}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemHealth;
