import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, FormBlock as FormBlockType } from '../../schema/types';

export const FormBlock: React.FC<{
  block: FormBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
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
    inputTextColor = 'inherit',
    inputBgColor = 'white',
    inputBorderColor = '#d1d5db',
    inputBorderRadius = '6px',
    buttonColor = '#3b82f6',
    buttonTextColor = '#ffffff',
    btnAlign = 'left',
    showTitle = true,
    showDescription = true
  } = block.props;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${inputBorderColor}`,
    borderRadius: inputBorderRadius,
    fontSize: '14px',
    color: inputTextColor,
    backgroundColor: inputBgColor,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: isSelected ? 'default' : 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    width: btnAlign === 'stretch' ? '100%' : 'auto',
    alignSelf: btnAlign === 'center' ? 'center' : btnAlign === 'end' ? 'flex-end' : 'flex-start',
    transition: 'filter 0.2s',
  };

  const handleInputChange = (id: string, value: string | string[]) => {
    if (isSelected) return;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelected) {
      onSelect();
      return;
    }
    // Simple validation logic (simplified for brevity but functional)
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !formData[f.id]) newErrors[f.id] = 'Required';
    });
    
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    
    alert('Form submitted! (Demo only)');
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
    >
      <div className="w-full flex flex-col">
        {(showTitle || showDescription) && (
          <div className="mb-6">
            {showTitle && <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>}
            {showDescription && <p className="text-sm text-gray-500 dark:text-gray-400 opacity-80">{description}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  style={inputStyle}
                  rows={4}
                  placeholder={field.placeholder}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={isSelected}
                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              ) : field.type === 'select' ? (
                <select
                  style={inputStyle}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={isSelected}
                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
                >
                  <option value="">{field.placeholder || 'Select...'}</option>
                  {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  style={inputStyle}
                  placeholder={field.placeholder}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={isSelected}
                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              )}
              
              {formErrors[field.id] && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{formErrors[field.id]}</span>
              )}
            </div>
          ))}

          <button 
            type="submit" 
            style={buttonStyle}
            className="hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            {submitText}
          </button>
        </form>
      </div>
    </BaseBlock>
  );
};