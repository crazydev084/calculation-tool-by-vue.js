import * as MarkdownIt from 'markdown-it'
import mdTable from 'markdown-it-multimd-table'
import { marked } from 'marked'

// 正規表現パターン
const ANCHOR_ID_PATTERN = /(?:\s*){#([a-zA-Z0-9_-]+)}(?:\s*)$/
const INLINE_ANCHOR_PATTERN = /(\s*){#([a-zA-Z0-9_-]+)}(\s*)/g
const CONTENT_WITH_ANCHOR_PATTERN = /^([\s\S]*?)(?:\s*){#([a-zA-Z0-9_-]+)}(?:\s*)$/
const MD_HEADING_REGEX = /^(#{3,6})\s+(.+?)(?:\s+{#([a-zA-Z0-9_-]+)})?$/gm
const HTML_HEADING_REGEX = /<h([3-6])([^>]*?)id="([^"]+)"([^>]*)>(.*?)<\/h\1>/g

// シングルトンインスタンス
let mdInstance = null
let markedInstance = null

// セクション処理のためのグローバル変数
let isProcessingTipsFile = false

/**
 * 外部リンク変換用プラグイン
 */
const externalLinksPlugin = (md) => {
  const defaultRender =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrs.find((attr) => attr[0] === "href");

    if (
      href &&
      (href[1].startsWith("http://") ||
        href[1].startsWith("https://") ||
        href[1].startsWith("www."))
    ) {
      // target="_blank"を追加
      const targetIndex = tokens[idx].attrIndex("target");
      if (targetIndex < 0) {
        tokens[idx].attrPush(["target", "_blank"]);
      } else {
        tokens[idx].attrs[targetIndex][1] = "_blank";
      }

      // rel="noopener noreferrer"を追加（セキュリティのため）
      const relIndex = tokens[idx].attrIndex("rel");
      if (relIndex < 0) {
        tokens[idx].attrPush(["rel", "noopener noreferrer"]);
      } else {
        tokens[idx].attrs[relIndex][1] = "noopener noreferrer";
      }
    }

    return defaultRender(tokens, idx, options, env, self);
  };
};

/**
 * 見出しのアンカーID処理プラグイン
 */
const headingAnchorPlugin = (md) => {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const nextToken = tokens[idx + 1];

    if (nextToken && nextToken.type === "inline") {
      const match = nextToken.content.match(CONTENT_WITH_ANCHOR_PATTERN);
      if (match) {
        const [, text, id] = match;
        token.attrSet("id", id);
        nextToken.content = text.trim();

        if (nextToken.children) {
          const lastChild = nextToken.children[nextToken.children.length - 1];
          if (lastChild && lastChild.content) {
            lastChild.content = lastChild.content.replace(
              ANCHOR_ID_PATTERN,
              ""
            );
          }
        }
      }
    }

    return self.renderToken(tokens, idx, options);
  };
};

/**
 * パラグラフとインラインテキストのアンカーID処理プラグイン
 */
const inlineAnchorPlugin = (md) => {
  // パラグラフの処理
  const defaultParaRender =
    md.renderer.rules.paragraph_open ||
    ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.paragraph_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx];
    const nextToken = tokens[idx + 1];

    if (nextToken && nextToken.type === "inline") {
      const content = nextToken.content;

      // 末尾の{#anchor_id}パターンを検出
      const match = content.match(CONTENT_WITH_ANCHOR_PATTERN);

      if (match) {
        const [, text, id] = match;
        // アンカーIDをパラグラフに設定
        token.attrSet("id", id);
        // コンテンツから{#anchor_id}パターンを削除
        nextToken.content = text.trim();

        // インラインの子要素も更新
        if (nextToken.children && nextToken.children.length > 0) {
          processChildrenWithAnchors(nextToken.children);
        }
      }
    }

    return defaultParaRender(tokens, idx, options, env, self);
  };

  // インラインテキスト自体の処理（パラグラフ中間のアンカー対応）
  const defaultInlineRender =
    md.renderer.rules.text ||
    ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    // 文中の{#anchor_id}パターンを検出して処理
    if (token.content.includes("{#")) {
      // 末尾アンカーパターン検出
      const match = token.content.match(CONTENT_WITH_ANCHOR_PATTERN);
      if (match) {
        const [, text, id] = match;
        token.content = `${text.trim()}<span id="${id}"></span>`;
        token.type = "html_inline";
      } else {
        // 行中のアンカーを<span id="..."></span>に変換
        token.content = token.content.replace(
          INLINE_ANCHOR_PATTERN,
          (match, before, id, after) => {
            return `<span id="${id}"></span>`;
          }
        );

        // テキストをhtml_inlineタイプに変更（HTMLタグを許可するため）
        token.type = "html_inline";
      }
    }

    return defaultInlineRender(tokens, idx, options, env, self);
  };
};

/**
 * インラインの子要素からアンカーIDを処理する補助関数
 */
function processChildrenWithAnchors(children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === "text" && child.content) {
      // 行末の {#id} パターン検出
      const childMatch = child.content.match(CONTENT_WITH_ANCHOR_PATTERN);
      if (childMatch) {
        child.content = childMatch[1].trim();
        // 子要素の内容がすべて空になった場合は削除
        if (!child.content.trim() && i === children.length - 1) {
          children.pop();
        }
      }
    }
  }
}

/**
 * section化処理プラグイン - tips.mdファイル用
 * 見出しとその内容をsectionタグで囲み、見出しのIDをsectionのIDとして設定する
 * h4は対応するh3の内部に配置される
 *
 * 最適化: DOMパーサーよりも文字列処理を優先し、パフォーマンスを向上
 */
const sectionWrapperPlugin = (md) => {
  // オリジナルのrenderメソッドを保存
  const originalRender = md.render.bind(md);

  // renderメソッドをオーバーライド
  md.render = (src, env) => {
    // 環境変数からファイル名を取得または処理フラグを確認
    isProcessingTipsFile =
      env &&
      ((env.filePath && env.filePath.endsWith("tips.md")) ||
        env.isTipsProcessed);

    if (!isProcessingTipsFile) {
      // 通常のレンダリングを行う
      return originalRender(src, env);
    }

    // 既に処理済みかチェック（二重処理防止）
    if (env && env.isBeingProcessed) {
      // 通常のレンダリングを行う（プラグイン処理をスキップ）
      return originalRender(src, env);
    }

    // 処理中フラグをセット
    if (env) {
      env.isBeingProcessed = true;
    }

    // 通常のHTMLを生成
    const html = originalRender(src, env);

    // ブラウザ環境かどうか判定
    const isBrowser =
      typeof window !== "undefined" && typeof document !== "undefined";

    // 処理結果
    let resultHtml;

    if (isBrowser) {
      try {
        // ブラウザ環境ではDOMParser使用を試みる（より安全な構造化処理のため）
        resultHtml = processTipsWithDOMMethod(html);
      } catch (e) {
        console.error("ブラウザでのDOM処理に失敗しました:", e);
        // DOM処理に失敗した場合は文字列処理にフォールバック
        resultHtml = processTipsWithStringMethod(html, src);
      }
    } else {
      // 非ブラウザ環境では文字列処理を使用
      resultHtml = processTipsWithStringMethod(html, src);
    }

    // 処理フラグをリセット
    if (env) {
      env.isBeingProcessed = false;
      env.isTipsProcessed = true; // 処理済みフラグをセット
    }

    return resultHtml;
  };

  /**
   * DOM処理を使用したtips.md処理（ブラウザ環境用）
   */
  function processTipsWithDOMMethod(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
    const container = doc.body.firstChild;

    // 見出し要素を検索（h3, h4, h5, h6）
    const headings = Array.from(container.querySelectorAll("h3, h4, h5, h6"));

    // 見出し情報を収集
    const headingData = [];
    headings.forEach((heading) => {
      const id = heading.id;
      if (!id) return; // IDがない場合はスキップ

      const level = parseInt(heading.tagName.substring(1));
      headingData.push({
        id,
        level,
        element: heading,
      });
    });

    // 何もなければ元のHTMLを返す
    if (headingData.length === 0) {
      return html;
    }

    // h3とh4の関係を構築
    const h3Sections = [];
    let currentH3 = null;

    headingData.forEach((heading) => {
      if (heading.level === 3) {
        // 新しいh3セクション
        currentH3 = {
          id: heading.id,
          element: heading.element,
          children: [],
        };
        h3Sections.push(currentH3);
      } else if (heading.level === 4 && currentH3) {
        // h4をh3の子として追加
        currentH3.children.push({
          id: heading.id,
          element: heading.element,
        });
      }
    });

    // 新しいDOMを構築
    const newDocument = document.implementation.createHTMLDocument();
    const newContainer = newDocument.createElement("div");

    // 各h3セクションを処理
    h3Sections.forEach((h3Section) => {
      // h3セクションを作成
      const sectionElement = newDocument.createElement("section");
      sectionElement.id = h3Section.id;

      // h3要素をコピー
      const h3Element = h3Section.element;
      const h3Clone = h3Element.cloneNode(true);
      sectionElement.appendChild(h3Clone);

      // h3の後ろの要素を追加（次のh3まで）
      let nextElement = h3Element.nextElementSibling;
      while (nextElement && !nextElement.matches("h3")) {
        // h4要素の場合、それ自体をセクションとして処理
        if (
          nextElement.matches("h4") &&
          h3Section.children.some((child) => child.element === nextElement)
        ) {
          // h4のセクションを作成
          const h4Id = nextElement.id;
          const h4Section = newDocument.createElement("section");
          h4Section.id = h4Id;

          // h4要素をコピー
          const h4Clone = nextElement.cloneNode(true);
          h4Section.appendChild(h4Clone);

          // h4の後ろの要素を追加（次のh3またはh4まで）
          let h4NextElement = nextElement.nextElementSibling;
          while (
            h4NextElement &&
            !h4NextElement.matches("h3") &&
            !h4NextElement.matches("h4")
          ) {
            const clone = h4NextElement.cloneNode(true);
            h4Section.appendChild(clone);
            h4NextElement = h4NextElement.nextElementSibling;
          }

          // h4セクションをh3セクションに追加
          sectionElement.appendChild(h4Section);
          nextElement = h4NextElement;
        } else {
          // 通常の要素（h4以外）
          const clone = nextElement.cloneNode(true);
          sectionElement.appendChild(clone);
          nextElement = nextElement.nextElementSibling;
        }

        if (!nextElement) break;
      }

      // セクションを新コンテナに追加
      newContainer.appendChild(sectionElement);
    });

    // 新しいHTMLを返す
    return newContainer.innerHTML;
  }

  /**
   * 文字列ベースでtips.mdを処理する補助関数
   */
  function processTipsWithStringMethod(html, src) {
    // マークダウンソースから見出しを特定
    let mdHeadings = [];
    let match;

    // 正規表現の状態をリセット
    MD_HEADING_REGEX.lastIndex = 0;
    while ((match = MD_HEADING_REGEX.exec(src)) !== null) {
      const level = match[1].length;
      const title = match[2];
      const id = match[3] || ""; // IDがない場合は空文字列

      if (id) {
        mdHeadings.push({
          level,
          title,
          id,
        });
      }
    }

    // HTML内の見出しを検出
    let matches = [];

    // 正規表現の状態をリセット
    HTML_HEADING_REGEX.lastIndex = 0;
    while ((match = HTML_HEADING_REGEX.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const id = match[3];
      const fullTag = match[0];
      const position = match.index;

      matches.push({
        level,
        id,
        fullTag,
        position,
        endPosition: position + fullTag.length,
      });
    }

    if (matches.length === 0) return html;

    // 見出しレベルごとに整理
    matches.sort((a, b) => a.position - b.position);

    // セクション構造を構築
    const h3Sections = [];
    let currentH3 = null;
    let h4Sections = [];

    for (let i = 0; i < matches.length; i++) {
      const heading = matches[i];
      const nextHeading = matches[i + 1];
      const level = heading.level;

      if (level === 3) {
        // 前のh3セクションを完了
        if (currentH3) {
          h3Sections.push({
            ...currentH3,
            children: [...h4Sections],
          });
        }

        // 新しいh3セクションを開始
        currentH3 = heading;
        h4Sections = [];
      } else if (level === 4 && currentH3) {
        // h4セクションを現在のh3の子として追加
        h4Sections.push(heading);
      }

      // セクションのコンテンツ範囲を設定
      const startPos = heading.endPosition;
      const endPos = nextHeading ? nextHeading.position : html.length;

      heading.contentStart = startPos;
      heading.contentEnd = endPos;
    }

    // 最後のh3セクションを追加
    if (currentH3) {
      h3Sections.push({
        ...currentH3,
        children: [...h4Sections],
      });
    }

    // 新しいHTMLを構築（元のHTMLは使用せず新規生成）
    let resultContent = "";

    // h3セクションとその子h4セクションを処理
    h3Sections.forEach((h3Section) => {
      const h3Start = h3Section.position;
      const h3End =
        h3Section.children.length > 0
          ? h3Section.children[0].position // h3の終わりは最初のh4の開始位置
          : h3Section.contentEnd;

      // h3セクションのコンテンツを取得（最初のh4までの部分）
      let h3Content = html.substring(h3Start, h3End);

      // h4セクションを処理してh3コンテンツに追加
      let h4Contents = "";
      h3Section.children.forEach((h4Section, index) => {
        const h4Start = h4Section.position;
        const h4End =
          index < h3Section.children.length - 1
            ? h3Section.children[index + 1].position // 次のh4の開始位置まで
            : h4Section.contentEnd; // 最後のh4の場合はcontentEndまで

        // h4セクションのコンテンツを取得
        const h4Content = html.substring(h4Start, h4End);

        // h4セクションのコンテンツをラップ
        h4Contents += `<section id="${h4Section.id}">${h4Content}</section>`;
      });

      // h3とh4のコンテンツを組み合わせる
      const combinedContent = h3Content + h4Contents;

      // h3セクション全体をラップ
      const wrappedH3 = `<section id="${h3Section.id}">${combinedContent}</section>`;

      // コンテンツに追加
      resultContent += wrappedH3;
    });

    // 完全に新しいHTMLを返す（元のHTMLとは置き換える）
    return resultContent;
  }
};

/**
 * markdown-itを初期化する
 */
export function useMarkdownIt(options = {}) {
  // 既存のインスタンスがある場合は再利用
  if (mdInstance) {
    return mdInstance;
  }

  // markdown-itインスタンスを作成
  mdInstance = new MarkdownIt.default({
    html: true, // HTMLタグを許可
    breaks: true, // 改行をbrに変換
    linkify: false, // URLの自動リンク化を無効化（punycode依存を回避）
    typographer: true, // 引用符や--などの変換
    ...options,
  });

  // プラグインを追加
  mdInstance.use(mdTable); // 拡張テーブルサポート

  // カスタムプラグインを登録
  mdInstance.use(externalLinksPlugin);
  mdInstance.use(headingAnchorPlugin);
  mdInstance.use(inlineAnchorPlugin);
  mdInstance.use(sectionWrapperPlugin); // セクション化プラグインを追加

  return mdInstance;
}

/**
 * markedを初期化する
 * 最適化: 実際にインスタンスを構成するよう改善
 */
export function useMarked() {
  if (!markedInstance) {
    // markedのインスタンスを構成してシングルトンとして保存
    markedInstance = marked.use({
      // オプション設定（必要に応じて）
      gfm: true,
      breaks: true,
    });
  }
  return markedInstance;
}

/**
 * Markdownをレンダリングする
 */
export function render(markdown, env = {}) {
  if (typeof markdown !== "string") {
    console.error("markdown must be a string");
    return "";
  }

  try {
    // markdown-itを優先して使用
    const md = mdInstance || useMarkdownIt();
    return md.render(markdown, env);
  } catch (error) {
    console.error("markdown-it rendering failed:", error);

    // フォールバックとしてmarkedを使用
    try {
      const markedParser = markedInstance || useMarked();
      return markedParser(markdown);
    } catch (markedError) {
      console.error("marked rendering also failed:", markedError);
      return "";
    }
  }
}

/**
 * tips.mdファイル専用のレンダリング関数
 * 見出しとその内容をsectionタグで囲み、見出しのIDをsectionのIDとして設定する
 */
export function renderTipsFile(markdown) {
  if (typeof markdown !== "string") {
    console.error("markdown must be a string");
    return "";
  }

  // 専用のフラグをセットしてレンダリング
  return render(markdown, { filePath: "tips.md", isTipsProcessed: false });
}

// 一貫性のあるAPIを提供するためのエクスポート
export default {
  render,
  useMarkdownIt,
  useMarked,
  renderTipsFile,
}; 