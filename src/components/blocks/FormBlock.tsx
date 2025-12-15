import React from 'react';
import { BaseBlock } from './BaseBlock';
import { FormBlock as FormBlockType } from '../../schema/types';

interface FormBlockProps {
  block: FormBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormBlockType>) => void;
  onDelete: () => void;
}

export const FormBlock: React.FC<FormBlockProps> = ({
  block,
  isSelected,
  onSelect,
  //onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = React.useState<Record<string, string | string[]>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const {
    title = 'Contact Us',
    description = 'Get in touch with us',
    fields = [
      { id: 'name', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
      { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false }
    ],
    submitText = 'Submit',
    backgroundColor = '#f8f9fa',
    padding = '30px',
    borderRadius = '8px',
    border = '1px solid #e5e7eb',
    textAlign = 'left',
    buttonColor = '#007bff',
    buttonTextColor = '#ffffff',
    buttonPadding = '12px 24px',
    buttonBorderRadius = '6px'
  } = block.props;

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderRadius,
    border,
    textAlign: textAlign as any,
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
    padding: buttonPadding,
    borderRadius: buttonBorderRadius,
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
    marginTop: '20px',
    transition: 'background-color 0.2s'
  };

  const handleInputChange = (id: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.id]; // Value can be undefined, string, or string[]

      // Required check
      if (field.required) {
        if (!value) {
          newErrors[field.id] = `${field.label} is required`;
          isValid = false;
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            newErrors[field.id] = `${field.label} is required`;
            isValid = false;
          }
        } else if (typeof value === 'string' && !value.trim()) {
          newErrors[field.id] = `${field.label} is required`;
          isValid = false;
        }
      }

      // String-specific validations
      if (typeof value === 'string' && value) {
        // Email validation
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.id] = 'Please enter a valid email address';
          isValid = false;
        }
        // Enhanced validation
        else if (field.validation) {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            newErrors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
            isValid = false;
          }
          else if (field.validation.maxLength && value.length > field.validation.maxLength) {
            newErrors[field.id] = `${field.label} must be no more than ${field.validation.maxLength} characters`;
            isValid = false;
          }
          else if (field.validation.pattern) {
            try {
              const regex = new RegExp(field.validation.pattern);
              if (!regex.test(value)) {
                newErrors[field.id] = field.validation.errorMessage || `${field.label} is invalid`;
                isValid = false;
              }
            } catch (e) {
              console.error('Invalid regex pattern:', field.validation.pattern);
            }
          }
        }
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSelected) {
      onSelect();
      return;
    }

    if (validateForm()) {
      alert(`Form submitted successfully!\n\nData:\n${JSON.stringify(formData, null, 2)}`);
      setFormData({}); // Reset form
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
    >
      <div style={containerStyle}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
          {title}
        </h3>

        {description && (
          <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '16px' }}>
            {description}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id} style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                {field.label}
                {field.required && <span style={{ color: '#ef4444' }}> *</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={isSelected}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '100px',
                    backgroundColor: isSelected ? '#f3f4f6' : 'white',
                    cursor: isSelected ? 'default' : 'text'
                  }}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  disabled={isSelected}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: isSelected ? '#f3f4f6' : 'white',
                    cursor: isSelected ? 'default' : 'pointer'
                  }}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                field.options && field.options.length > 0 ? (
                  // Checkbox Group
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {field.options.map((option, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id={`${field.id}-${index}`}
                          checked={Array.isArray(formData[field.id]) ? (formData[field.id] as string[]).includes(option) : false}
                          onChange={(e) => {
                            const currentValues = (formData[field.id] as string[]) || [];
                            let newValues;
                            if (e.target.checked) {
                              newValues = [...currentValues, option];
                            } else {
                              newValues = currentValues.filter(v => v !== option);
                            }
                            handleInputChange(field.id, newValues);
                          }}
                          disabled={isSelected}
                          style={{ marginRight: '8px', cursor: isSelected ? 'default' : 'pointer' }}
                        />
                        <label htmlFor={`${field.id}-${index}`} style={{ margin: 0, fontWeight: 'normal', cursor: isSelected ? 'default' : 'pointer' }}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single Boolean Checkbox
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id={field.id}
                      checked={!!formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.checked ? 'true' : '')}
                      disabled={isSelected}
                      style={{ marginRight: '8px', cursor: isSelected ? 'default' : 'pointer' }}
                    />
                    <label htmlFor={field.id} style={{ margin: 0, fontWeight: 'normal' }}>
                      {field.placeholder || field.label}
                    </label>
                  </div>
                )
              ) : field.type === 'radio' ? (
                field.options && field.options.length > 0 ? (
                  // Radio Group
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {field.options.map((option, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="radio"
                          name={field.id} // Group by name
                          id={`${field.id}-${index}`}
                          value={option}
                          checked={formData[field.id] === option}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          disabled={isSelected}
                          style={{ marginRight: '8px', cursor: isSelected ? 'default' : 'pointer' }}
                        />
                        <label htmlFor={`${field.id}-${index}`} style={{ margin: 0, fontWeight: 'normal', cursor: isSelected ? 'default' : 'pointer' }}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback for Radio without options (should shouldn't really happen but handle it)
                  <div style={{ color: 'red' }}>Radio field requires options</div>
                )
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={isSelected}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: isSelected ? '#f3f4f6' : 'white',
                    cursor: isSelected ? 'default' : 'text'
                  }}
                />
              )}
              {formErrors[field.id] && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {formErrors[field.id]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: isSelected ? '#9ca3af' : buttonColor,
              cursor: isSelected ? 'default' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = buttonColor;
              }
            }}
          >
            {submitText}
          </button>
        </form>

        {/* Form info when selected */}
        {isSelected && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#4b5563'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>📋 {fields.length} fields</span>
              <span>⚙️ Use inspector to edit</span>
            </div>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};