import React from 'react';

/**
 * Amino BBCode Parser
 * Supports [B] Bold, [I] Italic, [C] Center, [U] Underline, [S] Strikethrough
 * and combinations such as [BC], [BIC], [BICS] at the beginning of lines.
 */
export function parseAminoText(text) {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Check if line starts with Amino formatting tags like [B], [C], [BC], [BICUS]
    const tagMatch = line.match(/^\[([BICUSbicus]+)\](.*)/);

    let content = line;
    let isBold = false;
    let isItalic = false;
    let isCenter = false;
    let isUnderline = false;
    let isStrike = false;

    if (tagMatch) {
      const tags = tagMatch[1].toUpperCase();
      content = tagMatch[2];

      if (tags.includes('B')) isBold = true;
      if (tags.includes('I')) isItalic = true;
      if (tags.includes('C')) isCenter = true;
      if (tags.includes('U')) isUnderline = true;
      if (tags.includes('S')) isStrike = true;
    }

    const style = {
      display: 'block',
      fontWeight: isBold ? '700' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign: isCenter ? 'center' : 'left',
      textDecoration: [
        isUnderline ? 'underline' : '',
        isStrike ? 'line-through' : ''
      ].filter(Boolean).join(' ') || 'none',
      minHeight: line.trim() === '' ? '1.2em' : 'auto',
      marginBottom: '6px'
    };

    return (
      <span key={lineIndex} style={style}>
        {content || '\u00A0'}
      </span>
    );
  });
}
