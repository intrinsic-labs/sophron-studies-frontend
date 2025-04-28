import localFont from 'next/font/local';

// Define fonts based on the files in public/fonts

// Script Heading Font
export const fontOoohBaby = localFont({
  src: '../../public/fonts/Oooh_Baby/OoohBaby-Regular.ttf',
  display: 'swap',
  variable: '--font-oooh-baby', // CSS variable name
});

// Serif Heading Font
export const fontLiterata = localFont({
  src: [
    {
      path: '../../public/fonts/Literata/Literata-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Literata/Literata-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-literata', // CSS variable name
});

// Sans Serif Body Font
export const fontInter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-inter', // CSS variable name
});

// Serif Body Font
export const fontCardo = localFont({
  src: [
    {
      path: '../../public/fonts/Cardo/Cardo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Cardo/Cardo-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Cardo/Cardo-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-cardo', // CSS variable name
}); 