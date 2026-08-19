import { useEffect, useRef } from 'react';

const BusUnit = ({ bus, isMine }) => {
  const bodyY = 32;
  const bodyHeight = 46;
  return (
    <svg viewBox="0 0 90 96" width="90" height="96">
      {isMine && (
        <text x="45" y="10" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="#FFB100">YOU ARE HERE</text>
      )}
      <text x="45" y="26" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={isMine ? '#FFB100' : '#4A5568'}>
        {bus.parkingSlotNumber}
      </text>
      <rect
        x="2"
        y={bodyY}
        width="86"
        height={bodyHeight}
        rx="10"
        fill={isMine ? '#14213D' : '#FFFFFF'}
        stroke={isMine ? '#FFB100' : '#DCE1E7'}
        strokeWidth={isMine ? 3 : 1.5}
      />
      <rect x="10" y={bodyY + 8} width="70" height="10" rx="3" fill={isMine ? 'rgba(255,255,255,0.15)' : '#EEF1F4'} />
      <text x="45" y={bodyY + 36} textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fontWeight="600" fill={isMine ? '#FFFFFF' : '#14213D'}>
        {bus.busNumber}
      </text>
      <circle cx="22" cy={bodyY + bodyHeight} r="6" fill={isMine ? '#FFB100' : '#4A5568'} />
      <circle cx="68" cy={bodyY + bodyHeight} r="6" fill={isMine ? '#FFB100' : '#4A5568'} />
    </svg>
  );
};

const CampusMap = ({ buses, highlightSlot }) => {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [buses, highlightSlot]);

  if (!buses || buses.length === 0) {
    return <p style={{ color: 'var(--color-ink-soft)', fontSize: 13 }}>No buses in the fleet yet.</p>;
  }

  return (
    <div className="campus-panel">
      <svg viewBox="0 0 700 140" style={{ width: '100%', height: 'auto', marginBottom: 10 }}>
        <rect x="30" y="20" width="180" height="90" rx="10" fill="#DCE1E7" />
        <text x="120" y="70" textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="#4A5568">Main Block</text>
        <rect x="240" y="20" width="140" height="90" rx="10" fill="#DCE1E7" />
        <text x="310" y="70" textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="#4A5568">Library</text>
        <rect x="410" y="20" width="260" height="90" rx="10" fill="#DCE1E7" />
        <text x="540" y="70" textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="#4A5568">Hostel Block</text>
      </svg>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-soft)', letterSpacing: '0.05em', marginBottom: 10 }}>
        BUS PARKING BAY &mdash; {buses.length} buses on campus
      </div>

      <div className="bus-bay-scroll">
        <div className="bus-bay-wrap">
          {buses.map((bus) => {
            const isMine = bus.parkingSlotNumber === highlightSlot;
            return (
              <div key={bus._id} ref={isMine ? myRef : null}>
                <BusUnit bus={bus} isMine={isMine} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampusMap;