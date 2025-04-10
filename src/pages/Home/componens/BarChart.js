import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const BarChart = ({ title, xData, yData, data, chartType = 'bar' }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    
    const option = {
      title: { text: title },
      xAxis: { type: 'category', data: xData || [] },
      yAxis: { type: 'value' },
      series: [{
        data: yData || [],
        type: chartType === 'pie' ? 'pie' : 'bar'
      }]
    };

    if (chartType === 'pie') {
      option.series[0].data = (data || []).map(item => ({
        value: item.value,
        name: item.name
      }));
    }

    myChart.setOption(option);
    
    return () => myChart.dispose();
  }, [title, xData, yData, data, chartType]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
};

export default BarChart;