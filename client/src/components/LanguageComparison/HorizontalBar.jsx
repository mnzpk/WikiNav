import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const HorizontalBar = ({ data, keys }) => (
  <div className="horizontal-bar">
    <ResponsiveBar
      data={data.sort((a, b) => a[keys[0]] - b[keys[0]])}
      keys={keys}
      indexBy="title"
      margin={{
        top: 38,
        right: 28,
        bottom: 25,
        left: 120,
      }}
      padding={0.3}
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
        tickValues: 6,
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
          v.length > 12 ? (
            <tspan>
              {
                // eslint-disable-next-line react/destructuring-assignment
                `${v.substring(0, 12)}...`
              }
              <title>{v}</title>
            </tspan>
          ) : (
            v
          ),
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
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'top-right',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: -28,
          itemsSpacing: 2,
          itemWidth: 70,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolShape: 'circle',
          symbolSize: 13,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  </div>
);

export default HorizontalBar;
