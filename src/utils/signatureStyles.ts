/**
 * Signature Style Utilities
 * Maps signature styles to CSS classes for consistent rendering in HTML and PDF
 */

export const TEXT_STYLES = [
  { value: "dancing", label: "Dancing Script", fontFamily: "'Dancing Script', cursive", className: "signature-dancing" },
  { value: "great-vibes", label: "Great Vibes", fontFamily: "'Great Vibes', cursive", className: "signature-great-vibes" },
  { value: "pacifico", label: "Pacifico", fontFamily: "'Pacifico', cursive", className: "signature-pacifico" },
  { value: "satisfy", label: "Satisfy", fontFamily: "'Satisfy', cursive", className: "signature-satisfy" },
  { value: "kalam", label: "Kalam", fontFamily: "'Kalam', cursive", className: "signature-kalam" },
  { value: "allura", label: "Allura", fontFamily: "'Allura', cursive", className: "signature-allura" },
  { value: "alex-brush", label: "Alex Brush", fontFamily: "'Alex Brush', cursive", className: "signature-alex-brush" },
  { value: "courgette", label: "Courgette", fontFamily: "'Courgette', cursive", className: "signature-courgette" },
  { value: "sacramento", label: "Sacramento", fontFamily: "'Sacramento', cursive", className: "signature-sacramento" },
  { value: "brush-script", label: "Brush Script", fontFamily: "'Brush Script MT', cursive", className: "signature-brush-script" },
  { value: "formal", label: "Formal", fontFamily: "'Times New Roman', serif", className: "signature-formal" },
  { value: "modern", label: "Modern", fontFamily: "'Helvetica', 'Arial', sans-serif", className: "signature-modern" },
  { value: "handwritten", label: "Handwritten", fontFamily: "'Kalam', cursive", className: "signature-handwritten" },
  { value: "stylish", label: "Stylish", fontFamily: "'Allura', cursive", className: "signature-stylish" },
  { value: "fancy", label: "Fancy", fontFamily: "'Alex Brush', cursive", className: "signature-fancy" },
] as const;

/**
 * Get CSS class name for a signature style
 */
export const getSignatureClassName = (styleValue: string): string => {
  const style = TEXT_STYLES.find(s => s.value === styleValue);
  return style?.className || 'signature-dancing';
};

/**
 * Get font family for a signature style (for inline preview)
 */
export const getSignatureFontFamily = (styleValue: string): string => {
  const style = TEXT_STYLES.find(s => s.value === styleValue);
  return style?.fontFamily || "'Dancing Script', cursive";
};
