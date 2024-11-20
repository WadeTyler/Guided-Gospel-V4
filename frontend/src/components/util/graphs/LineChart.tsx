

// Start by making a plot graph
export type Plot = {
  value: number;
  timestamp: string;
}

const LineChart = ( {plots}: {plots: Plot[]; }) => {

  const getMaxY = () => {
    let max = 0;
    plots.forEach(plot => {
      max = Math.max(max, plot.value);
    });

    return max;
  }

  const maxValueY = getMaxY();
  const maxValueX = plots.length;

  const getDistanceFromTop = (value: number) => {

    // value / maxValue returns distance from bottom, subtract 1 to get the value from top, then multiply by 100 to put it out of 100%
    const distance = (1 - (value / maxValueY)) * 100;
    
    return distance;
  }

  const getDistanceFromLeft = (index: number) => {

    const distance = ((index + 1)/ maxValueX) * 100;
    return distance;
  }

  const generateAreaPoints = () => {
    let points = "";

    plots.forEach((plot, index) => {
      const x = getDistanceFromLeft(index);
      const y = getDistanceFromTop(plot.value);
      points += `${x},${y} `;
    });
    // Flat end point at the far right, same height as the last plot
    const lastX = getDistanceFromLeft(plots.length - 1);
    const lastY = getDistanceFromTop(plots[plots.length - 1].value);
    points += `${lastX},${lastY} `;

    // Add bottom-right and bottom-left points
    points += `${lastX},100 0,100`;

    console.log("Polygon points:", points.trim());
    return points.trim();
  };


  return (
    <div className="w-full h-[85%] relative border-purple-400 border-[1px] rounded-xl pt-4">
      <div className="relative w-full h-full">

        {/* Filled Area */}
        <svg className="absolute w-full h-full rounded-bl-xl" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={generateAreaPoints()}
            fill="rgba(128, 90, 213, 0.3)" // Light purple fill with opacity
          />
        </svg>

        {/* Plot Points */}
        {plots.map((plot, index) => (
          <div key={index} className="z-10">
            {/* Dot */}
            <div
            className={`absolute bg-purple-400 h-3 w-3 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 group-parent cursor-pointer`}
            style={{
              top: `${getDistanceFromTop(plot.value)}%`,
              left: `${getDistanceFromLeft(index)}%`
            }}>
              <div className="hidden group-parent-hover:flex items-center absolute -top-8 bg-[rgba(0,0,0,.8)] rounded-md p-1">
                <p className="text-white text-xs">{plot.value}</p>
              </div>
            </div>

            {/* Value */}
            <div
              className="absolute bottom-0 translate-y-8 -rotate-45 -translate-x-1/2"
              style={{
                left: `${getDistanceFromLeft(index)}%`
              }}
            >
              <p className="text-gray-400 text-xs">{new Date(plot.timestamp).getUTCMonth() + 1}, {new Date(plot.timestamp).getUTCDate()}</p>
            </div>

            {/* Timestamp */}
            <div  
              className="absolute left-0 -translate-x-5 w-full"
              style={{
                top: `${getDistanceFromTop(plot.value)}%`
              }}
            >
              <p className="text-gray-400 text-xs">{plot.value}</p>
            </div>
            
          </div>
        ))}

      </div>


    </div>
  )
}



export default LineChart