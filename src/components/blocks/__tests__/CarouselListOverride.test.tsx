
import { getProductGridCSS } from '../ProductBlock';

// Mock dependencies
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
    useEffect: jest.fn(),
}));
jest.mock('../../../store/canvasStore', () => ({
    useCanvasStore: () => 'desktop',
}));
jest.mock('../BaseBlock', () => ({
    BaseBlock: () => null,
}));
jest.mock('../../schema/types', () => ({}));

describe('getProductGridCSS Carousel/List Overrides', () => {
    const baseProps = {
        itemsLimit: 6,
        gap: '1rem',
        gridColumns: 4,
        cardWidth: '300px',
        enableScroll: true, // Enable Scroll = Carousel OR List
        layout: 'vertical'
    };

    it('Carousel: applies Mobile overrides (small width)', () => {
        // Carousel = scroll horizontal
        const props = { ...baseProps, scrollDirection: 'horizontal' };

        // 1. Check Browser Media Query
        const cssDesktop = getProductGridCSS('test', props, 'desktop');
        expect(cssDesktop).toContain('@media (max-width: 768px)');
        expect(cssDesktop).toContain('width: 220px !important');

        // 2. Check Editor Override
        const cssMobile = getProductGridCSS('test', props, 'mobile');
        // Should appear OUTSIDE media query too (appended)
        const matches = cssMobile.match(/width: 220px !important/g);
        // Expect at least 2 occurences (one in media query, one in override)
        expect(matches?.length).toBeGreaterThanOrEqual(2);
    });

    it('List: applies Mobile overrides (column stacking)', () => {
        // List = scroll vertical
        const props = { ...baseProps, scrollDirection: 'vertical' };

        const cssMobile = getProductGridCSS('test', props, 'mobile');
        // Check for flex-direction: column !important override
        // It might be in the media query (if I added it? - checking code: I did NOT add explicit media query for List mobile in the code chunks, ONLY Editor override. Wait, let me check.)
        // Looking at valid code: "Editor Overrides for Vertical List" was added. Media query for List was NOT modified significantly in the chunks.

        // So for List, we expect the editor override to be present.
        expect(cssMobile).toContain('flex-direction: column !important');
    });
});
