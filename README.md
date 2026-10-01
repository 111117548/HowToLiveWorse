# 低性价比人生指南

> 一本不建议照做的生活指南：把常见坏决策的诱惑说透，再把真实账单和最小止损动作摆出来。

[在线阅读](https://111117548.github.io/HowToLiveWorse/) · [提交条目](https://github.com/111117548/HowToLiveWorse/issues/new/choose) · [方法与证据](METHODOLOGY.md)

## 这是什么

《低性价比人生指南》是一份黑色幽默式反面清单。首版收录 40 个高成本、低回报的生活反模式，覆盖：

- 身体透支
- 金钱蒸发
- 注意力粉碎
- 数字裸奔
- 工作与法律
- 关系内耗
- 学习绕路
- 应急失灵

每个条目都回答四个问题：

1. 它为什么一开始很诱人？
2. 真正的代价是什么？
3. 现在最小能做的止损动作是什么？
4. 这个判断的证据有多硬、来源在哪里？

项目受 [eternity4719/HowToLiveBetter（《高性价比人生指南》）](https://github.com/eternity4719/HowToLiveBetter)启发，但内容为独立创作，项目之间没有隶属或背书关系。

## 重要边界

“作死”只是一种黑色幽默，指长期消耗健康、金钱、时间、关系或自由的坏习惯与坏决策。

本项目不接受以下内容：

- 自残、自杀、伤害他人或违法行为的可执行方法；
- 把高风险行为包装成挑战、攻略或娱乐；
- 只有恐吓或羞辱、没有止损动作的文案；
- 编造统计数字、伪造来源或把经验意见写成医学/法律结论。

如果你正处在现实危险中，请立即联系当地急救服务、可信任的人或就近的医疗机构。本站不是医疗、法律或财务意见。

## 本地运行

项目是纯静态站点，无框架、无构建依赖。

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

验证内容数据：

```bash
npm test
```

## 部署

仓库内置 GitHub Pages 工作流。推送到 `main` 后，会尝试自动启用并发布 Pages。若首次运行提示 Pages 未启用，在仓库的 **Settings → Pages → Source** 中选择 **GitHub Actions**，再重新运行工作流。

## 贡献

先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。新增条目应使用“诱惑—账单—止损”的结构，并遵守 [METHODOLOGY.md](METHODOLOGY.md) 中的证据等级和安全红线。

## 许可

- 网页代码： [MIT License](LICENSE)
- 文字内容与条目数据： [CC BY-SA 4.0](LICENSE-CONTENT.md)

引用或改编时，请注明“低性价比人生指南 / HowToLiveWorse”并链接回本仓库。原始来源仍受各自许可与条款约束。
