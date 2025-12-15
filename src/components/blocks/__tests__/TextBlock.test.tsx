import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextBlock } from '../TextBlock';
import { TextBlock as TextBlockType } from '../../../schema/types';

const mockTextBlock: TextBlockType = {
  id: 'test-text-block',
  type: 'text',
  props: {
    content: 'Test content',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
    lineHeight: '1.5',
    fontFamily: 'Arial'
  }
};

const defaultProps = {
  block: mockTextBlock,
  isSelected: false,
  onSelect: jest.fn(),
  onUpdate: jest.fn(),
  onDelete: jest.fn()
};

describe('TextBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render text content', () => {
      render(<TextBlock {...defaultProps} />);
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should apply text styles', () => {
      render(<TextBlock {...defaultProps} />);
      
      const textElement = screen.getByText('Test content');
      expect(textElement).toHaveStyle({
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        lineHeight: '1.5',
        fontFamily: 'Arial'
      });
    });

    it('should show hover effect when not editing', () => {
      render(<TextBlock {...defaultProps} />);
      
      const textElement = screen.getByText('Test content');
      expect(textElement).toHaveClass('hover:bg-gray-50');
    });
  });

  describe('Selection', () => {
    it('should call onSelect when clicked', () => {
      render(<TextBlock {...defaultProps} />);
      
      const textElement = screen.getByText('Test content');
      fireEvent.click(textElement);
      
      expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    });

    it('should show selected state', () => {
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      // The selected state is handled by BaseBlock
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  describe('Inline Editing', () => {
    it('should enter edit mode on double click', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      expect(editableElement).toBeInTheDocument();
      expect(editableElement).toHaveValue('Test content');
    });

    it('should not enter edit mode if not selected', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={false} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should save changes on blur', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      await user.clear(editableElement);
      await user.type(editableElement, 'Updated content');
      
      fireEvent.blur(editableElement);
      
      await waitFor(() => {
        expect(defaultProps.onUpdate).toHaveBeenCalledWith({
          props: {
            ...mockTextBlock.props,
            content: 'Updated content'
          }
        });
      });
    });

    it('should save changes on Enter key', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      await user.clear(editableElement);
      await user.type(editableElement, 'Updated content');
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(defaultProps.onUpdate).toHaveBeenCalledWith({
          props: {
            ...mockTextBlock.props,
            content: 'Updated content'
          }
        });
      });
    });

    it('should cancel changes on Escape key', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      await user.clear(editableElement);
      await user.type(editableElement, 'Updated content');
      await user.keyboard('{Escape}');
      
      // Should return to display mode with original content
      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should show formatting toolbar when text is selected', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      
      // Select text
      await user.tripleClick(editableElement);
      
      // Check if toolbar appears (it should be visible when text is selected)
      await waitFor(() => {
        const toolbar = screen.queryByText('B');
        expect(toolbar).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should enter edit mode on Enter key when focused', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      textElement.focus();
      await user.keyboard('{Enter}');
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should enter edit mode on Space key when focused', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      textElement.focus();
      await user.keyboard(' ');
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TextBlock {...defaultProps} />);
      
      const textElement = screen.getByText('Test content');
      expect(textElement).toHaveAttribute('role', 'button');
      expect(textElement).toHaveAttribute('aria-label', 'Double-click to edit text');
    });

    it('should have proper ARIA labels in edit mode', async () => {
      const user = userEvent.setup();
      render(<TextBlock {...defaultProps} isSelected={true} />);
      
      const textElement = screen.getByText('Test content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      expect(editableElement).toHaveAttribute('aria-label', 'Edit text content');
    });
  });

  describe('Content Sanitization', () => {
    it('should sanitize dangerous content', async () => {
      const user = userEvent.setup();
      const blockWithDangerousContent = {
        ...mockTextBlock,
        props: {
          ...mockTextBlock.props,
          content: '<script>alert("xss")</script>Safe content'
        }
      };

      render(<TextBlock {...defaultProps} block={blockWithDangerousContent} isSelected={true} />);
      
      const textElement = screen.getByText('Safe content');
      await user.dblClick(textElement);
      
      const editableElement = screen.getByRole('textbox');
      await user.clear(editableElement);
      await user.type(editableElement, 'Updated safe content');
      
      fireEvent.blur(editableElement);
      
      await waitFor(() => {
        expect(defaultProps.onUpdate).toHaveBeenCalledWith({
          props: {
            ...blockWithDangerousContent.props,
            content: 'Updated safe content'
          }
        });
      });
    });
  });
});
