import { useMemo } from 'react';
import styles from './RadarChart.module.css';

const RadarChart = ({ meta_percent }) => {
  const values = useMemo(
    () => [
      meta_percent?.cognitive || 0,
      meta_percent?.social || 0,
      meta_percent?.digital || 0
    ],
    [meta_percent]
  );

  const labels = ['Когнитивная', 'Социально-коммуникативная', 'Цифровая'];
  const icons = ['🧠', '💬', '💻'];

  const size = 420;
  const center = size / 2;
  const maxRadius = 130;
  const levels = 5;

  const angleForIndex = (i) => (Math.PI * 2 * i) / 3 - Math.PI / 2;

  const getPoint = (value, i) => {
    const angle = angleForIndex(i);
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = values.map((v, i) => getPoint(v, i));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  const gridRadii = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * maxRadius);
  const axisEnds = [0, 1, 2].map((i) => getPoint(100, i));
  const levelLabels = [20, 40, 60, 80, 100];

  return (
    <div className={styles.radarContainer}>
      <h3 className={styles.title}>ТВОЙ ПРОФИЛЬ ЦИФРОВОГО СОЗНАНИЯ</h3>
      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${size} ${size}`} className={styles.radarSvg}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Фоновый круг */}
          <circle
            cx={center}
            cy={center}
            r={maxRadius + 8}
            fill="none"
            stroke="rgba(0, 180, 216, 0.15)"
            strokeWidth="2"
            className={styles.bgRing}
          />

          {/* Сетка — круги */}
          {gridRadii.map((r, i) => (
            <g key={`grid-${i}`}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="rgba(26, 42, 58, 0.08)"
                strokeWidth="1"
              />
              {/* Метки уровней на верхней оси */}
              <text
                x={center}
                y={center - r}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.levelLabel}
              >
                {levelLabels[i]}
              </text>
            </g>
          ))}

          {/* Сетка — оси */}
          {axisEnds.map((end, i) => (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(26, 42, 58, 0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Центральная точка */}
          <circle cx={center} cy={center} r="3" fill="rgba(0, 180, 216, 0.4)" />
          <circle cx={center} cy={center} r="1.5" fill="#00B4D8" filter="url(#softGlow)" />

          {/* Полигон данных */}
          <path
            d={pathData}
            fill="rgba(255, 107, 53, 0.3)"
            stroke="#FF6B35"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#glow)"
            className={styles.polygonAnim}
          />

          {/* Точки данных */}
          {points.map((p, i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="#00B4D8"
                opacity="0.2"
                className={styles.pointPulse}
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#00B4D8"
                stroke="#fff"
                strokeWidth="2"
                filter="url(#glow)"
                className={styles.pointPop}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </g>
          ))}

          {/* Подписи компетенций */}
          {axisEnds.map((end, i) => {
            const angle = angleForIndex(i);
            const labelR = maxRadius + 38;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);
            return (
              <g key={`lbl-${i}`}>
                <text
                  x={lx}
                  y={ly - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.axisLabel}
                >
                  {icons[i]} {labels[i]}
                </text>
                <text
                  x={lx}
                  y={ly + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.axisValue}
                >
                  {values[i]}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className={styles.description}>
        Диаграмма показывает соотношение твоих когнитивных, социальных и цифровых компетенций
      </p>
    </div>
  );
};

export default RadarChart;
