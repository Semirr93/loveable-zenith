import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Send, 
  Trash2, 
  Pause, 
  Play, 
  Copy,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsoleMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'command';
  content: string;
}

export function ConsolePanel() {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'info',
      content: '[INFO] DayZ Server Manager Console initialized'
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'info',
      content: '[INFO] Server EU-West-01 is running on port 2302'
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'warning',
      content: '[WARNING] High memory usage detected (68%)'
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPaused]);

  // Simulate real-time console output
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomMessages = [
        '[INFO] Player connected: Survivor123',
        '[INFO] Loot respawn cycle completed',
        '[DEBUG] AI pathfinding update: 147ms',
        '[INFO] Player disconnected: NoobSlayer',
        '[WARNING] Server FPS: 45 (target: 50+)',
        '[INFO] Backup completed successfully',
      ];

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.8 ? 'warning' : 'info',
          content: randomMessages[Math.floor(Math.random() * randomMessages.length)]
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSendCommand = () => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Add command to messages
    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'command',
      content: `> ${command}`
    };

    setMessages(prev => [...prev, newMessage]);
    setCommand("");

    // Simulate command response
    setTimeout(() => {
      const response: ConsoleMessage = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        type: 'info',
        content: `[INFO] Command executed: ${command}`
      };
      setMessages(prev => [...prev, response]);
    }, 500);

    toast({
      title: "Command sent",
      description: command,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const clearConsole = () => {
    setMessages([]);
    toast({
      title: "Console cleared",
      description: "All messages have been removed",
    });
  };

  const copyConsole = () => {
    const content = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(content);
    toast({
      title: "Console copied",
      description: "Console output copied to clipboard",
    });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'command': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getMessageTypeBadge = (type: string) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      command: 'default',
      info: 'outline'
    } as const;
    
    return variants[type as keyof typeof variants] || 'outline';
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Console
            <Badge variant="outline" className="ml-2">
              {messages.length} lines
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              onClick={copyConsole}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={clearConsole}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Console Output */}
        <ScrollArea className="h-[400px] w-full">
          <div ref={scrollRef} className="p-4 space-y-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-3 text-sm font-mono group hover:bg-muted/20 px-2 py-1 rounded transition-colors"
              >
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                <Badge 
                  variant={getMessageTypeBadge(message.type)}
                  className="text-xs flex-shrink-0 w-16 justify-center"
                >
                  {message.type.toUpperCase()}
                </Badge>
                <span className={`console-output flex-1 ${getMessageTypeColor(message.type)}`}>
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter server command..."
                className="pl-8 bg-input border-border focus:border-primary font-mono"
              />
            </div>
            <Button
              onClick={handleSendCommand}
              disabled={!command.trim()}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 min-w-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use ↑↓ arrow keys to browse command history
          </p>
        </div>
      </CardContent>
    </Card>
  );
}