// BudgetAssistant/app/components/DonutChart.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface DonutChartProps {
  progress: number;
  size: number;
  strokeWidth: number;
  backgroundColor?: string;
  progressColor?: string;
  spent: number;
  budget: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  progress,
  size,
  strokeWidth,
  backgroundColor = '#E5E7EB',
  progressColor = '#4F46E5',
  spent,
  budget,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = circumference - (circumference * progressValue) / 100;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Center text block */}
        <SvgText
          x={center}
          y={center - 14}
          textAnchor="middle"
          fontSize="12"
          fill="#6B7280"
        >
          Spent
        </SvgText>

        {/* Main amount */}
        <SvgText
          x={center}
          y={center + 3}
          textAnchor="middle"
          fontSize="18"
          fill={progressColor}
          fontWeight="600"
          alignmentBaseline="middle"
        >
          {`$${spent.toFixed(2)}`}
        </SvgText>

        {/* of $budget */}
        <SvgText
          x={center}
          y={center + 26}
          textAnchor="middle"
          fontSize="12"
          fill="#6B7280"
        >
          {`of $${budget.toLocaleString()}`}
        </SvgText>
      </Svg>
    </View>
  );
};
