export const getMainFontStylesStates = ({ fontWeight, fontStyle, textDecoration }:{fontWeight:string, fontStyle:string, textDecoration:string}) => ({
  bold: fontWeight === 'bold',
  italic: fontStyle === 'italic',
  underline: textDecoration && textDecoration.includes('underline'),
  strikethrough: textDecoration && textDecoration.includes('line-through'),
});
