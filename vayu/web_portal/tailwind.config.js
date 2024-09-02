/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
const plugin = require('tailwindcss/plugin');

// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: '',
  theme: {
    fontFamily: {
      sans: ['Clash Grotesk'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        xl: '1500px', // Custom breakpoint for 1500px
      },
      colors: {
        'custom-green': '#31572C',
        'custom-light-green': '#3D944E',
        'custom-grey1': '#7B7B7B',
        'custom-grey2': '#434343',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none' /* Safari and Chrome */,
        },
        '.thin-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '5px' /* For Webkit browsers */,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888' /* Custom color for the scrollbar thumb */,
            borderRadius: '10px' /* Rounded corners for the scrollbar thumb */,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor:
              '#f1f1f1' /* Custom color for the scrollbar track */,
            borderRadius: '10px' /* Rounded corners for the scrollbar track */,
          },
          '-ms-overflow-style': 'auto' /* IE and Edge */,
          'scrollbar-width': 'thin' /* Firefox */,
        },
      });
    }),
  ],
};
