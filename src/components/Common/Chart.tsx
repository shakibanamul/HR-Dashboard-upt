import React from 'react';

interface ChartProps {
  data: Array<{ label: string; value: number }>;
  type: 'bar' | 'line' | 'pie';
  height?: number;
  color?: string;
}

const Chart: React.FC<ChartProps> = ({ data, type, height = 300, color = '#3B82F6' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  if (maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }
  
  const padding = 50;
  const chartWidth = Math.max(400, data.length * 60); // Dynamic width based on data points
  const chartHeight = height - padding * 2;

  const renderBarChart = () => {
    const barWidth = Math.max(20, Math.min(60, (chartWidth - padding * 2) / data.length - 10));

    return (
      <div className="w-full overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${height}`} 
          className="min-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (1 - percent / 100));
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  fontSize="12"
                >
                  {Math.round((maxValue * percent) / 100)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const x = padding + index * (barWidth + 10) + 5;
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const y = padding + chartHeight - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="2"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="11"
                >
                  {item.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                  fontSize="11"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderLineChart = () => {
    const pointSpacing = (chartWidth - padding * 2) / Math.max(1, data.length - 1);

    const points = data.map((item, index) => ({
      x: padding + (data.length === 1 ? (chartWidth - padding * 2) / 2 : index * pointSpacing),
      y: padding + chartHeight - (maxValue > 0 ? (item.value / maxValue) * chartHeight : 0)
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="w-full overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${height}`} 
          className="min-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (1 - percent / 100));
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  fontSize="12"
                >
                  {Math.round((maxValue * percent) / 100)}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {points.length > 1 && (
            <path
              d={`${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`}
              fill={color}
              fillOpacity="0.1"
            />
          )}

          {/* Line */}
          {points.length > 1 && (
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="3"
              className="drop-shadow-sm"
            />
          )}

          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={color}
                className="hover:r-7 transition-all cursor-pointer"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
                fontSize="11"
              >
                {data[index].value}
              </text>
            </g>
          ))}

          {/* Labels */}
          {data.map((item, index) => (
            <text
              key={index}
              x={points[index].x}
              y={height - 15}
              textAnchor="middle"
              className="text-xs fill-gray-600"
              fontSize="11"
            >
              {item.label}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
    </div>
  );
};

export default Chart;