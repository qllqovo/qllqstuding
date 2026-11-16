/* ============================================================
 * qllqstuding · 公式渲染器（KaTeX）
 * 双 CDN 自动回退：jsDelivr → cdnjs
 * 支持 \(...\) 行内、\[...\] 与 $$...$$ 块级公式
 * 任一 CDN 被网络拦截时自动切换，避免手机端显示 LaTeX 源码。
 * ============================================================ */
(function (global) {
  'use strict';

  var VERSION = '0.16.11';

  var CDNS = [
    {
      css: 'https://cdn.jsdelivr.net/npm/katex@' + VERSION + '/dist/katex.min.css',
      js: 'https://cdn.jsdelivr.net/npm/katex@' + VERSION + '/dist/katex.min.js',
      auto: 'https://cdn.jsdelivr.net/npm/katex@' + VERSION + '/dist/contrib/auto-render.min.js'
    },
    {
      css: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/' + VERSION + '/katex.min.css',
      js: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/' + VERSION + '/katex.min.js',
      auto: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/' + VERSION + '/contrib/auto-render.min.js'
    }
  ];

  var DELIMITERS = [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ];

  function loadCss(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function () { resolve(); };
      link.onerror = function () { reject(new Error('css fail: ' + href)); };
      document.head.appendChild(link);
    });
  }

  function loadJs(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('js fail: ' + src)); };
      document.head.appendChild(s);
    });
  }

  function tryCdn(cdn) {
    return loadCss(cdn.css)
      .then(function () { return loadJs(cdn.js); })
      .then(function () { return loadJs(cdn.auto); });
  }

  function render(target) {
    if (typeof global.renderMathInElement === 'function') {
      global.renderMathInElement(target || document.body, {
        delimiters: DELIMITERS,
        throwOnError: false,
        strict: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option']
      });
    }
  }

  function boot() {
    var chain = Promise.reject();
    CDNS.forEach(function (cdn) {
      chain = chain.catch(function () { return tryCdn(cdn); });
    });
    return chain
      .then(function () {
        api.ready = true;
        render();
        document.dispatchEvent(new Event('qllq:tex-ready'));
      })
      .catch(function () {
        document.documentElement.classList.add('tex-failed');
      });
  }

  var api = {
    ready: false,
    render: render,
    boot: boot
  };

  global.QllqTex = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* 兜底：页面全部资源加载完成后再渲染一次 */
  global.addEventListener('load', function () {
    if (global.renderMathInElement) { render(); }
  });
})(window);
