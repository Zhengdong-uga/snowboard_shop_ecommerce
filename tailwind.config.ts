import type { Config } from "tailwindcss";
import fluid, { extract, screens, fontSize, FluidThemeConfig } from 'fluid-tailwind';

export default {
  content: {files:[
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  extract
},
  theme: {
    fluid: (({ theme }) => ({
      defaultScreens: ['20rem', theme('screens.lg')]
    })) satisfies FluidThemeConfig,
    screens, fontSize,
      extend: {
        fontFamily: {
          sans: ['var(--font-bowlby-sc)'],
          mono: ['var(--font-dm-mono)'],
        },
        colors: {
          "brand-blue": "#4876ff",
          "brand-lime": "#d9f154",
          "brand-navy": "#2e3192",
          "brand-orange": "#ff7347",
          "brand-pink": "#f7d0e9",
          "brand-purple": "#692e54",
          "brand-gray": "#fffdf9",
          "brand-green": "#337357",
          "brand-pink2": "#ea9ab2",

        },
      },
  },
  plugins: [fluid],
} satisfies Config;
 