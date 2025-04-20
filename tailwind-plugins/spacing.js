const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities, theme }) {
  // CSSカスタムプロパティを取得してユーティリティクラスを生成
  const plsSpacingUtilities = {}
  
  // gap用のユーティリティクラス
  plsSpacingUtilities['.gap-pls-xs'] = { gap: 'var(--pls-spacing-xs)' }
  plsSpacingUtilities['.gap-pls-sm'] = { gap: 'var(--pls-spacing-sm)' }
  plsSpacingUtilities['.gap-pls-md'] = { gap: 'var(--pls-spacing-md)' }
  plsSpacingUtilities['.gap-pls-lg'] = { gap: 'var(--pls-spacing-lg)' }
  
  // 他のスペーシング関連クラスも追加
  
  addUtilities(plsSpacingUtilities)
}) 