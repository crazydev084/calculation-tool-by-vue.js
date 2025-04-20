/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pls: {
          bg: "var(--pls-background-primary)",
          surface: "var(--pls-surface-primary)",
          primary: "var(--pls-primary)",
          secondary: "var(--pls-secondary)",
          text: "var(--pls-object-primary)",
          "text-secondary": "var(--pls-object-secondary)",
          white: "var(--pls-basic-white)",
        },
        pocket: {
          border: "var(--color-pocket-border)",
          "border-blue": "var(--color-pocket-border-blue)",
          bg: "var(--color-pocket-bg)",
        },
        // Pulseのオブジェクト色
        "pls-object": {
          primary: "var(--pls-object-primary)",
          secondary: "var(--pls-object-secondary)",
          disabled: "var(--pls-object-disabled)",
          link: "var(--pls-object-link)",
          accent: "var(--pls-object-accent)",
          "accent-dark": "var(--pls-object-accent-dark)",
          info: "var(--pls-object-info)",
          success: "var(--pls-object-success)",
          warning: "var(--pls-object-warning)",
          "inverse-primary": "var(--pls-object-inverse-primary)",
          "inverse-secondary": "var(--pls-object-inverse-secondary)",
        },
        // Pulseの青色系
        "pls-blue": {
          50: "var(--pls-blue-50)",
          100: "var(--pls-blue-100)",
          300: "var(--pls-blue-300)",
          600: "var(--pls-blue-600)",
          800: "var(--pls-blue-800)",
        },
        // Pulseのスカイブルー系
        "pls-sky": {
          50: "var(--pls-sky-50)",
          100: "var(--pls-sky-100)",
          300: "var(--pls-sky-300)",
          600: "var(--pls-sky-600)",
          800: "var(--pls-sky-800)",
        },
        // Pulseのティール系
        "pls-teal": {
          50: "var(--pls-teal-50)",
          100: "var(--pls-teal-100)",
          300: "var(--pls-teal-300)",
          600: "var(--pls-teal-600)",
          800: "var(--pls-teal-800)",
        },
        // Pulseのグリーン系
        "pls-green": {
          50: "var(--pls-green-50)",
          100: "var(--pls-green-100)",
          300: "var(--pls-green-300)",
          600: "var(--pls-green-600)",
          800: "var(--pls-green-800)",
        },
        // Pulseのイエローグリーン系
        "pls-yellow-green": {
          50: "var(--pls-yellow-green-50)",
          100: "var(--pls-yellow-green-100)",
          300: "var(--pls-yellow-green-300)",
          600: "var(--pls-yellow-green-600)",
          800: "var(--pls-yellow-green-800)",
        },
        // Pulseのイエロー系
        "pls-yellow": {
          50: "var(--pls-yellow-50)",
          100: "var(--pls-yellow-100)",
          300: "var(--pls-yellow-300)",
          600: "var(--pls-yellow-600)",
          800: "var(--pls-yellow-800)",
        },
        // Pulseのオレンジ系
        "pls-orange": {
          50: "var(--pls-orange-50)",
          100: "var(--pls-orange-100)",
          300: "var(--pls-orange-300)",
          600: "var(--pls-orange-600)",
          700: "var(--pls-orange-700)",
          800: "var(--pls-orange-800)",
        },
        // Pulseのレッド系
        "pls-red": {
          50: "var(--pls-red-50)",
          100: "var(--pls-red-100)",
          300: "var(--pls-red-300)",
          600: "var(--pls-red-600)",
          800: "var(--pls-red-800)",
        },
        // Pulseのピンク系
        "pls-pink": {
          50: "var(--pls-pink-50)",
          100: "var(--pls-pink-100)",
          300: "var(--pls-pink-300)",
          600: "var(--pls-pink-600)",
          800: "var(--pls-pink-800)",
        },
        // Pulseのパープル系
        "pls-purple": {
          50: "var(--pls-purple-50)",
          100: "var(--pls-purple-100)",
          300: "var(--pls-purple-300)",
          600: "var(--pls-purple-600)",
          800: "var(--pls-purple-800)",
        },
        // Pulseのグレー系
        "pls-gray": {
          50: "var(--pls-gray-50)",
          100: "var(--pls-gray-100)",
          200: "var(--pls-gray-200)",
          300: "var(--pls-gray-300)",
          500: "var(--pls-gray-500)",
          700: "var(--pls-gray-700)",
          900: "var(--pls-gray-900)",
        },
        // リスク評価用の色
        "pls-risk": {
          green: "var(--pls-risk-green)",
          "green-yellow": "var(--pls-risk-green-yellow)",
          yellow: "var(--pls-risk-yellow)",
          orange: "var(--pls-risk-orange)",
          red: "var(--pls-risk-red)",
        },
      },
      spacing: {
        // pulseデザインシステムのスペーシング変数をマッピング
        "pls-xxs": "var(--pls-spacing-xxs, 0.2rem)",
        "pls-xs": "var(--pls-spacing-xs, 0.25rem)",
        "pls-s": "var(--pls-spacing-s, 0.5rem)",
        "pls-m": "var(--pls-spacing-m, 1rem)",
        "pls-sm": "var(--pls-spacing-sm, 0.75rem)",
        "pls-md": "var(--pls-spacing-m, 1rem)",
        "pls-l": "var(--pls-spacing-l, 1.5rem)",
        "pls-xl": "var(--pls-spacing-xl, 2rem)",
        "pls-2xl": "var(--pls-spacing-2xl, 3rem)",
      },
      borderColor: {
        "pls-default": "var(--pls-border-default)",
        "pls-strong": "var(--pls-border-strong)",
        "pls-inverse-default": "var(--pls-border-inverse-default)",
        "pls-inverse-strong": "var(--pls-border-inverse-strong)",
        "pls-border": "var(--pls-border-default)", // 'border-pls-border'用のエイリアス
      },
      borderWidth: {
        "pls-default": "1px",
        "pls-medium": "2px",
        "pls-thick": "4px",
      },
      // フォント関連の設定
      fontWeight: {
        "pls-bold": "var(--pls-font-weight-bold, 700)",
        "pls-medium": "var(--pls-font-weight-medium, 500)",
        "pls-regular": "var(--pls-font-weight-regular, 400)",
        "pls-light": "var(--pls-font-weight-light, 300)",
      },
      fontSize: {
        "pls-xxs": "var(--pls-font-size-xxs, 0.625rem)",
        "pls-xs": "var(--pls-font-size-xs, 0.75rem)",
        "pls-s": "var(--pls-font-size-s, 0.875rem)",
        "pls-m": "var(--pls-font-size-m, 1rem)",
        "pls-l": "var(--pls-font-size-l, 1.125rem)",
        "pls-xl": "var(--pls-font-size-xl, 1.25rem)",
        "pls-xxl": "var(--pls-font-size-xxl, 1.5rem)",
        "pls-3xl": "var(--pls-font-size-3xl, 1.875rem)",
        "pls-4xl": "var(--pls-font-size-4xl, 2.25rem)",
      },
      lineHeight: {
        "pls-heading": "var(--pls-line-height-heading, 1.2)",
        "pls-body-s": "var(--pls-line-height-body-s, 1.5)",
        "pls-body-m": "var(--pls-line-height-body-m, 1.5)",
        "pls-article": "var(--pls-line-height-article, 1.8)",
        "pls-caption": "var(--pls-line-height-caption, 1.4)",
      },
      fontFamily: {
        "pls-sans": "var(--pls-font-family-sans, sans-serif)",
        "pls-serif": "var(--pls-font-family-serif, serif)",
        "pls-mono": "var(--pls-font-family-mono, monospace)",
      },
      letterSpacing: {
        "pls-normal": "var(--pls-letter-spacing-normal, 0)",
        "pls-wide": "var(--pls-letter-spacing-wide, 0.025em)",
        "pls-tight": "var(--pls-letter-spacing-tight, -0.025em)",
      },
      textWrap: {
        pretty: "pretty",
      },
      borderRadius: {
        "pls-xs": "var(--pls-border-radius-xs)",
        "pls-s": "var(--pls-border-radius-s)",
        "pls-m": "var(--pls-border-radius-m)",
        "pls-l": "var(--pls-border-radius-l)",
        "pls-full": "var(--pls-border-radius-full)",
        "pls-xxs": "var(--pls-border-radius-xxs)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-wrap-pretty": {
          "text-wrap": "pretty",
        },
        ".text-wrap-balance": {
          "text-wrap": "balance",
        },
        ".text-wrap-stable": {
          "text-wrap": "stable",
        },
        ".text-wrap-nowrap": {
          "text-wrap": "nowrap",
        },
        // Pulse UI用グラデーション背景ユーティリティ
        ".bg-pls-active-primary": {
          background:
            "linear-gradient(var(--pls-active-primary),var(--pls-active-primary)),var(--pls-surface-primary)",
        },
        ".bg-pls-hover-primary": {
          background:
            "linear-gradient(var(--pls-hover-primary),var(--pls-hover-primary)),var(--pls-surface-primary)",
        },
        ".bg-pls-active-secondary": {
          background:
            "linear-gradient(var(--pls-active-secondary),var(--pls-active-secondary)),var(--pls-surface-primary)",
        },
        ".bg-pls-hover-secondary": {
          background:
            "linear-gradient(var(--pls-hover-secondary),var(--pls-hover-secondary)),var(--pls-surface-primary)",
        },
        ".bg-pls-active-warning": {
          background:
            "linear-gradient(var(--pls-active-warning),var(--pls-active-warning)),var(--pls-surface-primary)",
        },
        ".bg-pls-hover-warning": {
          background:
            "linear-gradient(var(--pls-hover-warning),var(--pls-hover-warning)),var(--pls-surface-primary)",
        },
        ".bg-pls-active-inverse": {
          background:
            "linear-gradient(var(--pls-active-inverse),var(--pls-active-inverse)),var(--pls-surface-accent)",
        },
        ".bg-pls-hover-inverse": {
          background:
            "linear-gradient(var(--pls-hover-inverse),var(--pls-hover-inverse)),var(--pls-surface-accent)",
        },
      });
    },
  ],
}; 