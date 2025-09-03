import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Square, RotateCcw, Download, MoreVertical, Power } from "lucide-react";

interface ServerControlsProps {
  status: 'online' | 'offline' | 'starting' | 'stopping';
  onAction: (action: string) => void;
}

export function ServerControls({ status, onAction }: ServerControlsProps) {
  const isTransitioning = status === 'starting' || status === 'stopping';

  return (
    <div className="flex items-center gap-2">
      {/* Quick Action Buttons */}
      <div className="flex items-center gap-1">
        {status === 'offline' ? (
          <Button
            onClick={() => onAction('start')}
            disabled={isTransitioning}
            size="sm"
            className="bg-gradient-success text-success-foreground hover:opacity-90 transition-opacity min-w-[44px]"
          >
            <Play className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => onAction('stop')}
            disabled={isTransitioning}
            size="sm"
            variant="destructive"
            className="min-w-[44px]"
          >
            <Square className="w-4 h-4" />
          </Button>
        )}
        
        <Button
          onClick={() => onAction('restart')}
          disabled={isTransitioning || status === 'offline'}
          size="sm"
          variant="secondary"
          className="min-w-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="min-w-[44px] min-h-[44px]"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onAction('update')}
            disabled={isTransitioning || status === 'online'}
          >
            <Download className="mr-2 h-4 w-4" />
            Update Server
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAction('validate')}
            disabled={isTransitioning || status === 'online'}
          >
            <Power className="mr-2 h-4 w-4" />
            Validate Files
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onAction('backup')}
            disabled={isTransitioning}
          >
            <Download className="mr-2 h-4 w-4" />
            Create Backup
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}