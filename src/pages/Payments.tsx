
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for payments
const paymentData = [
  {
    id: "PAY-001",
    client: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff",
    },
    amount: 1250.00,
    status: "Completed",
    date: "2023-07-10",
    package: "Premium",
  },
  {
    id: "PAY-002",
    client: {
      name: "Sarah Connor",
      email: "sarah.connor@example.com",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Connor&background=6366F1&color=fff",
    },
    amount: 499.99,
    status: "Processing",
    date: "2023-07-09",
    package: "Basic",
  },
  {
    id: "PAY-003",
    client: {
      name: "Robert Parker",
      email: "robert.parker@example.com",
      avatar: "https://ui-avatars.com/api/?name=Robert+Parker&background=22C55E&color=fff",
    },
    amount: 999.50,
    status: "Completed",
    date: "2023-07-08",
    package: "Standard",
  },
  {
    id: "PAY-004",
    client: {
      name: "Emily Williams",
      email: "emily.williams@example.com",
      avatar: "https://ui-avatars.com/api/?name=Emily+Williams&background=EF4444&color=fff",
    },
    amount: 1250.00,
    status: "Failed",
    date: "2023-07-07",
    package: "Premium",
  },
  {
    id: "PAY-005",
    client: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=FB923C&color=fff",
    },
    amount: 499.99,
    status: "Completed",
    date: "2023-07-06",
    package: "Basic",
  },
];

// Sample package data
const packages = [
  {
    id: 1,
    name: "Basic",
    price: 499.99,
    features: [
      "Limited to 3 properties",
      "Basic analytics",
      "Email support",
      "Standard listing exposure",
    ],
    recommended: false,
  },
  {
    id: 2,
    name: "Standard",
    price: 999.50,
    features: [
      "Up to 10 properties",
      "Advanced analytics",
      "Priority email support",
      "Featured listings",
      "Client management tools",
    ],
    recommended: true,
  },
  {
    id: 3,
    name: "Premium",
    price: 1250.00,
    features: [
      "Unlimited properties",
      "Comprehensive analytics",
      "24/7 phone & email support",
      "Premium listing exposure",
      "Advanced client management",
      "Marketing tools",
      "API access",
    ],
    recommended: false,
  },
];

const Payments: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  // Filter payments based on search term and selected status
  const filteredPayments = paymentData.filter(payment => {
    const matchesSearch = 
      payment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || 
      payment.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleCreatePackage = () => {
    toast({
      title: "Feature coming soon",
      description: "Package creation will be available in a future update.",
    });
  };

  const handleExportData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Export complete",
        description: "Payment data has been exported successfully.",
      });
    }, 1500);
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage payments, transactions, and subscription packages
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline" disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export Data"}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      View and manage payment transactions
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of recent payment transactions.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={payment.client.avatar} alt={payment.client.name} />
                              <AvatarFallback>
                                {payment.client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                              <div className="font-medium">{payment.client.name}</div>
                              <div className="text-sm text-muted-foreground">{payment.client.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.package}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Process Refund</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredPayments.length} of {paymentData.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Packages</h2>
              <Button onClick={handleCreatePackage}>
                <Package className="mr-2 h-4 w-4" />
                Create Package
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <motion.div key={pkg.id} variants={itemVariants}>
                  <Card className={pkg.recommended ? "border-primary" : ""}>
                    {pkg.recommended && (
                      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                        <Badge className="bg-primary">Recommended</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>
                        <span className="text-2xl font-bold">{formatCurrency(pkg.price)}</span>
                        <span className="text-muted-foreground"> / month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                      <Button className="w-full" variant={pkg.recommended ? "default" : "outline"}>
                        Edit Package
                      </Button>
                      <Button className="w-full" variant="ghost">
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure payment methods and processing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit/Debit Cards</p>
                          <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Invoice Settings</h3>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="RentalKE Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                      <Input id="tax-id" defaultValue="TAX-123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                      <Input id="invoice-prefix" defaultValue="INV-" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="kes">KES (KSh)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default Payments;
