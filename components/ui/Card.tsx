import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
