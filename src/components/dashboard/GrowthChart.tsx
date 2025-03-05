
import React, { useState, useContext } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { monthlyGrowthData } from '@/data/dummyData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const GrowthChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  
  // Chart colors
  const managerColor = '#0068D9';
  const clientColor = '#66BB6A';
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border p-3 rounded-lg shadow-md">
          <p className="font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-rentalke-blue inline-block mr-2" />
              Managers: <span className="font-medium ml-1">{payload[0].value}</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-rentalke-apple inline-block mr-2" />
              Clients: <span className="font-medium ml-1">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Growth Analytics</CardTitle>
              <CardDescription>
                Managers and clients growth trend
              </CardDescription>
            </div>
            <Tabs
              defaultValue="monthly"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-[240px]"
            >
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorManagers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={managerColor}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={managerColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={clientColor}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={clientColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#333' : '#eee'}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: isDarkMode ? '#444' : '#ddd' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => (
                    <span className="text-sm">{value}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="managers"
                  name="Managers"
                  stroke={managerColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorManagers)"
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  name="Clients"
                  stroke={clientColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorClients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GrowthChart;
