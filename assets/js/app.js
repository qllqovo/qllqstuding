/* ============================================================
 * qllqstuding · 共享交互脚本
 * 登录校验 / 会话状态 / 路由地图 / 页面守卫 / 跳转
 * 说明：纯原生 JS，无构建依赖；状态存于 sessionStorage。
 * ============================================================ */

(function (global) {
  'use strict';

  /* ---------- 常量：合法凭据（按需求固定） ---------- */
  var VALID_ACCOUNT = '7667';
  var VALID_PASSWORD = '123456';

  var AUTH_KEY = 'qllq_auth';
  var GRADE_KEY = 'qllq_grade';

  /* ---------- 科目清单（顺序即页面排列顺序） ---------- */
  var SUBJECTS = [
    { key: 'chinese', name: '语文' },
    { key: 'math', name: '数学' },
    { key: 'english', name: '英语' },
    { key: 'physics', name: '物理' },
    { key: 'history', name: '历史' },
    { key: 'politics', name: '政治' },
    { key: 'geography', name: '地理' },
    { key: 'biology', name: '生物' },
    { key: 'chemistry', name: '化学' }
  ];

  /* ---------- 内容路由地图 ----------
   * 路径相对 pages/subject-home.html
   * 后续新增科目/文档：在对应年级下追加 { file, title } 即可。
   */
  var CONTENT_MAP = {
    junior: {
      math: [
        { file: '../content/junior/math/knowledge.html', title: '九上数学 · 重点题型全解' },
        { file: '../content/junior/math/mistakes.html', title: '九上数学 · 易错点整理' }
      ]
    },
    senior: {
      math: [
        { file: '../content/senior/math/line-circle.html', title: '直线与圆的方程 · 交互演示' },
        { file: '../content/senior/math/space-vector.html', title: '空间向量的应用 · 知识点' }
      ],
      physics: [
        { file: '../content/senior/physics/formulas.html', title: '物理公式速记本' },
        { file: '../content/senior/physics/exam-points.html', title: '会考知识点与公式考点总结' }
      ],
      geography: [
        { file: '../content/senior/geography/geography-b2.html', title: '高一必修二 · 地理背诵要点' }
      ],
      chemistry: [
        { file: '../content/senior/chemistry/qualifying.html', title: '化学合格考 · 学习工具' },
        { file: '../content/senior/chemistry/knowledge-2023.html', title: '2023 化学会考知识点' },
        { file: '../content/senior/chemistry/module-strategy.html', title: '会考重点知识模块突破策略' }
      ]
    }
  };

  var GRADE_LABEL = { junior: '初中', senior: '高中' };

  /* ---------- 基础工具 ---------- */
  function getParam(name) {
    var params = new URLSearchParams(global.location.search);
    return params.get(name);
  }

  function go(url) {
    global.location.href = url;
  }

  /* ---------- 会话状态 ---------- */
  function isAuthed() {
    return global.sessionStorage.getItem(AUTH_KEY) === '1';
  }

  function setAuthed() {
    global.sessionStorage.setItem(AUTH_KEY, '1');
  }

  function clearAuth() {
    global.sessionStorage.removeItem(AUTH_KEY);
    global.sessionStorage.removeItem(GRADE_KEY);
  }

  function getGrade() {
    return global.sessionStorage.getItem(GRADE_KEY) || getParam('grade');
  }

  function setGrade(grade) {
    global.sessionStorage.setItem(GRADE_KEY, grade);
  }

  function gradeLabel(grade) {
    return GRADE_LABEL[grade] || '';
  }

  /* ---------- 登录校验 ---------- */
  function login(account, password) {
    var acc = String(account == null ? '' : account).trim();
    var pwd = String(password == null ? '' : password).trim();
    if (acc === VALID_ACCOUNT && pwd === VALID_PASSWORD) {
      setAuthed();
      return true;
    }
    return false;
  }

  /* ---------- 页面守卫 ----------
   * 未登录时跳转登录页；loginUrl 由调用方按页面深度传入。
   */
  function guard(loginUrl) {
    if (!isAuthed()) {
      go(loginUrl || '../index.html');
      return false;
    }
    return true;
  }

  /* ---------- 内容查询 ---------- */
  function getContent(grade, subjectKey) {
    var gradeMap = CONTENT_MAP[grade];
    if (!gradeMap) return [];
    return gradeMap[subjectKey] || [];
  }

  function getSubjectName(key) {
    for (var i = 0; i < SUBJECTS.length; i++) {
      if (SUBJECTS[i].key === key) return SUBJECTS[i].name;
    }
    return key;
  }

  /* ---------- 暴露接口 ---------- */
  global.Qllq = {
    VALID_ACCOUNT: VALID_ACCOUNT,
    SUBJECTS: SUBJECTS,
    CONTENT_MAP: CONTENT_MAP,
    getParam: getParam,
    go: go,
    isAuthed: isAuthed,
    setAuthed: setAuthed,
    clearAuth: clearAuth,
    getGrade: getGrade,
    setGrade: setGrade,
    gradeLabel: gradeLabel,
    login: login,
    guard: guard,
    getContent: getContent,
    getSubjectName: getSubjectName
  };
})(window);
