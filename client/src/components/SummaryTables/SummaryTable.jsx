import React from 'react';
import DataTable from 'react-data-table-component';
import { denormalize } from '../../utils';

const SummaryTable = ({
  clickstream,
  clickstreamPercentages,
  tableTitle,
  columnNames,
}) => {
  const minViews = clickstream.slice(-1)[0].views;
  const maxViews = clickstream[0].views;
  const minPercentage = Math.min(...clickstreamPercentages);
  const maxPercentage = Math.max(...clickstreamPercentages);

  // styles for DataTable
  const colorGenerator = (value, min, max) =>
    `rgba(50, 166, 255, ${((value - min) / (max - min)).toFixed(1) || 0})`;
  const viewsStyles = [
    {
      when: () => true,
      style: (row) => ({
        backgroundColor: colorGenerator(row.views, minViews, maxViews),
      }),
    },
  ];
  const povStyles = [
    {
      when: () => true,
      style: (row) => ({
        backgroundColor: colorGenerator(row.pov, minPercentage, maxPercentage),
      }),
    },
  ];
  const columns = [
    {
      name: columnNames?.[0] ?? 'Title',
      selector: 'title',
      sortable: true,
      wrap: true,
    },
    {
      name: columnNames?.[1] ?? 'Views',
      selector: 'views',
      sortable: true,
      conditionalCellStyles: viewsStyles,
    },
    {
      name: columnNames?.[2] ?? 'Percentage of Views',
      selector: 'pov',
      sortable: true,
      conditionalCellStyles: povStyles,
    },
  ];

  const data = clickstream.map(({ title, views }, idx) => ({
    id: idx,
    title: denormalize(title),
    views,
    pov: parseFloat(clickstreamPercentages[idx]) || '-',
  }));

  return (
    <DataTable
      title={tableTitle}
      columns={columns}
      data={data}
      defaultSortField="views"
      defaultSortAsc={false}
    />
  );
};

export default SummaryTable;
