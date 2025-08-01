import React from 'react';
import './FormField.css';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  options = [],
  disabled = false 
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-input ${error ? 'error' : ''}`}
            required={required}
            disabled={disabled}
          >
            <option value="">Seleccionar...</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input ${error ? 'error' : ''}`}
            required={required}
            disabled={disabled}
            rows={4}
          />
        );
      
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input ${error ? 'error' : ''}`}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {renderInput()}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormField;
