export const STYLE_SELECTION_BORDER_COLOR = 'rgba(75, 135, 255, 0.95)';
export const STYLE_SELECTION_BORDER_WIDTH = '1px';
export const STYLE_ACTIVE_SELECTION_BORDER_STYLE = 'dashed';
export const STYLE_STAGNANT_SELECTION_BORDER_STYLE = 'solid';

export const themes = [
  '#FFFFFF',
  '#000000',
  '#E7E6E6',
  '#44546A',
  '#5B9BD5',
  '#ED7D31',
  '#A5A5A5',
  '#FFC000',
  '#4472C4',
  '#70AD47',
];

export const borderFragmentMap = {
  left: 'borderLeft',
  right: 'borderRight',
  bottom: 'borderBottom',
  top: 'borderTop',
};

const supportedBorderStyleMap = {
  thin: {
    Style: 'solid',
    Width: '1px',
  },
  medium: {
    Style: 'solid',
    Width: '2px',
  },
  thick: {
    Style: 'solid',
    Width: '4px',
  },
  dashed: {
    Style: 'dashed',
  },
  dotted: {
    Style: 'dotted',
  },
  double: {
    Style: 'double',
  },
};

export const completeBorderStyleMap = {
  ...supportedBorderStyleMap,
  // ! Exclusive to Excel -- convert to supported style
  hair: supportedBorderStyleMap.dotted,
  dashDot: supportedBorderStyleMap.dashed,
  dashDotDot: supportedBorderStyleMap.dashed,
  mediumDashed: supportedBorderStyleMap.dashed,
  mediumDashDot: supportedBorderStyleMap.dashed,
  mediumDashDotDot: supportedBorderStyleMap.dashed,
  slantDashDot: supportedBorderStyleMap.dashed,
};

export const richTextToEditorMap = {
  fontWeight: {
    bold: 'bold',
  },
  fontStyle: {
    italic: 'italic',
  },
  textDecoration: {
    underline: 'underline',
    'line-through': 'strikethrough',
  },
  verticalAlign: {
    sub: 'subscript',
    super: 'superscript',
  },
  color: {},
  fontSize: {},
  fontFamily: {},
};

export const editorToRichTextMap = {
  // Boolean behaviours
  bold: { property: 'fontWeight', style: 'bold' },
  italic: { property: 'fontStyle', style: 'italic' },
  underline: { property: 'textDecoration', style: 'underline' },
  strikethrough: { property: 'textDecoration', style: 'line-through' },
  subscript: { property: 'verticalAlign', style: 'sub' },
  superscript: { property: 'vericalAlign', style: 'super' },

  // Dynamic/non-boolean properties
  color: { property: 'color' },
  fontSize: { property: 'fontSize' },
  fontFamily: { property: 'fontFamily' },
};
