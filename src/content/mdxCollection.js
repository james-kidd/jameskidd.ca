const DEFAULT_ORDER = 999;

export function byOrder(a, b) {
  return (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER);
}

export function collectMdx(modules, { componentName = "Body", filter, sort } = {}) {
  const entries = Object.entries(modules).map(([path, mod]) => ({
    ...mod.frontmatter,
    [componentName]: mod.default,
    sourcePath: path,
  }));

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
