import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network,
  Clock,
  Thermometer,
  Zap
} from "lucide-react";

interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

export function SystemMonitor() {
  const [timeRange, setTimeRange] = useState('1h');

  // Mock system data
  const systemStats = {
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 62,
      frequency: 3.4
    },
    memory: {
      used: 6.8,
      total: 10,
      cached: 1.2,
      available: 3.2
    },
    disk: {
      used: 82,
      total: 100,
      read: 15.3,
      write: 8.7
    },
    network: {
      download: 125.6,
      upload: 45.3,
      connections: 24
    },
    uptime: "2d 14h 32m"
  };

  const processes: ProcessInfo[] = [
    { pid: 1234, name: 'DayZServer', cpu: 38.5, memory: 4200, status: 'Running' },
    { pid: 5678, name: 'BattlEye', cpu: 2.1, memory: 180, status: 'Running' },
    { pid: 9012, name: 'mysqld', cpu: 1.8, memory: 420, status: 'Running' },
    { pid: 3456, name: 'nginx', cpu: 0.5, memory: 85, status: 'Running' },
    { pid: 7890, name: 'sshd', cpu: 0.2, memory: 12, status: 'Running' },
  ];

  const formatBytes = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-destructive';
    if (usage >= 75) return 'text-warning';
    return 'text-success';
  };

  const getProgressVariant = (usage: number): "default" | "destructive" => {
    return usage >= 85 ? 'destructive' : 'default';
  };

  return (
    <div className="space-y-4">
      {/* System Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">CPU</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {systemStats.cpu.cores} cores
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getUsageColor(systemStats.cpu.usage)}`}>
                  {systemStats.cpu.usage}%
                </span>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{systemStats.cpu.frequency} GHz</div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {systemStats.cpu.temperature}°C
                  </div>
                </div>
              </div>
              <Progress 
                value={systemStats.cpu.usage} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatBytes(systemStats.memory.total * 1024)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getUsageColor((systemStats.memory.used / systemStats.memory.total) * 100)}`}>
                  {formatBytes(systemStats.memory.used * 1024)}
                </span>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Available: {formatBytes(systemStats.memory.available * 1024)}</div>
                  <div>Cached: {formatBytes(systemStats.memory.cached * 1024)}</div>
                </div>
              </div>
              <Progress 
                value={(systemStats.memory.used / systemStats.memory.total) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Disk</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {systemStats.disk.total} GB
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getUsageColor(systemStats.disk.used)}`}>
                  {systemStats.disk.used}%
                </span>
                <div className="text-right text-xs text-muted-foreground">
                  <div>R: {systemStats.disk.read} MB/s</div>
                  <div>W: {systemStats.disk.write} MB/s</div>
                </div>
              </div>
              <Progress 
                value={systemStats.disk.used} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Network</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {systemStats.network.connections} conn
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-success">↓</span> {systemStats.network.download} KB/s
                  </div>
                  <div className="text-sm">
                    <span className="text-warning">↑</span> {systemStats.network.upload} KB/s
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {systemStats.uptime}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="15m">15 min</TabsTrigger>
              <TabsTrigger value="1h">1 hour</TabsTrigger>
              <TabsTrigger value="6h">6 hours</TabsTrigger>
              <TabsTrigger value="24h">24 hours</TabsTrigger>
            </TabsList>

            <TabsContent value={timeRange} className="space-y-4 mt-4">
              {/* Performance Chart Placeholder */}
              <div className="h-48 bg-muted/10 rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Performance charts for {timeRange} timeframe</p>
                  <p className="text-xs">Chart integration coming soon...</p>
                </div>
              </div>

              {/* Process List */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Top Processes
                </h4>
                <div className="space-y-2">
                  {processes.map((process) => (
                    <div
                      key={process.pid}
                      className="flex items-center justify-between p-3 bg-muted/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          {process.pid}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{process.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Status: {process.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className={getUsageColor(process.cpu)}>
                            {process.cpu}% CPU
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {formatBytes(process.memory)} RAM
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}