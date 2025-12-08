import React from 'react';

interface FiltersProps {
  onFilter: (filter: string) => void;
  currentFilter: string;
}

const Filters: React.FC<FiltersProps> = ({ onFilter, currentFilter }) => {
  const filters = ['All', 'New', 'Trending', 'High Price', 'Low Price'];

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
      {filters.map((f) => (
        <button key={f} onClick={() => onFilter(f)} style={{ fontWeight: currentFilter === f ? 'bold' : 'normal' }}>
          {f}
        </button>
      ))}
    </div>
  );
};

export default Filters;
