# qllqstuding · 家教辅导系统

北欧极简风（Hygge）静态站点：登录 → 选择年级（初中 / 高中）→ 选择科目 → 查看对应学习资料。纯原生 HTML / CSS / JS，无构建依赖。

## 一、本地运行

直接用浏览器打开根目录 `index.html` 即可；无需启动服务器。

- 登录账号：`7667`
- 登录密码：`123456`
- 账号或密码错误时提示：`账号密码错误，请重新输入`

## 二、目录结构

```
qllqstuding/
├── index.html                  # 登录页
├── pages/
│   ├── grade.html              # 年级选择（初中 / 高中）
│   ├── subject.html            # 科目选择（九科）
│   └── subject-home.html       # 某年级 + 某科目的资料列表
├── assets/
│   ├── css/
│   │   ├── nordic.css          # 设计令牌与通用组件（配色 / 字体 / 间距 / 圆角 / 过渡）
│   │   └── content.css         # 迁移内容页的换皮样式
│   ├── js/
│   │   └── app.js              # 登录校验、会话状态、路由地图、页面守卫
│   └── archive/                # 原始 Word 文档归档（按 初中/高中/科目 分类）
└── content/
    ├── junior/                 # 初中
    │   └── math/
    └── senior/                 # 高中
        ├── math/  physics/  geography/  chemistry/
```

## 三、科目与内容路由

科目共九科：语文、数学、英语、物理、历史、政治、地理、生物、化学。

内容与文件的对应关系集中维护在 `assets/js/app.js` 的 `CONTENT_MAP` 中，按 `年级 → 科目 → 资料列表` 组织。

### 后续新增 / 修改某一科目内容

1. 在对应年级目录下放入 HTML，例如 `content/senior/chemistry/xxx.html`；
2. 打开 `assets/js/app.js`，在 `CONTENT_MAP` 对应年级与科目下追加：
   ```js
   chemistry: [
     { file: '../content/senior/chemistry/xxx.html', title: '资料标题' }
   ]
   ```
3. 内容页样式统一继承 `assets/css/nordic.css` 与 `assets/css/content.css`，不要单独引入高饱和配色。

## 四、分支约定（按模块 / 科目）

- `main`：主干，保持可运行状态。
- `ui-login`：登录页 `index.html` 与登录校验逻辑。
- `ui-grade`：年级选择页 `pages/grade.html`。
- `ui-subject`：科目选择与资料列表页（`subject.html`、`subject-home.html`）及路由地图。
- `content-<年级>-<科目>`：各科目内容页，例如 `content-senior-chemistry`。

新增科目时，从 `main` 拉出 `content-<年级>-<科目>` 分支，完成后合并回 `main`。

## 五、设计规范（不可随意改动）

- 配色：暖灰白 `#f5f0eb` 画布、炭灰 `#3d3d3d` 文字、木色 `#a89279` 次级文字、苔绿 `#5a7a6b` 强调、灰蓝 `#7ba0b8` 链接、沙色 `#c9a88c` 分隔。
- 字重：仅使用 200 / 300 / 400；圆角统一 `2px`；边框 `1px`、30% 透明度。
- 过渡：`700ms ease-in-out`；hover 只改变边框与底色，不位移、不弹跳。
- 留白：元素间距至少 `40px`；页面最大宽度 `1040px`。
- 饱和度全部压在 30% 以下，不使用高饱和鲜艳色、粗边框与强阴影。

## 六、推送到 GitHub（待关联远程）

当前为本地仓库。关联已创建的远程仓库 `qllqstuding` 后：

```bash
git remote add origin <仓库地址>
git push -u origin main
# 依次推送特性分支
git push origin ui-login ui-grade ui-subject
```

> 说明：本机尚未配置 GitHub 凭据（无 SSH 密钥、无已保存的 HTTPS 凭据），首次推送需提供 Personal Access Token 或配置 SSH。
