// src/data/sections/personal/index.js
// Assembles the sectionData.personal branch from its per-slice modules.
// Each slice is hand-edited in its own file (nothing here is generated) so that
// separate changes to stats, milestones, favorites and gallery don't collide.
// The keys of `personal` are composed here, not in ../index.js.

import { stats } from "./stats";
import { milestones } from "./milestones";
import { favorites } from "./favorites";
import { gallery } from "./gallery";

export const personal = {
  stats,
  milestones,
  favorites,
  gallery,
};
