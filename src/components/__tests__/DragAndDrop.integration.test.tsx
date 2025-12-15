import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
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

describe('Drag and Drop Integration', () => {
  const mockStore = {
    blocks: [],
    selectedBlockId: null,
    history: [[]],
    historyIndex: 0,
    isDragging: false,
    addBlock: jest.fn(),
    updateBlock: jest.fn(),
    deleteBlock: jest.fn(),
    selectBlock: jest.fn(),
    moveBlock: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    saveToHistory: jest.fn(),
    clearHistory: jest.fn(),
    canUndo: jest.fn(() => false),
    canRedo: jest.fn(() => false),
    setDragging: jest.fn(),
    clearCanvas: jest.fn(),
    loadCanvas: jest.fn(),
    // New properties
    viewDevice: 'desktop',
    isPreviewMode: false,
    isFullscreen: false,
    hoveredBlockId: null,
    setViewDevice: jest.fn(),
    togglePreviewMode: jest.fn(),
    toggleFullscreen: jest.fn(),
    setHoveredBlockId: jest.fn(),
    duplicateBlock: jest.fn(),
    moveBlockUp: jest.fn(),
    moveBlockDown: jest.fn(),
    setBlocks: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCanvasStore.mockReturnValue(mockStore);
  });

  describe('Block Addition', () => {
    it('should add a text block when clicked from sidebar', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Find and click the text block in sidebar
      const textBlock = screen.getByText('Text');
      await user.click(textBlock);

      expect(mockStore.addBlock).toHaveBeenCalledWith({
        type: 'text',
        props: {
          content: 'Text content',
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left',
          lineHeight: '1.5',
          fontFamily: 'Arial'
        }
      });
    });

    it('should add an image block when clicked from sidebar', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Find and click the image block in sidebar
      const imageBlock = screen.getByText('Image');
      await user.click(imageBlock);

      expect(mockStore.addBlock).toHaveBeenCalledWith({
        type: 'image',
        props: {
          src: '',
          alt: 'Image',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '0px'
        }
      });
    });

    it('should add a button block when clicked from sidebar', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Find and click the button block in sidebar
      const buttonBlock = screen.getByText('Button');
      await user.click(buttonBlock);

      expect(mockStore.addBlock).toHaveBeenCalledWith({
        type: 'button',
        props: {
          text: 'Button',
          href: '',
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'normal',
          border: 'none'
        }
      });
    });
  });

  describe('Canvas Interaction', () => {
    it('should show empty state when no blocks', () => {
      render(<App />);

      expect(screen.getByText('Start building your page')).toBeInTheDocument();
      expect(screen.getByText('Drag blocks from the sidebar or click to add them')).toBeInTheDocument();
    });

    it('should render blocks when they exist', () => {
      const blocksWithContent = {
        ...mockStore,
        blocks: [
          {
            id: 'text-1',
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
          }
        ]
      };

      mockUseCanvasStore.mockReturnValue(blocksWithContent);
      render(<App />);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should select block when clicked', async () => {
      const user = userEvent.setup();
      const blocksWithContent = {
        ...mockStore,
        blocks: [
          {
            id: 'text-1',
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
          }
        ]
      };

      mockUseCanvasStore.mockReturnValue(blocksWithContent);
      render(<App />);

      const textBlock = screen.getByText('Test content');
      await user.click(textBlock);

      expect(mockStore.selectBlock).toHaveBeenCalledWith('text-1');
    });
  });

  describe('Sidebar Functionality', () => {
    it('should display all available block types', () => {
      render(<App />);

      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Section')).toBeInTheDocument();
      expect(screen.getByText('Row')).toBeInTheDocument();

    });

    it('should show instructions', () => {
      render(<App />);

      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText('Drag blocks to the canvas to start building your page. Click on blocks to select and edit them.')).toBeInTheDocument();
    });
  });

  describe('Inspector Functionality', () => {
    it('should show inspector when block is selected', () => {
      const blocksWithSelection = {
        ...mockStore,
        selectedBlockId: 'text-1',
        blocks: [
          {
            id: 'text-1',
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
          }
        ]
      };

      mockUseCanvasStore.mockReturnValue(blocksWithSelection);
      render(<App />);

      expect(screen.getByText('Block Properties')).toBeInTheDocument();
    });

    it('should hide inspector when no block is selected', () => {
      render(<App />);

      expect(screen.queryByText('Block Properties')).not.toBeInTheDocument();
    });
  });

  describe('Toolbar Functionality', () => {
    it('should show undo/redo buttons', () => {
      render(<App />);

      expect(screen.getByText('Undo')).toBeInTheDocument();
      expect(screen.getByText('Redo')).toBeInTheDocument();
    });

    it('should show export and clear buttons', () => {
      render(<App />);

      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('should show history indicator', () => {
      render(<App />);

      expect(screen.getByText('History:')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle undo shortcut', async () => {
      const user = userEvent.setup();
      const storeWithUndo = {
        ...mockStore,
        canUndo: jest.fn(() => true)
      };

      mockUseCanvasStore.mockReturnValue(storeWithUndo);
      render(<App />);

      await user.keyboard('{Control>}z{/Control}');

      expect(mockStore.undo).toHaveBeenCalledTimes(1);
    });

    it('should handle redo shortcut', async () => {
      const user = userEvent.setup();
      const storeWithRedo = {
        ...mockStore,
        canRedo: jest.fn(() => true)
      };

      mockUseCanvasStore.mockReturnValue(storeWithRedo);
      render(<App />);

      await user.keyboard('{Control>}y{/Control}');

      expect(mockStore.redo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Export Modal', () => {
    it('should open export modal when export button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      const exportButton = screen.getByText('Export');
      await user.click(exportButton);

      expect(screen.getByTestId('export-modal')).toBeInTheDocument();
    });
  });
});
