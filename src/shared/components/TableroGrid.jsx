// src/shared/components/TableroGrid.jsx

export function TableroGrid({ grid, onCellClick, onKeyDown }) {
  return (
    <div className="tablas-grid" style={{ "--columnas": Math.sqrt(grid.length) }}>
      {grid.map(casilla => {
        const isAdivinable = casilla.type === 'guessable';
        return (
          <div
            key={casilla.id}
            id={isAdivinable ? `celda-${casilla.id}` : undefined}
            tabIndex={isAdivinable ? 0 : -1}
            className={`tabla-celda ${casilla.type} ${casilla.status}`}
            onClick={() => onCellClick(casilla)}
            onKeyDown={(e) => {
              if (!isAdivinable) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCellClick(casilla);
              } else if (onKeyDown) {
                onKeyDown(e, casilla.id);
              }
            }}
          >
            {casilla.currentText}
          </div>
        );
      })}
    </div>
  );
}