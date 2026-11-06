const DEFAULT_ORDER = 999;

export function byOrder(a, b) {
  return (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER);
}

// Entries with `published: false` in frontmatter are held: the file stays in the
// repo but is dropped here, so it gets no card, no route, and no sitemap entry.
//
// The same happens to an entry whose approval stamp is missing or stale while
// content.approvals.json has requireApproval: true. The `approval` export comes
// from scripts/remark-approval.mjs; stamp with `npm run approve` (docs/approvals.md).
export function isApproved(approval) {
  if (!approval || !approval.required || !approval.droppable) return true;
  return approval.status === "approved";
}

export function collectMdx(modules, { componentName = "Body", filter, sort } = {}) {
  const entries = Object.entries(modules)
    .map(([path, mod]) => ({
      ...mod.frontmatter,
      [componentName]: mod.default,
      sourcePath: path,
      approval: mod.approval ?? null,
    }))
    .filter((entry) => entry.published !== false)
    .filter((entry) => isApproved(entry.approval));

  const filtered = filter ? entries.filter(filter) : entries;

  return sort ? [...filtered].sort(sort) : filtered;
}

export function groupBy(entries, key) {
  return entries.reduce((groups, entry) => {
    const group = entry[key];
    if (!group) return groups;

    groups[group] = groups[group] ?? [];
    groups[group].push(entry);
    return groups;
  }, {});
}

export function keyBy(entries, key, value = (entry) => entry) {
  return Object.fromEntries(
    entries
      .filter((entry) => entry[key])
      .map((entry) => [entry[key], value(entry)])
  );
}
