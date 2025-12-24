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
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const props = block.props as any;
  const { 
    title = 'Customer Survey',
    description = 'Help us improve by sharing your feedback',
    showTitle = true,
    showDescription = true,
    questions = defaultQuestions,
    submitText = 'Submit Survey',
    buttonColor = '#3b82f6',
    buttonTextColor = '#ffffff',
    showProgress = true,
    accentColor = '#3b82f6'
  } = props;

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    alert('Thank you for your feedback!');
  };

  const renderQuestion = (question: any) => {
    const labelClasses = "block mb-3 font-semibold text-lg text-gray-800 dark:text-gray-100";
    const inputClasses = "w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-3">
            <label className={labelClasses}>
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-3">
            <label className={labelClasses}>
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
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
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <label className={labelClasses}>
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }, (_, i) => {
                const rating = (question.minRating || 1) + i;
                const isSelected = responses[question.id] >= rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleResponseChange(question.id, rating)}
                    className={`w-12 h-12 rounded-full border-2 font-bold text-lg transition-all transform hover:scale-110 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400'
                    }`}
                    style={isSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                  >
                    {rating}
                  </button>
                );
              })}
            </div>
            {question.scaleLabels && (
              <div className="flex justify-between px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span>{question.scaleLabels.min}</span>
                <span>{question.scaleLabels.max}</span>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <label className={labelClasses}>
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Your answer here..."
              className={`${inputClasses} min-h-[120px] resize-none overflow-auto`}
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
      className="w-full flex justify-center"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
        {/* Header */}
        {(showTitle || showDescription) && (
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            {showTitle && <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{title}</h3>}
            {showDescription && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        )}

        {/* Progress */}
        {showProgress && questions.length > 1 && (
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: accentColor || buttonColor
              }}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-8">
          {questions.length > 0 ? (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
               </div>
              
               <div className="min-h-[200px] transition-all duration-300 transform">
                  {renderQuestion(questions[currentQuestion])}
               </div>
              
               <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                      currentQuestion === 0 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <button 
                      type="button" 
                      onClick={handleSubmit} 
                      className="flex-[2] py-3 px-6 rounded-lg font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                      style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                    >
                      {submitText}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleNext} 
                      className="flex-[2] py-3 px-6 rounded-lg font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                      style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                    >
                      Next Question
                    </button>
                  )}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-center">
               <div className="text-4xl mb-4 text-gray-300 dark:text-gray-800 font-bold uppercase tracking-widest select-none">📊 Empty Survey</div>
               <p className="max-w-xs text-sm">Add questions in the inspector to start gathering feedback from your users.</p>
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};
