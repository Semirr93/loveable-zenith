import { cn } from "@/lib/utils";
import * as React from "react";
import { Card, CardContent } from "./card";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ 
    className, 
    label, 
    value, 
    unit, 
    icon, 
    trend, 
    trendValue, 
    variant = 'default',
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'border-border',
      success: 'border-success/20 bg-success/5',
      warning: 'border-warning/20 bg-warning/5',
      destructive: 'border-destructive/20 bg-destructive/5'
    };

    const trendStyles = {
      up: 'text-success',
      down: 'text-destructive',
      neutral: 'text-muted-foreground'
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "bg-gradient-card backdrop-blur-sm transition-all duration-300 hover:shadow-md",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                {label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {value}
                </span>
                {unit && (
                  <span className="text-sm text-muted-foreground">
                    {unit}
                  </span>
                )}
              </div>
              {trend && trendValue && (
                <div className={cn("text-xs", trendStyles[trend])}>
                  {trendValue}
                </div>
              )}
            </div>
            {icon && (
              <div className="text-muted-foreground opacity-60">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";

export { MetricCard };