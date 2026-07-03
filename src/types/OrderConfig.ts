/** Semantic Tailwind class groups in ascending sort priority. */
type OrderConfig = {
  priority: Array<string>;
};

/** Optional additions positioned relative to a bundled priority entry. */
type OrderOverrides = {
  before?: Record<string, string>;
  after?: Record<string, string>;
};

export type { OrderConfig, OrderOverrides };
