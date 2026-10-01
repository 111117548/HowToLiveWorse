import { categories, entries } from "../data/entries.js";

const required = [
  "id", "category", "title", "temptation", "loss", "stop", "risk",
  "reversibility", "evidence", "effort", "sourceLabel", "sourceUrl", "tags"
];
const categoryIds = new Set(categories.map((item) => item.id));
const ids = new Set();
const errors = [];

if (entries.length !== 40) {
  errors.push(`首版应包含 40 条，当前为 ${entries.length} 条。`);
}

for (const [index, entry] of entries.entries()) {
  const where = `第 ${index + 1} 条 (${entry.id || "无 id"})`;
  for (const field of required) {
    if (entry[field] === undefined || entry[field] === null || entry[field] === "") {
      errors.push(`${where} 缺少字段 ${field}。`);
    }
  }
  if (ids.has(entry.id)) errors.push(`${where} 的 id 重复。`);
  ids.add(entry.id);
  if (!/^[a-z0-9-]+$/.test(entry.id)) errors.push(`${where} 的 id 格式无效。`);
  if (!categoryIds.has(entry.category)) errors.push(`${where} 使用未知分类 ${entry.category}。`);
  if (![3, 4, 5].includes(entry.risk)) errors.push(`${where} 的 risk 应为 3、4 或 5。`);
  if (!["A", "B", "C"].includes(entry.evidence)) errors.push(`${where} 的 evidence 无效。`);
  if (![1, 2, 3].includes(entry.effort)) errors.push(`${where} 的 effort 无效。`);
  if (!Array.isArray(entry.tags) || entry.tags.length < 2) errors.push(`${where} 至少需要两个标签。`);
  try {
    const source = new URL(entry.sourceUrl);
    if (source.protocol !== "https:") errors.push(`${where} 的来源必须使用 HTTPS。`);
  } catch {
    errors.push(`${where} 的来源链接无效。`);
  }
}

for (const category of categories) {
  const count = entries.filter((entry) => entry.category === category.id).length;
  if (count !== 5) errors.push(`分类 ${category.name} 应有 5 条，当前为 ${count} 条。`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`✓ 数据有效：${entries.length} 条、${categories.length} 类、${ids.size} 个唯一 ID。`);
