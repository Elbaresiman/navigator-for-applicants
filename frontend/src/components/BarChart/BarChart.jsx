import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { specialties, subCompetencies } from '../../data/questions';
import styles from './BarChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ type, data, level_filter }) => {
  if (type === 'horizontal') {
    return <HorizontalBarChart data={data} level_filter={level_filter} />;
  }
  return <VerticalBarChart data={data} />;
};

const HorizontalBarChart = ({ data, level_filter }) => {
  const filteredSpecs = Object.entries(data.specs_percent || {})
    .filter(([code]) => {
      if (level_filter === 'all') return true;
      if (level_filter === 'only_college') return specialties[code]?.level === 'college';
      if (level_filter === 'only_bachelor') return specialties[code]?.level === 'bachelor';
      return true;
    })
    .sort((a, b) => b[1] - a[1]);

  const labels = filteredSpecs.map(([code]) => {
    const spec = specialties[code];
    if (!spec) return code;
    const levelText = spec.level === 'college' ? 'Колледж' : 'Бакалавр';
    return `${spec.name} — ${levelText}`;
  });
  const values = filteredSpecs.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map(v => {
          const ratio = v / 100;
          return `rgba(${Math.round(255 - ratio * 129)}, ${Math.round(179 + ratio * 60)}, ${Math.round(71 - ratio * 16)}, 0.8)`;
        }),
        borderColor: values.map(v => {
          const ratio = v / 100;
          return `rgb(${Math.round(255 - ratio * 129)}, ${Math.round(179 + ratio * 60)}, ${Math.round(71 - ratio * 16)})`;
        }),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 28
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 20
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(26, 42, 58, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: { size: 12 },
          color: '#6C7A8A',
          stepSize: 20
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12, weight: '500' },
          color: '#1A2A3A',
          crossAlign: 'far',
          autoSkip: false,
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            const words = label.split(' ');
            const lines = [];
            let currentLine = '';
            const maxCharsPerLine = 30;
            
            for (const word of words) {
              if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
                lines.push(currentLine.trim());
                currentLine = word;
              } else {
                currentLine = (currentLine + ' ' + word).trim();
              }
            }
            if (currentLine) lines.push(currentLine);
            return lines;
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A2A3A',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: function(items) {
            if (items.length > 0) {
              return items[0].label.replace('\n', ' ');
            }
            return '';
          },
          label: (context) => `Соответствие: ${context.parsed.x}%`
        }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>КАКАЯ СПЕЦИАЛЬНОСТЬ ПОДХОДИТ</h3>
      <div className={styles.chartWrapper}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

const VerticalBarChart = ({ data }) => {
  const labels = Object.keys(data.sub_percent || {}).map(
    key => subCompetencies[key] || key
  );
  const values = Object.values(data.sub_percent || {});

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map(v => {
          const ratio = v / 100;
          return `rgba(${Math.round(255 - ratio * 209)}, ${Math.round(179 + ratio * 60)}, ${Math.round(71 - ratio * 16)}, 0.8)`;
        }),
        borderColor: values.map(v => {
          const ratio = v / 100;
          return `rgb(${Math.round(255 - ratio * 209)}, ${Math.round(179 + ratio * 60)}, ${Math.round(71 - ratio * 16)})`;
        }),
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 40
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(26, 42, 58, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: { size: 12 },
          color: '#6C7A8A',
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11, weight: '500' },
          color: '#1A2A3A',
          maxRotation: 45,
          minRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            const words = label.split(' ');
            if (words.length <= 2) return label;
            return words.map(w => w.length > 8 ? w.substring(0, 8) + '…' : w).join(' ');
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A2A3A',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.labels?.[context.dataIndex] || context.label}: ${context.parsed.y}%`
        }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>ИНТЕРАКТИВНЫЙ ПОРТРЕТ КОМПЕТЕНЦИЙ И ПРОБЕЛОВ</h3>
      <div className={styles.chartWrapper}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
