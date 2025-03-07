
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import GrowthChart from '@/components/dashboard/GrowthChart';
import SystemHealth from '@/components/dashboard/SystemHealth';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import MessageCenter from '@/components/dashboard/MessageCenter';

// Defining each draggable widget
const widgetComponents = {
  metrics: DashboardMetrics,
  growth: GrowthChart,
  system: SystemHealth,
  notifications: NotificationsPanel,
  messages: MessageCenter
};

// Initial widget order
const defaultWidgetOrder = [
  { id: 'metrics', span: 'full' },
  { id: 'growth', span: 'full' },
  { id: 'system', span: 'half' },
  { id: 'notifications', span: 'half' },
  { id: 'messages', span: 'half' }
];

const Index = () => {
  const [widgets, setWidgets] = useState(defaultWidgetOrder);
  const [customizing, setCustomizing] = useState(false);

  // Save widget order to localStorage
  const saveWidgetOrder = (order) => {
    try {
      localStorage.setItem('dashboardWidgets', JSON.stringify(order));
      toast({
        title: "Dashboard layout saved",
        description: "Your custom layout has been saved."
      });
    } catch (error) {
      console.error("Error saving layout:", error);
      toast({
        title: "Error saving layout",
        description: "There was a problem saving your layout.",
        variant: "destructive"
      });
    }
  };

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
  };

  // Toggle customization mode
  const toggleCustomizing = () => {
    if (customizing) {
      saveWidgetOrder(widgets);
    }
    setCustomizing(!customizing);
  };

  // Reset to default layout
  const resetLayout = () => {
    setWidgets(defaultWidgetOrder);
    localStorage.removeItem('dashboardWidgets');
    toast({
      title: "Layout reset",
      description: "Dashboard layout has been reset to default."
    });
    setCustomizing(false);
  };

  // Render widgets based on their configuration
  const renderWidget = (widget, index) => {
    const Component = widgetComponents[widget.id];
    if (!Component) return null;

    return (
      <motion.div 
        key={widget.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={widget.span === 'full' ? 'col-span-2' : ''}
      >
        {customizing ? (
          <Draggable draggableId={widget.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="relative border-2 border-dashed border-primary rounded-lg p-4 mb-6"
              >
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
                  Drag to reorder
                </div>
                <Component />
              </div>
            )}
          </Draggable>
        ) : (
          <Component />
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the RentalKE admin dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={customizing ? "default" : "outline"} 
            onClick={toggleCustomizing}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {customizing ? "Save Layout" : "Customize"}
          </Button>
          {customizing && (
            <Button variant="outline" onClick={resetLayout}>
              Reset
            </Button>
          )}
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        {customizing ? (
          <Droppable droppableId="widgets">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {widgets.map((widget, index) => renderWidget(widget, index))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {widgets.map((widget, index) => renderWidget(widget, index))}
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default Index;
