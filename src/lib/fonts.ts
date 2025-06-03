import localFont from 'next/font/local';

// Define fonts based on the files in src/fonts

// Inter - Variable font with regular and italic
export const fontInter = localFont({
  src: [
    {
      path: '../fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

// Literata - Variable font with regular and italic
export const fontLiterata = localFont({
  src: [
    {
      path: '../fonts/Literata/Literata-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../fonts/Literata/Literata-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-literata',
  display: 'swap',
});

// Northwell - Single weight font
export const fontNorthwell = localFont({
  src: '../fonts/Northwell/Northwell.ttf',
  variable: '--font-northwell',
  display: 'swap',
});
