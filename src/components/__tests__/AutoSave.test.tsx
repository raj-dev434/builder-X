

import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toolbar } from '../layout/Toolbar';
import { useCanvasStore } from '../../store/canvasStore';

// Mock the store
jest.mock('../../store/canvasStore');

describe('Auto Save Functionality', () => {
    let mockStore: any;

  beforeEach(() => {
    jest.useFakeTimers();
    mockStore = {
      // Basic Toolbar props
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
      toggleFullscreen: jest.fn(),
      selectedBlockIds: [],
      deleteBlock: jest.fn(),
      duplicateBlock: jest.fn(),
      
      // Auto Save props
      autoSave: false,
      isSaving: false,
      lastSaved: null,
      toggleAutoSave: jest.fn(),
      saveProject: jest.fn(),
      blocks: [],

      // Template props
      savedTemplates: [],
      saveTemplate: jest.fn(),
      updateTemplate: jest.fn()
    };
    (useCanvasStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (useCanvasStore as any).getState = () => mockStore;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should call saveProject when Save button is clicked', () => {
    render(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);
    
    // Find Save button (it has specific styling)
    const saveButton = screen.getByTitle('Save Project');
    fireEvent.click(saveButton);

    expect(mockStore.saveProject).toHaveBeenCalled();
  });

  it('should toggle autoSave when switch is clicked', () => {
    render(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);
    
    // Open Settings
    const settingsButton = screen.getByTitle('Settings');
    fireEvent.click(settingsButton);

    // Find Auto Save toggle
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(mockStore.toggleAutoSave).toHaveBeenCalled();
  });

  it('should trigger auto-save when blocks change and autoSave is enabled', () => {
      // Enable auto save
      mockStore.autoSave = true;
      mockStore.blocks = [{ id: '1', type: 'text' }]; // Initial blocks

      const { rerender } = render(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);

      // Simulate block change
      mockStore.blocks = [{ id: '1', type: 'text', props: { content: 'Changed' } }];
      (useCanvasStore as unknown as jest.Mock).mockReturnValue({ ...mockStore });
      
      // Rerender to trigger useEffect
      rerender(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);

      // Fast-forward time
      act(() => {
          jest.advanceTimersByTime(2000);
      });

      expect(mockStore.saveProject).toHaveBeenCalled();
  });

  it('should NOT trigger auto-save when autoSave is disabled', () => {
    // Disable auto save
    mockStore.autoSave = false;
    mockStore.blocks = [{ id: '1', type: 'text' }];

    const { rerender } = render(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);

    // Simulate block change
    mockStore.blocks = [{ id: '1', type: 'text', props: { content: 'Changed' } }];
    (useCanvasStore as unknown as jest.Mock).mockReturnValue({ ...mockStore });

    rerender(<Toolbar onToggleComponents={() => {}} componentsPanelOpen={false} />);

    act(() => {
        jest.advanceTimersByTime(2000);
    });

    expect(mockStore.saveProject).not.toHaveBeenCalled();
  });
});
