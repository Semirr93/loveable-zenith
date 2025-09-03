import { cn } from "@/lib/utils";
import * as React from "react";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'offline' | 'starting' | 'stopping' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig = {
  online: {
    color: 'bg-success',
    label: 'Online',
    className: 'status-online animate-pulse-glow'
  },
  offline: {
    color: 'bg-destructive',
    label: 'Offline',
    className: 'status-offline'
  },
  starting: {
    color: 'bg-warning',
    label: 'Starting',
    className: 'animate-pulse'
  },
  stopping: {
    color: 'bg-warning',
    label: 'Stopping',
    className: 'animate-pulse'
  },
  unknown: {
    color: 'bg-muted-foreground',
    label: 'Unknown',
    className: ''
  }
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size = 'md', showLabel = false, ...props }, ref) => {
    const config = statusConfig[status];
    const sizeClass = sizeConfig[size];

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full transition-all duration-300",
            config.color,
            config.className,
            sizeClass
          )}
        />
        {showLabel && (
          <span className="text-sm font-medium text-foreground">
            {config.label}
          </span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };