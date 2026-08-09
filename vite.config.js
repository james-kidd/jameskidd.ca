import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  build: {
    // The SSR pass only produces the render bundle consumed by
    // scripts/prerender.js — copying public/ into it would duplicate several
    // MB of photos, the resume PDF and the favicon on every build.
    copyPublicDir: !isSsrBuild,
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md)$/ }),
    tailwindcss(),
  ],
  ssr: {
    // react-simple-maps ships CJS + ESM without an `exports` map; bundling it
    // (rather than letting Node resolve it) keeps the SSG render pass working.
    noExternal: ['react-simple-maps'],
  },
}))
