import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const HorizontalBar = ({ data, keys }) => (
  <div className="horizontal-bar">
    <ResponsiveBar
      data={data.sort((a, b) => a[keys[0]] - b[keys[0]])}
      keys={keys}
      indexBy="title"
      margin={{
        top: 20,
        right: 80,
        bottom: 25,
        left: 150,
      }}
      padding={0.5}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'paired' }}
      borderWidth={10}
      borderColor={{ theme: 'background' }}
      borderRadius={1}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 50,
      }}
      axisLeft={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: -50,
        format: (v) =>
          // eslint-disable-next-line react/destructuring-assignment
          (v.length > 20 ? (
            <tspan>
              {
                // eslint-disable-next-line react/destructuring-assignment
                `${v.substring(0, 20)}...`
              }
              <title>{v}</title>
            </tspan>
          ) : (
            v
          )),
      }}
      enableGridX
      enableGridY={false}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', '1.6']] }}
      animate
      motionStiffness={90}
      motionDamping={15}
      enableStackTooltip
    />
  </div>
);

export default HorizontalBar;
