import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#c7d7ef',
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#8fa6c3' },
      grid: { color: 'rgba(255,255,255,0.06)' },
    },
    y: {
      ticks: { color: '#8fa6c3' },
      grid: { color: 'rgba(255,255,255,0.06)' },
    },
  },
};

export default function AnalyticsChart({ type = 'line', data, options, className = '' }) {
  const chartProps = {
    data,
    options: { ...baseOptions, ...options },
  };

  return (
    <div className={`glass-panel rounded-3xl p-5 ${className}`}>
      <div className="h-80">
        {type === 'bar' ? <Bar {...chartProps} /> : type === 'doughnut' ? <Doughnut {...chartProps} /> : <Line {...chartProps} />}
      </div>
    </div>
  );
}
