


export type Pie = {
  label: string;
  value: number;
};

// Max 8 pies
const PieChart = ({ pies, circleWidth }: { pies: Pie[]; circleWidth: string }) => {
  
  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#F44336",
    "#9C27B0",
    "#FFEB3B",
    "#795548",
    "#00BCD4",
  ];

  const totalValue = pies.reduce((sum, pie) => sum + pie.value, 0);

  // Generate the conic-gradient value for the pie chart
  const gradient = pies
    .map((pie, index) => {
      const percentage = (pie.value / totalValue) * 100;
      const startAngle = pies
        .slice(0, index)
        .reduce((sum, p) => sum + (p.value / totalValue) * 100, 0);
      return `${colors[index]} ${startAngle.toFixed(2)}% ${
        (startAngle + percentage).toFixed(2)
      }%`;
    })
    .join(", ");

  return (
    <div className="w-full h-full flex gap-4">
      {/* Pie Chart */}
      <div
        className="rounded-full relative"
        style={{
          width: circleWidth,
          height: circleWidth,
          background: `conic-gradient(${gradient})`,
        }}
      ></div>

      {/* Labels */}
      <div className="flex flex-col gap-2">
        {pies.map((pie, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <p>
              {pie.label}: {pie.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
