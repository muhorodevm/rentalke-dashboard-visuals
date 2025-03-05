
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { monthlyGrowthData } from "@/data/dummyData";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const Analytics: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("overview");

  // Pricing data
  const propertyTypeData = [
    { name: "Apartments", value: 45 },
    { name: "Houses", value: 30 },
    { name: "Condos", value: 15 },
    { name: "Commercial", value: 10 },
  ];

  const rentalGrowthRateData = [
    { month: "Jan", rate: 2.5 },
    { month: "Feb", rate: 3.1 },
    { month: "Mar", rate: 3.8 },
    { month: "Apr", rate: 4.2 },
    { month: "May", rate: 4.8 },
    { month: "Jun", rate: 5.1 },
    { month: "Jul", rate: 5.7 },
    { month: "Aug", rate: 6.2 },
    { month: "Sep", rate: 6.8 },
    { month: "Oct", rate: 7.1 },
    { month: "Nov", rate: 7.5 },
  ];

  const clientAcquisitionData = [
    { month: "Jan", organic: 42, referral: 28, direct: 30 },
    { month: "Feb", organic: 45, referral: 32, direct: 35 },
    { month: "Mar", organic: 50, referral: 35, direct: 38 },
    { month: "Apr", organic: 55, referral: 40, direct: 40 },
    { month: "May", organic: 60, referral: 45, direct: 45 },
    { month: "Jun", organic: 70, referral: 50, direct: 50 },
    { month: "Jul", organic: 75, referral: 55, direct: 55 },
    { month: "Aug", organic: 80, referral: 62, direct: 60 },
    { month: "Sep", organic: 85, referral: 68, direct: 65 },
    { month: "Oct", organic: 90, referral: 72, direct: 70 },
    { month: "Nov", organic: 95, referral: 75, direct: 75 },
  ];

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed performance metrics and growth trends
          </p>
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="clientAcquisition">Client Acquisition</TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Property Types Distribution */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Property Distribution</CardTitle>
              <CardDescription>By property type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Growth Rate */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rental Growth Rate</CardTitle>
              <CardDescription>Monthly growth percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rentalGrowthRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Growth Rate']} 
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#0068D9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Managers and Clients Growth */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Managers & Clients Growth</CardTitle>
              <CardDescription>Monthly growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="managers"
                      stackId="1"
                      stroke="#0068D9"
                      fill="#0068D9"
                    />
                    <Area
                      type="monotone"
                      dataKey="clients"
                      stackId="2"
                      stroke="#66BB6A"
                      fill="#66BB6A"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Acquisition Channels */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Client Acquisition Channels</CardTitle>
              <CardDescription>Client sources by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientAcquisitionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="organic" name="Organic Search" fill="#0068D9" />
                    <Bar dataKey="referral" name="Referrals" fill="#66BB6A" />
                    <Bar dataKey="direct" name="Direct" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics;
