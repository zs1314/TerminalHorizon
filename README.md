# TerminalHorizon · GitHub Pages 部署

这是当前网站的静态发布包，不需要 npm install、编译或后端服务。
解压后，`index.html`、JavaScript、CSS 和 `assets/` 位于同一层。

## 方式一：独立项目仓库（推荐）

1. 创建或使用名为 `TerminalHorizon` 的 GitHub 仓库。
2. 将解压后的**全部文件**上传到 `main` 分支的根目录，包括隐藏文件 `.nojekyll`。不要只上传 ZIP，也不要再套一层 `dist/` 或 `TerminalHorizon/` 目录。
3. 在仓库中打开 **Settings → Pages**。
4. 将 **Source** 设为 **Deploy from a branch**，选择 **main** 和 **/(root)**，然后保存。
5. 等待 Pages 部署完成，访问 `https://<你的 GitHub 用户名>.github.io/TerminalHorizon/`。

例如，账号为 `zs1314` 时，对应地址是 `https://zs1314.github.io/TerminalHorizon/`。
大小写应与仓库名称一致。

## 方式二：已有个人主页仓库

如果你已经使用 `<用户名>.github.io` 仓库发布个人主页，可以将本包的全部文件放在该仓库的 `TerminalHorizon/` 目录中，继续使用原有 Pages 配置。
不要覆盖个人主页根目录的 `index.html` 或更改原有站点的域名配置。

## 后续更新

- 本包使用相对资源路径，可从 `/TerminalHorizon/` 加载。
- 不包含调试备份、旧版赛车素材、源任务文件夹或未公开的论文 PDF。
- Environments、Trajectories 和 Model weights 目前均指向作者提供的 Hugging Face collection。
- 论文入口仍为占位符。arXiv 发布后，修改 `project.js` 中的 `resources.paper`。
- 同一文件的 `citation` 中可更新 `year`、`eprint`、`primaryClass` 和 `url`。BibTeX 和复制功能会自动采用新信息。
- 后续更新网站时，上传更新过的文件并保持原有目录结构。保留仓库中不属于本包的其他文件。

## 参考与素材来源

- [GitHub Pages 发布源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages 入口文件与 .nojekyll](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- Hugging Face 图标来自 [Hugging Face brand assets](https://huggingface.co/brand)。
- arXiv 图标来自 [arXiv brand assets](https://info.arxiv.org/brand/brand-guidelines.html)。相关商标属于各自所有者。

本包没有执行 GitHub 上传、提交或线上部署操作。
