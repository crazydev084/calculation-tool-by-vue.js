export function getMarkdownContent(path) {
  // window.__MARKDOWN_DATA__から直接データを取得
  return window.__MARKDOWN_DATA__?.[path] || null
} 