
/**
 * Renders a component containing a bar chart, a button, and a pie chart.
 *
 * The bar chart displays data with a band scale on the x-axis and multiple series.
 * The pie chart visualizes data with labeled series.
 *
 * @component
 * @returns {JSX.Element} A React component containing a bar chart, a button, and a pie chart.
 */

// import { 'React' } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Button from '../component/Button/Button';

function bar() {
  return (
    <div> 
        <BarChart
    xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
    width={500}
    height={300}
  />
<Button/>
<PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  </div>
  )
}

export default bar
