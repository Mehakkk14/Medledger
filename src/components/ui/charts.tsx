import React from "react";

interface AreaChartProps {
  data: Array<{ name: string; value: number; }>;
  color?: string;
  className?: string;
}

export const SimpleAreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  color = "hsl(var(--primary))", 
  className = "" 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`relative h-48 ${className}`}>
      <svg className="w-full h-full animate-fade-in" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L 0,${100 - (data[0].value / maxValue) * 100} L ${points} L 100,100 Z`}
          fill="url(#areaGradient)"
          stroke={color}
          strokeWidth="0.8"
          className="animate-pulse-glow"
          style={{ 
            strokeDasharray: '300',
            strokeDashoffset: '300',
            animation: 'chart-draw 2s ease-out forwards, pulse-glow 3s ease-in-out infinite 2s'
          }}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-lg"
          style={{ 
            strokeDasharray: '300',
            strokeDashoffset: '300',
            animation: 'chart-draw 2s ease-out forwards'
          }}
        />
      </svg>
    </div>
  );
};

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string; }>;
  className?: string;
}

export const SimpleDonutChart: React.FC<DonutChartProps> = ({ data, className = "" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full transform -rotate-90 animate-fade-in" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -cumulativePercentage;
          
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke={item.color}
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="opacity-0"
              style={{
                animation: `chart-draw 1.5s ease-out ${index * 0.3}s forwards, chart-rotate 6s ease-in-out ${2 + index * 0.3}s infinite`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="text-2xl font-bold text-primary-neon">{total.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total Records</div>
        </div>
      </div>
    </div>
  );
};