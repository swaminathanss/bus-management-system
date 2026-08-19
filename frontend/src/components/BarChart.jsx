const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {data.map((d) => (
        <div key={d.label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-soft)', marginBottom: 4 }}>
            <span style={{ textTransform: 'uppercase' }}>{d.label}</span>
            <span>{d.value}</span>
          </div>
          <div style={{ background: 'var(--color-line)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, background: d.color, height: '100%', borderRadius: 6, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;