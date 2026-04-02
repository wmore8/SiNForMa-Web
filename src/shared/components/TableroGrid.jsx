// src/shared/components/TableroGrid.jsx

export function TableroGrid({ grid, onCellClick }) {
  return (
    <div className="tablas-grid">
      {grid.map(casilla => (
        <div
          key={casilla.id}
          className={`tabla-celda ${casilla.type} ${casilla.status}`}
          onClick={() => onCellClick(casilla)}
        >
          {casilla.currentText}
        </div>
      ))}
    </div>
  );
}