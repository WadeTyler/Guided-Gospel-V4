
import { GridPattern } from './GridPattern'
import { useMemo } from 'react';

const BackgroundPattern = () => {

  const pattern = useMemo(() => ({
    y: -6,
    squares: [
      [-1, 2],
      [1, 3],
      // Random values between -10 and 10
      ...Array.from({ length: 10 }, () => [
        Math.floor(Math.random() * 20) - 10,
        Math.floor(Math.random() * 20) - 10,
      ]),
    ],
  }), []);

  return (
    // Notes: Add group to the parent div to apply the opacity effect
    <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
      <GridPattern
        width={120}
        height={120}
        x="50%"
        className="absolute inset-x-0 inset-y-[-30%] h-[100%] w-full skew-y-[-5deg] fill-primary stroke-gray-100"
        {...pattern}
      />
    </div>
  )
}

export default BackgroundPattern