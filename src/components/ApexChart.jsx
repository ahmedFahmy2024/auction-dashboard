import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

function ApexChart({ charts }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: '20px',
                color: '#a2a2a2'
              }
            }
          },
          colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  });

  useEffect(() => {
    if (charts && charts.user_counts) {
      const series = Object.values(charts.user_counts);
      const labels = Object.keys(charts.user_counts);

      setChartData({
        series: series,
        options: {
          ...chartData.options,
          labels: labels
        }
      });
    }
  }, [charts]);

  if (!charts || !charts.user_counts) {
    return <div>Loading...</div>;
  }

  return (
    <div className={theme.palette.mode === 'light' ? 'light' : 'dark'} style={{ marginTop: '30px' }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient1">
            <stop offset="0%" stopColor="#00E396" stopOpacity="1" />
            <stop offset="100%" stopColor="#FEB019" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="donut" height="400" className="hello-donut" />
      </div>
      <div id="html-dist"></div>
    </div>
  )
}

export default ApexChart;
