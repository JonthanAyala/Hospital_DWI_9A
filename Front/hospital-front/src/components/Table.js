import React from 'react';
import './Table.css';

const Table = ({ columns, data = [], actions = [] }) => {
  // Asegurar que data es un array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="no-data">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            safeData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="actions-cell">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className={`action-btn ${action.className || ''}`}
                        onClick={() => action.onClick(row)}
                        disabled={action.disabled && action.disabled(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
