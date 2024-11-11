import { createTheme } from '@mui/material/styles';
import { Palette, PaletteOptions } from '@mui/material/styles/createPalette';

// Extend the Palette interface to include custom properties
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    active: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    active?: PaletteOptions['primary'];
  }
}

// Define your Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#171819',
    },
    secondary: {
      main: '#8E8E8E',
    },
    accent: {
      main: '#68A3E9', // accent color 
    },
    active: {
      main: '#68A3E9',  // active non accent color 
    }
  },

  typography: {
    fontFamily: "Space Grotesk",
    h1: {
      fontSize: '1.4rem',
      letterSpacing: -1,
      fontWeight: '500',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.7rem',
      },
      '@media (min-width:1280px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: '700', 
      color: '#333741',
      letterSpacing: -1,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3.0rem',
      },
      '@media (min-width:1280px)': {
        fontSize: '3.5rem',
      },
    },
    h4: {
      color: '#333741',
    },
    h5: {
      color: '#333741'
    },
    h6: {
      color: '#8E8E8E',
      fontSize: '.7rem',
      fontWeight: '500',
      lineHeight: '140%',
      '@media (min-width:600px)': {
        fontSize: '0.85rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1rem',
      },
      '@media (min-width:1280px)': {
        fontSize: '1.2rem',
      },
    },
    body1: {
      fontSize: '0.6rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#333741',
      '@media (min-width:600px)': {
        fontSize: '0.8rem',
      },
      '@media (min-width:960px)': {
        fontSize: '0.9rem',
      },
      '@media (min-width:1280px)': {
        fontSize: '1.0rem',
      },
    },
    body2: {
      fontSize: '0.5rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#333741',
      '@media (min-width:600px)': {
        fontSize: '0.85rem',
      },
      '@media (min-width:960px)': {
        fontSize: '0.9rem',
      },
      '@media (min-width:1280px)': {
        fontSize: '1.0rem',
      },
    }
  },

  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Space Grotesk', // Use the same font family as your theme
          fontSize: '0.6rem', // Customize the font size for text areas
          lineHeight: '1.5',
          color: '#333741',
          '@media (min-width:600px)': {
            fontSize: '0.85rem',
          },
          '@media (min-width:960px)': {
            fontSize: '0.9rem',
          },
          '@media (min-width:1280px)': {
            fontSize: '1.0rem',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& textarea': {
            fontFamily: 'Space Grotesk',
            fontSize: '0.2rem', // Customize the font size inside the textarea
            lineHeight: '1.5',
            color: '#333741',
            '@media (min-width:600px)': {
              fontSize: '0.85rem',
            },
            '@media (min-width:960px)': {
              fontSize: '0.9rem',
            },
            '@media (min-width:1280px)': {
              fontSize: '1.0rem',
            },
          },
        },
      },
    },
  },
});

export default theme;
