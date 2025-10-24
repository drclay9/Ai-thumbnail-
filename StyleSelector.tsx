import React from 'react';

export type ThumbnailStyle = 'MrBeast' | 'Minimalist' | 'Vlog' | 'Documentary';

const styles: { id: ThumbnailStyle; name: string; description: string }[] = [
  { id: 'MrBeast', name: 'MrBeast', description: 'High-energy, bold, and vibrant.' },
  { id: 'Minimalist', name: 'Minimalist', description: 'Clean, simple, and elegant.' },
  { id: 'Vlog', name: 'Vlog', description: 'Candid, authentic, and personal.' },
  { id: 'Documentary', name: 'Documentary', description: 'Cinematic, moody, and professional.' },
];

interface StyleSelectorProps {
  selectedStyle: ThumbnailStyle;
  onStyleChange: (style: ThumbnailStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div className="style-selector-container">
      {styles.map((style) => (
        <button
          key={style.id}
          className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
          onClick={() => onStyleChange(style.id)}
          aria-pressed={selectedStyle === style.id}
        >
          <span className="style-name">{style.name}</span>
          <span className="style-description">{style.description}</span>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
