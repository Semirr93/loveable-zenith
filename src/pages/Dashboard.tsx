import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { MetricCard } from "@/components/ui/metric-card";
import { ConsolePanel } from "@/components/ConsolePanel";
import { FileManager } from "@/components/FileManager";
import { SystemMonitor } from "@/components/SystemMonitor";
import { ServerControls } from "@/components/ServerControls";
import { 
  Server, 
  Terminal, 
  Folder, 
  Settings, 
  Activity,
  Power,
  RotateCcw,
  Play,
  Square,
  Users,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'starting' | 'stopping'>('online');
  const [activeTab, setActiveTab] = useState('console');
  const { toast } = useToast();

  // Mock data - in real app this would come from WebSocket/API
  const serverMetrics = {
    players: { current: 24, max: 60 },
    cpu: 45,
    memory: 68,
    disk: 82,
    uptime: "2d 14h 32m"
  };

  const handleServerAction = (action: string) => {
    setServerStatus('starting');
    toast({
      title: `Server ${action}`,
      description: `Executing ${action} command...`,
    });
    
    // Simulate server action
    setTimeout(() => {
      setServerStatus(action === 'stop' ? 'offline' : 'online');
      toast({
        title: `Server ${action} completed`,
        description: `Server is now ${action === 'stop' ? 'offline' : 'online'}`,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Server className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  DayZ Server Manager
                </h1>
                <div className="flex items-center gap-2">
                  <StatusIndicator status={serverStatus} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    EU-West-01
                  </span>
                </div>
              </div>
            </div>
            
            <ServerControls 
              status={serverStatus}
              onAction={handleServerAction}
            />
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Players"
            value={`${serverMetrics.players.current}/${serverMetrics.players.max}`}
            icon={<Users className="w-5 h-5" />}
            variant={serverMetrics.players.current > 50 ? 'success' : 'default'}
          />
          <MetricCard
            label="CPU"
            value={serverMetrics.cpu}
            unit="%"
            icon={<Cpu className="w-5 h-5" />}
            variant={serverMetrics.cpu > 80 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Memory"
            value={serverMetrics.memory}
            unit="%"
            icon={<MemoryStick className="w-5 h-5" />}
            variant={serverMetrics.memory > 85 ? 'destructive' : 'default'}
          />
          <MetricCard
            label="Disk"
            value={serverMetrics.disk}
            unit="%"
            icon={<HardDrive className="w-5 h-5" />}
            variant={serverMetrics.disk > 90 ? 'destructive' : 'default'}
          />
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger 
              value="console" 
              className="flex items-center gap-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Terminal className="w-4 h-4" />
              Console
            </TabsTrigger>
            <TabsTrigger 
              value="files"
              className="flex items-center gap-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Folder className="w-4 h-4" />
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="monitor"
              className="flex items-center gap-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="w-4 h-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center gap-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="mt-4">
            <ConsolePanel />
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <FileManager />
          </TabsContent>

          <TabsContent value="monitor" className="mt-4">
            <SystemMonitor />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="bg-gradient-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Server Settings
              </h3>
              <p className="text-muted-foreground">
                Server configuration panel coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}