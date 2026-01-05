import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, FormBlock as FormBlockType } from '../../schema/types';

import { DEFAULT_FORM_FIELDS } from './formConstants';

// export const DEFAULT_FORM_FIELDS = ... (Removed)

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
    submitAction = 'email',
    fields = DEFAULT_FORM_FIELDS,
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
    // if (isSelected) return; // Allow typing while selected
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
    // Allow submission testing while selected
    /* if (isSelected) {
      onSelect();
      return;
    } */
    // Simple validation logic (simplified for brevity but functional)
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !formData[f.id]) newErrors[f.id] = 'Required';
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // --- Submission Handling ---
    // Use scoped variables (submitAction has default)
    // Note: emailTo comes from props destructuring at top as well?
    // Let's check if emailTo is destructured at top. No it wasn't in original.
    // I need to destructure emailTo and successMessage at top if I want to use them consistently, or just read from props here.
    // But for submitAction I MUST use the one with default.
    const { emailTo, successMessage } = block.props;

    if (submitAction === 'email') {
      if (!emailTo) {
        alert('Configuration Missing: Please set a "To Email" address in the Block Settings.');
        return;
      }

      // Construct body
      const subject = encodeURIComponent(`New form submission: ${title}`);
      const body = encodeURIComponent(
        Object.entries(formData)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n')
      );

      // Check for Gmail preference
      if (block.props.useGmail) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
      } else {
        window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
      }
    } else {
      alert(successMessage || 'Form submitted! (Demo only)');
    }
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
            {showTitle && <h3 className="text-xl font-bold mb-1">{title}</h3>}
            {showDescription && <p className="text-sm opacity-80">{description}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center opacity-80">
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

                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              ) : field.type === 'select' ? (
                <select
                  style={inputStyle}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}

                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
                >
                  <option value="">{field.placeholder || 'Select...'}</option>
                  {(field as any).options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  style={inputStyle}
                  placeholder={field.placeholder}
                  value={formData[field.id] as string || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}

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