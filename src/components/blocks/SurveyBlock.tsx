import React, { useState } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface SurveyBlockProps {
  id: string;
  type: 'survey';
  props: {
    title?: string;
    description?: string;
    questions?: Array<{
      id: string;
      type: 'single' | 'multiple' | 'text' | 'rating' | 'scale';
      question: string;
      options?: string[];
      required?: boolean;
      minRating?: number;
      maxRating?: number;
      scaleLabels?: {
        min: string;
        max: string;
      };
    }>;
    submitText?: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    textAlign?: 'left' | 'center' | 'right';
    buttonColor?: string;
    buttonTextColor?: string;
    buttonPadding?: string;
    buttonBorderRadius?: string;
    showProgress?: boolean;
  };
}

const defaultQuestions = [
  {
    id: 'q1',
    type: 'single' as const,
    question: 'How satisfied are you with our service?',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
    required: true
  },
  {
    id: 'q2',
    type: 'rating' as const,
    question: 'Rate our product quality',
    minRating: 1,
    maxRating: 5,
    required: true
  },
  {
    id: 'q3',
    type: 'text' as const,
    question: 'Any additional comments?',
    required: false
  }
];

export const SurveyBlock: React.FC<{
  block: SurveyBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    title = 'Customer Survey',
    description = 'Help us improve by sharing your feedback',
    questions = defaultQuestions,
    submitText = 'Submit Survey',
    backgroundColor = '#f8f9fa',
    padding = '30px',
    borderRadius = '8px',
    border = '1px solid #e5e7eb',
    textAlign = 'left',
    buttonColor = '#007bff',
    buttonTextColor = '#ffffff',
    buttonPadding = '12px 24px',
    buttonBorderRadius = '6px',
    showProgress = true
  } = block.props;

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderRadius,
    border,
    textAlign,
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
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
  };

  const progressStyle: React.CSSProperties = {
    width: '100%',
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginBottom: '20px',
    overflow: 'hidden',
  };

  const progressBarStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: buttonColor,
    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
    transition: 'width 0.3s ease',
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // console.log('Survey responses:', responses);
    alert('Thank you for your feedback!');
  };

  const renderQuestion = (question: any) => {
    const questionStyle: React.CSSProperties = {
      marginBottom: '20px',
    };

    const labelStyle: React.CSSProperties = {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      fontSize: '16px',
      color: '#374151',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px',
      fontFamily: 'inherit',
    };

    switch (question.type) {
      case 'single':
        return (
          <div style={questionStyle}>
            <label style={labelStyle}>
              {question.question}
              {question.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            {question.options?.map((option: string, index: number) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div style={questionStyle}>
            <label style={labelStyle}>
              {question.question}
              {question.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            {question.options?.map((option: string, index: number) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  value={option}
                  checked={responses[question.id]?.includes(option) || false}
                  onChange={(e) => {
                    const current = responses[question.id] || [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...current, option]);
                    } else {
                      handleResponseChange(question.id, current.filter((item: string) => item !== option));
                    }
                  }}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div style={questionStyle}>
            <label style={labelStyle}>
              {question.question}
              {question.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }, (_, i) => {
                const rating = (question.minRating || 1) + i;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleResponseChange(question.id, rating)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '2px solid #d1d5db',
                      backgroundColor: responses[question.id] >= rating ? buttonColor : 'white',
                      color: responses[question.id] >= rating ? buttonTextColor : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {rating}
                  </button>
                );
              })}
            </div>
            {question.scaleLabels && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                <span>{question.scaleLabels.min}</span>
                <span>{question.scaleLabels.max}</span>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div style={questionStyle}>
            <label style={labelStyle}>
              {question.question}
              {question.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your response..."
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
          </div>
        );

      default:
        return null;
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
      <div style={containerStyle}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
          {title}
        </h3>
        {description && (
          <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '16px' }}>
            {description}
          </p>
        )}
        
        {showProgress && questions.length > 1 && (
          <div style={progressStyle}>
            <div style={progressBarStyle}></div>
          </div>
        )}
        
        {questions.length > 0 && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
              {renderQuestion(questions[currentQuestion])}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                style={{
                  ...buttonStyle,
                  backgroundColor: currentQuestion === 0 ? '#e5e7eb' : '#6b7280',
                  color: currentQuestion === 0 ? '#9ca3af' : 'white',
                  width: 'auto',
                  padding: '8px 16px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button type="button" onClick={handleSubmit} style={buttonStyle}>
                  {submitText}
                </button>
              ) : (
                <button type="button" onClick={handleNext} style={buttonStyle}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
