import React from 'react';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  format?: 'currency' | 'number' | 'text';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  format = 'text',
}) => {
  const formatValue = () => {
    if (typeof value !== 'number') return value;
    
    switch (format) {
      case 'currency':
        return `KES ${value.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
      case 'number':
        return value.toLocaleString('en-US');
      default:
        return value;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border border-neutral-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Typography 
            variant="body2" 
            className="text-neutral-500 mb-3 font-medium"
          >
            {label}
          </Typography>
          <Typography 
            variant="h3" 
            className="text-primary-900 font-bold text-2xl"
          >
            {formatValue()}
          </Typography>
          
          {trend && (
            <div className={`mt-3 text-sm font-semibold flex items-center gap-1 ${
              trend.direction === 'up' ? 'text-success' : 'text-warning'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{trend.percentage}% vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-4xl opacity-40 ml-4">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
