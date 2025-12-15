import { exportToHTML } from '../htmlExporter';
import { Block } from '../../schema/types';

// Mock DOM methods
const mockCreateElement = jest.fn();
const mockTextContent = jest.fn();
const mockInnerHTML = jest.fn();

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
});

// Mock the div element
const mockDiv = {
  textContent: mockTextContent,
  innerHTML: mockInnerHTML,
};

mockCreateElement.mockReturnValue(mockDiv);
mockTextContent.mockReturnValue('mocked text content');
mockInnerHTML.mockReturnValue('mocked innerHTML');

describe('HTML Exporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic HTML Structure', () => {
    it('should generate valid HTML5 structure', () => {
      const blocks: Block[] = [];
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
      expect(html).toContain('</html>');
    });

    it('should include proper meta tags', () => {
      const blocks: Block[] = [];
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      expect(html).toContain('<meta name="generator" content="BuilderX Page Builder">');
    });

    it('should include CSS styles', () => {
      const blocks: Block[] = [];
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<style>');
      expect(html).toContain('</style>');
      expect(html).toContain('.builderx-section');
      expect(html).toContain('.builderx-row');
      expect(html).toContain('.builderx-column');
      expect(html).toContain('.builderx-text');
      expect(html).toContain('.builderx-image');
      expect(html).toContain('.builderx-button');
    });
  });

  describe('Text Block Export', () => {
    it('should export text block correctly', () => {
      const blocks: Block[] = [
        {
          id: 'text-1',
          type: 'text',
          props: {
            content: 'Hello World',
            fontSize: '18px',
            color: '#333333'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<div class="builderx-text"');
      expect(html).toContain('Hello World');
      expect(html).toContain('font-size: 18px');
      expect(html).toContain('color: #333333');
    });

    it('should sanitize dangerous content in text blocks', () => {
      const blocks: Block[] = [
        {
          id: 'text-1',
          type: 'text',
          props: {
            content: '<script>alert("xss")</script>Safe content'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).not.toContain('<script>');
      expect(html).toContain('Safe content');
    });
  });

  describe('Image Block Export', () => {
    it('should export image block correctly', () => {
      const blocks: Block[] = [
        {
          id: 'image-1',
          type: 'image',
          props: {
            src: 'https://example.com/image.jpg',
            alt: 'Test image',
            width: '300px',
            height: '200px'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<img class="builderx-image"');
      expect(html).toContain('src="https://example.com/image.jpg"');
      expect(html).toContain('alt="Test image"');
      expect(html).toContain('width: 300px');
      expect(html).toContain('height: 200px');
      expect(html).toContain('loading="lazy"');
    });
  });

  describe('Button Block Export', () => {
    it('should export button block as button element', () => {
      const blocks: Block[] = [
        {
          id: 'button-1',
          type: 'button',
          props: {
            text: 'Click me',
            backgroundColor: '#007bff',
            color: '#ffffff',
            padding: '10px 20px'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<button class="builderx-button"');
      expect(html).toContain('Click me');
      expect(html).toContain('background-color: #007bff');
      expect(html).toContain('color: #ffffff');
      expect(html).toContain('padding: 10px 20px');
    });

    it('should export button block as link when href is provided', () => {
      const blocks: Block[] = [
        {
          id: 'button-1',
          type: 'button',
          props: {
            text: 'Visit Site',
            href: 'https://example.com',
            backgroundColor: '#28a745'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('class="builderx-button"');
      expect(html).toContain('Visit Site');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });
  });

  describe('Section Block Export', () => {
    it('should export section block correctly', () => {
      const blocks: Block[] = [
        {
          id: 'section-1',
          type: 'section',
          props: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            margin: '10px'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<section class="builderx-section"');
      expect(html).toContain('background-color: #f8f9fa');
      expect(html).toContain('padding: 20px');
      expect(html).toContain('margin: 10px');
    });
  });

  describe('Row Block Export', () => {
    it('should export row block correctly', () => {
      const blocks: Block[] = [
        {
          id: 'row-1',
          type: 'row',
          props: {
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<div class="builderx-row"');
      expect(html).toContain('gap: 10px');
      expect(html).toContain('justify-content: center');
      expect(html).toContain('align-items: center');
    });
  });

  describe('Column Block Export', () => {
    it('should export column block correctly', () => {
      const blocks: Block[] = [
        {
          id: 'column-1',
          type: 'column',
          props: {
            width: '50%',
            flex: '1',
            gap: '15px'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<div class="builderx-column"');
      expect(html).toContain('width: 50%');
      expect(html).toContain('flex: 1');
      expect(html).toContain('gap: 15px');
    });
  });

  describe('Nested Blocks Export', () => {
    it('should export nested blocks correctly', () => {
      const blocks: Block[] = [
        {
          id: 'section-1',
          type: 'section',
          props: {},
          children: [
            {
              id: 'row-1',
              type: 'row',
              props: {},
              children: [
                {
                  id: 'column-1',
                  type: 'column',
                  props: {},
                  children: [
                    {
                      id: 'text-1',
                      type: 'text',
                      props: {
                        content: 'Nested content'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<section class="builderx-section"');
      expect(html).toContain('<div class="builderx-row"');
      expect(html).toContain('<div class="builderx-column"');
      expect(html).toContain('<div class="builderx-text"');
      expect(html).toContain('Nested content');
    });
  });

  describe('Responsive Design', () => {
    it('should include responsive CSS', () => {
      const blocks: Block[] = [];
      const html = exportToHTML(blocks);
      
      expect(html).toContain('@media (max-width: 768px)');
      expect(html).toContain('@media (max-width: 480px)');
      expect(html).toContain('@media print');
    });
  });

  describe('Content Sanitization', () => {
    it('should escape HTML entities', () => {
      const blocks: Block[] = [
        {
          id: 'text-1',
          type: 'text',
          props: {
            content: 'Test & "quotes" and <tags>'
          }
        }
      ];
      
      const html = exportToHTML(blocks);
      
      expect(html).toContain('Test &amp; &quot;quotes&quot; and &lt;tags&gt;');
    });
  });

  describe('Empty Blocks', () => {
    it('should handle empty blocks array', () => {
      const blocks: Block[] = [];
      const html = exportToHTML(blocks);
      
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
      expect(html).not.toContain('<div class="builderx-');
    });
  });
});
