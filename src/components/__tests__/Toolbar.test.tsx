import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '../layout/Toolbar';
import { useCanvasStore } from '../../store/canvasStore';

// Mock the canvas store
jest.mock('../../store/canvasStore');
const mockUseCanvasStore = useCanvasStore as jest.MockedFunction<typeof useCanvasStore>;

// Mock the ExportModal component
jest.mock('../modals/ExportModal', () => ({
  ExportModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="export-modal">
      <button onClick={onClose}>Close Export</button>
    </div>
  )
}));

describe('Toolbar', () => {
  const mockStore = {
    undo: jest.fn(),
    redo: jest.fn(),
    clearCanvas: jest.fn(),
    canUndo: jest.fn(() => false),
    canRedo: jest.fn(() => false),
    viewDevice: 'desktop',
    isPreviewMode: false,
    isFullscreen: false,
    setViewDevice: jest.fn(),
    togglePreviewMode: jest.fn(),
    toggleFullscreen: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCanvasStore.mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render the BuilderX title', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      expect(screen.getByText('BuilderX')).toBeInTheDocument();
    });

    it('should render undo and redo buttons', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      expect(screen.getByText('Undo')).toBeInTheDocument();
      expect(screen.getByText('Redo')).toBeInTheDocument();
    });

    it('should render export and clear buttons', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('should render history indicator', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      expect(screen.getByText('History:')).toBeInTheDocument();
    });
  });

  describe('Undo/Redo Functionality', () => {
    it('should call undo when undo button is clicked', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const undoButton = screen.getByText('Undo');
      fireEvent.click(undoButton);

      expect(mockStore.undo).toHaveBeenCalledTimes(1);
    });

    it('should call redo when redo button is clicked', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const redoButton = screen.getByText('Redo');
      fireEvent.click(redoButton);

      expect(mockStore.redo).toHaveBeenCalledTimes(1);
    });

    it('should disable undo button when canUndo returns false', () => {
      mockStore.canUndo.mockReturnValue(false);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const undoButton = screen.getByText('Undo');
      expect(undoButton).toBeDisabled();
    });

    it('should enable undo button when canUndo returns true', () => {
      mockStore.canUndo.mockReturnValue(true);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const undoButton = screen.getByText('Undo');
      expect(undoButton).not.toBeDisabled();
    });

    it('should disable redo button when canRedo returns false', () => {
      mockStore.canRedo.mockReturnValue(false);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const redoButton = screen.getByText('Redo');
      expect(redoButton).toBeDisabled();
    });

    it('should enable redo button when canRedo returns true', () => {
      mockStore.canRedo.mockReturnValue(true);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const redoButton = screen.getByText('Redo');
      expect(redoButton).not.toBeDisabled();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should call undo on Ctrl+Z', async () => {
      const user = userEvent.setup();
      mockStore.canUndo.mockReturnValue(true);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      await user.keyboard('{Control>}z{/Control}');

      expect(mockStore.undo).toHaveBeenCalledTimes(1);
    });

    it('should call redo on Ctrl+Y', async () => {
      const user = userEvent.setup();
      mockStore.canRedo.mockReturnValue(true);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      await user.keyboard('{Control>}y{/Control}');

      expect(mockStore.redo).toHaveBeenCalledTimes(1);
    });

    it('should call redo on Ctrl+Shift+Z', async () => {
      const user = userEvent.setup();
      mockStore.canRedo.mockReturnValue(true);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');

      expect(mockStore.redo).toHaveBeenCalledTimes(1);
    });

    it('should not call undo when canUndo returns false', async () => {
      const user = userEvent.setup();
      mockStore.canUndo.mockReturnValue(false);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      await user.keyboard('{Control>}z{/Control}');

      expect(mockStore.undo).not.toHaveBeenCalled();
    });

    it('should not call redo when canRedo returns false', async () => {
      const user = userEvent.setup();
      mockStore.canRedo.mockReturnValue(false);
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      await user.keyboard('{Control>}y{/Control}');

      expect(mockStore.redo).not.toHaveBeenCalled();
    });
  });

  describe('Export Modal', () => {
    it('should show export modal when export button is clicked', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);

      expect(screen.getByTestId('export-modal')).toBeInTheDocument();
    });

    it('should hide export modal when close is clicked', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);

      const closeButton = screen.getByText('Close Export');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('export-modal')).not.toBeInTheDocument();
    });
  });

  describe('Clear Canvas', () => {
    it('should call clearCanvas when clear button is clicked', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(mockStore.clearCanvas).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tooltips', () => {
    it('should have proper tooltips for undo/redo buttons', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const undoButton = screen.getByText('Undo');
      const redoButton = screen.getByText('Redo');

      expect(undoButton).toHaveAttribute('title', 'Undo (Ctrl+Z)');
      expect(redoButton).toHaveAttribute('title', 'Redo (Ctrl+Y)');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<Toolbar onToggleComponents={jest.fn()} componentsPanelOpen={false} />);

      const undoButton = screen.getByText('Undo');
      const redoButton = screen.getByText('Redo');
      const exportButton = screen.getByText('Export');
      const clearButton = screen.getByText('Clear');

      expect(undoButton).toHaveAttribute('type', 'button');
      expect(redoButton).toHaveAttribute('type', 'button');
      expect(exportButton).toHaveAttribute('type', 'button');
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  });
});
