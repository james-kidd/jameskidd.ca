# Decisions

Architecture decision records for jameskidd.info, one file per decision,
numbered. Status is `proposed` until James answers the matching numbered
decision in the vault report "jameskidd.info - content system considerations"
(2026-11-05), then `accepted` or `superseded`.

| ADR | decision | status |
|---|---|---|
| [0001](0001-repo-is-the-master-for-published-words.md) | the repo is the master for every published word | proposed |
| [0002](0002-approval-stamps-gate-publication.md) | approval stamps gate what goes online | accepted |
| [0003](0003-copy-deck-is-generated.md) | the copy deck is generated, never hand-kept | proposed |
| [0004](0004-content-types-have-schemas.md) | every content type has a JSON Schema with its schema.org mapping | proposed |
| [0005](0005-project-pages-are-briefs.md) | a project page is a brief the project repo delivers | proposed |
| [0006](0006-comments-through-giscus-on-click.md) | comments through giscus, loaded on click | proposed |
| [0007](0007-ci-gates.md) | lint, content check, deck check, brief check and build block every PR | proposed |
| [0008](0008-content-is-markdown-not-mdx.md) | content is Markdown with frontmatter, not MDX | accepted |

Shape: context, decision, consequences, in a few lines each. A decision that
needs a diagram gets a draw.io SVG in the vault, linked from the ADR.
