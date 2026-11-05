// src/data/comments.js
//
// Comments on project pages, through giscus (GitHub Discussions). Nothing is
// loaded until the reader clicks "Load comments", so no third-party script
// runs on a plain visit.
//
// Setup, once (James):
//   1. Create a public repo, e.g. james-kidd/jameskidd-comments, and enable
//      Discussions on it (Settings, Features). A separate repo keeps comment
//      threads out of the site's own Discussions.
//   2. Install the giscus GitHub app on that repo: https://github.com/apps/giscus
//   3. Open https://giscus.app, pick the repo and a category (an "Announcements"
//      type category means only giscus can open threads), and copy the
//      data-repo-id and data-category-id it shows into the fields below.
//   4. Set enabled: true. Each page maps to a thread by its path, e.g.
//      "projects/paint-by-number".

export const commentsConfig = {
  enabled: false,
  repo: "",
  repoId: "",
  category: "Comments",
  categoryId: "",
};
