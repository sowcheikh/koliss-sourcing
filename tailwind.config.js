/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs KOLISS - Design System officiel (comme colisage_front)
        'koliss-primary': '#203C89',
        'koliss-primary-dark': '#162A61',
        'koliss-primary-mid': '#2A4AA8',
        'koliss-secondary': '#FFCC00',
        'koliss-secondary-dark': '#E0B400',
        'koliss-secondary-light': '#FFE066',
        'koliss-secondary-soft': '#FFF5CC',
        'koliss-bg': '#FDFAEF',
        'koliss-bg-2': '#F3EFE0',
        'koliss-surface': '#FFFFFF',
        'koliss-text': '#111008',
        'koliss-text-muted': '#585751',
        'koliss-text-soft': '#6B7280',
        'koliss-border': '#E6E2D4',
        'koliss-border-strong': '#D9D3C0',
        // Services colors
        'koliss-svc-fleet': '#F59E0B',
        'koliss-svc-pay': '#10B981',
        'koliss-svc-express': '#203C89',
        'koliss-svc-sourcing': '#8B5CF6',
        // Status colors
        'koliss-status-moving': '#60A5FA',
        'koliss-status-ok': '#22C55E',
        'koliss-status-idle': '#FACC15',
        'koliss-status-alert': '#EF4444',
        'koliss-status-offline': '#94A3B8',
        // Couleurs d'état (colisage_front : abstracts/_variables.scss)
        'koliss-success': '#4CAF50',
        'koliss-success-dark': '#388E3C',
        'koliss-error': '#E53935',
        'koliss-error-dark': '#C62828',
        'koliss-warning': '#FF9800',
        'koliss-warning-dark': '#F57C00',
        'koliss-info': '#2196F3',
        'koliss-info-dark': '#1976D2',
      },
      fontFamily: {
        'sans': ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',    // 16px
        'lg': '1.125rem',  // 18px
        'xl': '1.25rem',   // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
        '4xl': '2.5rem',   // 40px
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '90': '22.5rem',
        '109': '27.25rem',
        '128': '32rem',
        '141': '35.25rem',
      },
      borderRadius: {
        'koliss': '8px',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'koliss-primary': '0 4px 12px rgba(255, 204, 0, 0.3)',
        'koliss-hover': '0 6px 20px rgba(255, 204, 0, 0.4)',
        'koliss-secondary': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'koliss-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out 0.6s both',
      },
      keyframes: {
        slideUp: {
          'from': { transform: 'translateY(50px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
