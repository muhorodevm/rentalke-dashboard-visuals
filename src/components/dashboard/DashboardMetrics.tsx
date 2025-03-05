
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { metricsData } from '@/data/dummyData';

const DashboardMetrics: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.title}
          className="metric-card group"
          variants={itemVariants}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </h3>
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                `bg-${metric.color}`
              )}
            />
          </div>
          
          <div className="mt-1">
            <span className="text-2xl font-bold">{metric.value}</span>
            
            <div className="flex items-center mt-2 text-sm">
              <div 
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded",
                  metric.changeType === 'increase' 
                    ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" 
                    : "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                )}
              >
                {metric.changeType === 'increase' ? (
                  <ArrowUp size={14} className="flex-shrink-0" />
                ) : (
                  <ArrowDown size={14} className="flex-shrink-0" />
                )}
                <span>{metric.changePercentage}%</span>
              </div>
              <span className="ml-2 text-muted-foreground">
                from previous period
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardMetrics;
