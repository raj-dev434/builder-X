import React from 'react';
import { BaseBlock } from './BaseBlock';
import { NavbarBlock as NavbarBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

interface NavbarBlockProps {
  block: NavbarBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<NavbarBlockType>) => void;
  onDelete: () => void;
}

export const NavbarBlock: React.FC<NavbarBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    brand = 'Brand',
    brandUrl = '#',
    brandImage,
    logoHeight = '2rem',
    links = [
      { text: 'Home', url: '#', active: true },
      { text: 'About', url: '#' },
      { text: 'Contact', url: '#' }
    ],
    backgroundColor = '#ffffff',
    textColor = '#333333',
    hoverColor,
    activeColor,
    padding = '1rem',
    linkSpacing = '2rem',
    fontSize = '1rem',
    border,
    borderRadius,
    shadow,
    sticky = false,
    transparent = false,
    mobileMenu = true,
    ...styleProps
  } = block.props;

  const { viewDevice, isPreviewMode } = useCanvasStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const isMobile = viewDevice === 'mobile';

  const handleBrandChange = (newBrand: string) => {
    onUpdate({ props: { ...block.props, brand: newBrand } });
  };

  const handleLinkChange = (index: number, newText: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], text: newText };
    onUpdate({ props: { ...block.props, links: updatedLinks } });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={{
        position: sticky ? 'sticky' : 'static',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 1000 : 'auto',
        backgroundColor: transparent ? 'transparent' : backgroundColor,
        color: textColor,
        padding,
        border,
        borderRadius,
        boxShadow: shadow,
        ...styleProps
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          flexWrap: 'wrap',
          position: 'relative'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {brandImage ? (
            <img
              src={brandImage}
              alt={brand}
              style={{
                height: logoHeight,
                marginRight: '0.5rem'
              }}
            />
          ) : null}
          <a
            href={brandUrl}
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => handleBrandChange(e.currentTarget.textContent || '')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            onClick={(e) => {
              if (isSelected || !isPreviewMode) {
                e.preventDefault();
              }
            }}
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'inherit',
              outline: 'none'
            }}
          >
            {brand}
          </a>
        </div>

        {/* Desktop Links */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: linkSpacing,
              marginLeft: 'auto'
            }}
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
                contentEditable={!isPreviewMode}
                suppressContentEditableWarning
                onBlur={(e) => handleLinkChange(index, e.currentTarget.textContent || '')}
                onClick={(e) => {
                  if (isSelected || !isPreviewMode) {
                    e.preventDefault();
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  textDecoration: 'none',
                  color: link.active && activeColor ? activeColor : 'inherit',
                  fontWeight: link.active ? 'bold' : 'normal',
                  fontSize,
                  outline: 'none',
                  opacity: link.active ? 1 : 0.8,
                  transition: 'all 0.2s ease',
                  ...(hoveredIndex === index && hoverColor ? { color: hoverColor } : {})
                }}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && mobileMenu && (
          <button
            style={{
              display: 'block',
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0.5rem'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Mobile Dropdown */}
        {isMobile && isMenuOpen && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '1rem',
              borderTop: `1px solid ${textColor}20`,
              marginTop: '1rem'
            }}
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
                contentEditable={!isPreviewMode}
                suppressContentEditableWarning
                onBlur={(e) => handleLinkChange(index, e.currentTarget.textContent || '')}
                onClick={(e) => {
                  if (isSelected || !isPreviewMode) {
                    e.preventDefault();
                  }
                }}
                style={{
                  textDecoration: 'none',
                  color: link.active && activeColor ? activeColor : 'inherit',
                  padding: '0.75rem 0',
                  fontWeight: link.active ? 'bold' : 'normal',
                  fontSize,
                  outline: 'none',
                  borderBottom: index < links.length - 1 ? `1px solid ${textColor}10` : 'none'
                }}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}
      </nav>
    </BaseBlock>
  );
};
