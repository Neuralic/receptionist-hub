import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  variant: 'primary' | 'success' | 'warning' | 'info';
}

const variantClasses = {
  primary: 'gradient-primary',
  success: 'gradient-success',
  warning: 'gradient-warning',
  info: 'gradient-info',
};

export function StatCard({ title, value, change, changeLabel, icon, variant }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]} text-primary-foreground shadow-elevated`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}{change}% {changeLabel}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}
