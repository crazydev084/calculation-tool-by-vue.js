// 直接インポートを使用
import * as MarkdownIt from 'markdown-it';

// 同期的なテスト関数に変更
function testMarkdownIt() {
  try {
    console.log('markdown-itのテストを開始します...');
    
    // テストケース
    const testText = '# Hello World\n## Test\n- item 1\n- item 2';
    
    try {
      // インスタンス作成をtry-catchで囲む
      const md = new MarkdownIt.default({
        html: true,
        breaks: true,
        linkify: false,
        typographer: true
      });
      
      console.log('MarkdownItインスタンス作成成功');
      const result = md.render(testText);
      console.log('レンダリング結果:', result);
      
    } catch (instanceError) {
      console.error('MarkdownItインスタンス作成エラー:', instanceError);
      console.log('インスタンスエラーの詳細:', {
        name: instanceError.name,
        message: instanceError.message,
        stack: instanceError.stack
      });
    }
    
  } catch (error) {
    console.error('MarkdownIt Error:', error);
    console.log('エラーの詳細:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

// テスト関数をエクスポート
export { testMarkdownIt }; 