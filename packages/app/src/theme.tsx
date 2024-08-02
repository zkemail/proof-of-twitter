// import { createTheme } from '@mui/material/styles';

// // Define your Material UI theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#000000',
//     },
//     secondary: {
//       main: '#8E8E8E',
//     },
//     accent: {
//       main: '#8372E4', // accent color 
//     },
//     active: {
//       main: '#abbeff'  // active non accent color 
//     }
//   },

//   typography: {
//     fontFamily: "Space Grotesk",
//     h1: {
//       fontSize: '1.4rem', // Default font size for the smallest screens (xs)
//       letterSpacing: -1,
//       fontWeight: '500',
//       '@media (min-width:600px)': {
//         fontSize: '1.5rem', // font size for small screens
//       },
//       '@media (min-width:960px)': {
//         fontSize: '1.7rem', // font size for medium screens
//       },
//       '@media (min-width:1280px)': {
//         fontSize: '2rem', // font size for large screens
//       },
//     },
//     h2: {
//       fontSize: '1.75rem', // Default font size for the smallest screens (xs)
//       fontWeight: '700', 
//       color: '#333741',
//       letterSpacing: -1,
//       '@media (min-width:600px)': {
//         fontSize: '2.5rem', // font size for small screens
//       },
//       '@media (min-width:960px)': {
//         fontSize: '3.0rem', // font size for medium screens
//       },
//       '@media (min-width:1280px)': {
//         fontSize: '3.5rem', // font size for large screens
//       },
//     },
//     h4: {
//       color: '#333741',
//     },
//     h5: {
//       color: '#333741'
//     },
//     h6: {
//       color: '#8E8E8E',
//       fontSize: '20px', // Default font size for the smallest screens (xs)
//       fontWeight: '500',
//       lineHeight: '140%',
//     },
//     body1: {
//       fontSize: '0.875rem', // Default font size for the smallest screens (xs)
//       fontWeight: '400',
//       lineHeight: '1.5',
//       color: '#333741', // Ensure good contrast and readability
//       '@media (min-width:600px)': {
//         fontSize: '0.85rem', // font size for small screens
//       },
//       '@media (min-width:960px)': {
//         fontSize: '0.9rem', // font size for medium screens
//       },
//       '@media (min-width:1280px)': {
//         fontSize: '1.0rem', // font size for large screens
//       },
//     },
//     body2: {
//       fontSize: '0.5rem', // Default font size for the smallest screens (xs)
//       fontWeight: '400',
//       lineHeight: '1.5',
//       color: '#333741',
//       '@media (min-width:600px)': {
//         fontSize: '0.85rem', // font size for small screens
//       },
//       '@media (min-width:960px)': {
//         fontSize: '0.9rem', // font size for medium screens
//       },
//       '@media (min-width:1280px)': {
//         fontSize: '1.0rem', // font size for large screens
//       },
//     }
//   },

//   components: {
//   },
// });

// export default theme;


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
      main: '#000000',
    },
    secondary: {
      main: '#8E8E8E',
    },
    accent: {
      main: '#8372E4', // accent color 
    },
    active: {
      main: '#abbeff',  // active non accent color 
    }
  },

  typography: {
    fontFamily: "Space Grotesk",
    h1: {
      fontSize: '1.4rem', // Default font size for the smallest screens (xs)
      letterSpacing: -1,
      fontWeight: '500',
      '@media (min-width:600px)': {
        fontSize: '1.5rem', // font size for small screens
      },
      '@media (min-width:960px)': {
        fontSize: '1.7rem', // font size for medium screens
      },
      '@media (min-width:1280px)': {
        fontSize: '2rem', // font size for large screens
      },
    },
    h2: {
      fontSize: '1.75rem', // Default font size for the smallest screens (xs)
      fontWeight: '700', 
      color: '#333741',
      letterSpacing: -1,
      '@media (min-width:600px)': {
        fontSize: '2.5rem', // font size for small screens
      },
      '@media (min-width:960px)': {
        fontSize: '3.0rem', // font size for medium screens
      },
      '@media (min-width:1280px)': {
        fontSize: '3.5rem', // font size for large screens
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
      fontSize: '20px', // Default font size for the smallest screens (xs)
      fontWeight: '500',
      lineHeight: '140%',
    },
    body1: {
      fontSize: '0.875rem', // Default font size for the smallest screens (xs)
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#333741', // Ensure good contrast and readability
      '@media (min-width:600px)': {
        fontSize: '0.85rem', // font size for small screens
      },
      '@media (min-width:960px)': {
        fontSize: '0.9rem', // font size for medium screens
      },
      '@media (min-width:1280px)': {
        fontSize: '1.0rem', // font size for large screens
      },
    },
    body2: {
      fontSize: '0.5rem', // Default font size for the smallest screens (xs)
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#333741',
      '@media (min-width:600px)': {
        fontSize: '0.85rem', // font size for small screens
      },
      '@media (min-width:960px)': {
        fontSize: '0.9rem', // font size for medium screens
      },
      '@media (min-width:1280px)': {
        fontSize: '1.0rem', // font size for large screens
      },
    }
  },

  components: {
  },
});

export default theme;
