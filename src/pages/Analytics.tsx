
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { monthlyGrowthData } from '@/data/dummyData';
import { useTheme } from '@/context/ThemeContext';

const Analytics = () => {
  const { theme } = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border p-3 rounded-lg shadow-md">
          <p className="font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-rentalke-blue inline-block mr-2" />
              Managers: <span className="font-medium ml-1">{payload[0]?.value}</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-rentalke-apple inline-block mr-2" />
              Clients: <span className="font-medium ml-1">{payload[1]?.value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Overview of system performance and growth metrics
        </p>
      </div>
      
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={itemVariants}
      >
        {/* Growth Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Manager & Client Growth</CardTitle>
            <CardDescription>
              Monthly growth analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyGrowthData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#333' : '#eee'}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: theme === 'dark' ? '#444' : '#ddd' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    name="Managers"
                    dataKey="managers"
                    fill="#0068D9"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    name="Clients"
                    dataKey="clients"
                    fill="#66BB6A"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Growth Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trend Analysis</CardTitle>
            <CardDescription>
              Growth progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyGrowthData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#333' : '#eee'}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: theme === 'dark' ? '#444' : '#ddd' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    name="Managers"
                    type="monotone"
                    dataKey="managers"
                    stroke="#0068D9"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Clients"
                    type="monotone"
                    dataKey="clients"
                    stroke="#66BB6A"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Additional analytics content could go here */}
    </motion.div>
  );
};

export default Analytics;
