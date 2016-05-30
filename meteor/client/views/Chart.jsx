import React, { PropTypes } from 'react';
import { VictoryBar, VictoryAxis, VictoryChart, VictoryLabel } from 'victory';

function truncateTextWithEllipses(text) {
  console.log(arguments);
  if (!text) {
    return '?';
  }
  const maxLength = 4;
  return text.substring(0, maxLength) + (text.length > maxLength) ? '...' : '';
}

function getLabel(count) {
  return (
    <VictoryLabel
      textAnchor="middle"
      verticalAnchor="start"
      angle={ count > 10 ? -45 : 0 }
    />
  );
}

function Loading() {
  return <p style={{ marginTop: '40px', fontSize: '18px' }}>Loading chart data...</p>;
}

const Chart = React.createClass({
  propTypes: {
    chartData: PropTypes.array.isRequired,
    xAxisLabel: PropTypes.string.isRequired,
    yAxisLabel: PropTypes.string.isRequired,
  },

  render: function() {
    const { chartData, xAxisLabel, yAxisLabel } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        { chartData.length ?
          <VictoryChart
            width={ 500 }
          >
            <VictoryAxis
              label={ xAxisLabel }
              orientation="bottom"
              tickFormat={ truncateTextWithEllipses }
            />
            <VictoryAxis
              dependentAxis
              label={ yAxisLabel }
              style={{
                grid: {
                  stroke: "grey",
                  strokeWidth: 1,
                },
                axis: { stroke: 'transparent' },
                ticks: { stroke: 'transparent' },
              }}
            />
            <VictoryBar
              data={ chartData }
              style={{
                data: {
                  width: 12,
                  fill: 'orange',
                },
                labels: {
                  fill: 'none',
                },
              }}
              events={{
                data: {
                  onMouseOver: () => {
                    return {
                      data: {
                        style: {
                          width: 12,
                          fill: 'tomato',
                        },
                      },
                      labels: {
                        style: {
                          fill: 'tomato',
                        },
                      },
                    };
                  },
                  onMouseOut: () => {
                    return {
                      data: null,
                      labels: null,
                    };
                  },
                },
              }}
            />
          </VictoryChart>
          : <Loading />
        }
      </div>
    );
  },
});

export default Chart;
