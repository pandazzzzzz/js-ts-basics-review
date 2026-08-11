// Build Tools Integration Demo
// 📘 For TypeScript comparison, see: 49-build-tools-ts-comparison.ts
// 📘 Webpack: https://webpack.js.org/
// 📘 Vite: https://vitejs.dev/
// 📌 Covers webpack, vite, code splitting, and production optimization

// ============================================
// Learning goals
// ============================================
// This file introduces common build-tool concepts that support modern JavaScript workflows.
// The examples show how bundlers and tooling shape the way code is delivered and optimized.

// ============================================
// Table of Contents
// ============================================

// 1. Section 1: Webpack Configuration
// 2. Section 2: Vite Configuration
// 3. Section 3: Code Splitting
// 4. Section 4: Production Optimization
// 5. Common Pitfalls
// 6. Best Practices
// 7. Section 5: Additional Build Tooling

// ============================================

// ============================================
// 1. Section 1: Webpack Configuration
// ============================================

console.log("\n=== Webpack Configuration ===");

// Basic webpack.config.js
const webpackBasicConfig = `
const path = require('path');

module.exports = {
  // Entry point
  entry: './src/index.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Clean dist folder before build
  },
  
  // Mode: development or production
  mode: 'development',
  
  // Source maps for debugging
  devtool: 'source-map',
  
  // Dev server
  devServer: {
    static: './dist',
    port: 3000,
    hot: true
  }
};
`;

console.log("Basic webpack config:");
console.log(webpackBasicConfig);

// Webpack with loaders
const webpackLoadersConfig = `
module.exports = {
  module: {
    rules: [
      // Babel loader for JavaScript
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      // CSS loader
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // SCSS loader
      {
        test: /\\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      
      // File loader for images
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      },
      
      // Font loader
      {
        test: /\\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  }
};
`;

console.log("\nWebpack with loaders:");
console.log(webpackLoadersConfig);

// Webpack with plugins
const webpackPluginsConfig = `
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    // Generate HTML file
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    
    // Extract CSS to separate file
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    
    // Clean dist folder
    new CleanWebpackPlugin()
  ]
};
`;

console.log("\nWebpack with plugins:");
console.log(webpackPluginsConfig);

// Development vs Production config
const webpackEnvConfig = `
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    
    optimization: {
      minimize: !isDevelopment,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    },
    
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      })
    ]
  };
};
`;

console.log("\nEnvironment-specific config:");
console.log(webpackEnvConfig);

// Use cases:
// - Bundle JavaScript modules
// - Transform modern JS to compatible versions
// - Process CSS/SCSS
// - Optimize assets
// - Code splitting

// Common pitfalls:
// ⚠️ Large bundle sizes
// ⚠️ Slow build times
// ⚠️ Complex configuration
// ⚠️ Loader order matters

// ============================================
// 2. Section 2: Vite Configuration
// ============================================

console.log("\n=== Vite Configuration ===");

// Vite 5.x Features (2023-2024)
console.log("\nVite 5.x Key Features:");
console.log("1. Powered by Rollup 4 for improved build performance");
console.log("2. Faster HMR with optimized dependency pre-bundling");
console.log("3. Enhanced CSS handling: Lightning CSS default for minification in production");
console.log("   - Optional transformer: 'lightningcss' to replace PostCSS completely");
console.log("4. Better TypeScript support with faster type checking");
console.log("5. Improved ESM support for Node.js compatibility");
console.log("6. Better error messages and debugging experience");
console.log("7. Cleaned up deprecated APIs and streamlined configuration");

// Vite 7.x Features (June 2025)
console.log("\nVite 7.x Key Features:");
console.log("1. Node.js requirement: Node 20.19+ or Node 22.12+ minimum");
console.log("2. baseline-widely-available build target replaces default targets");
console.log("   - Broader browser compatibility out of the box");
console.log("   - Replaces es2020/Chrome 87+ defaults");
console.log("3. Removed Sass legacy API (Ruby Sass)");
console.log("   - Only supports Dart Sass (sass) going forward");
console.log("   - Update: use 'sass' instead of 'node-sass'");
console.log("4. Environment API (experimental)");
console.log("   - Per-environment plugin configuration");
console.log("   - Separate build configs for client/server (SSR)");
console.log("5. Removed splitVendorChunkPlugin");
console.log("6. Improved CSS handling and Lightning CSS integration");

// Basic Vite 7 config with Environment API (SSR)
const vite7EnvConfig = `
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Use baseline-widely-available for broader compatibility
    target: 'baseline-widely-available',
  },

  // Environment API for SSR
  environments: {
    client: {
      build: {
        outDir: 'dist/client',
      },
    },
    ssr: {
      build: {
        outDir: 'dist/ssr',
        rollupOptions: {
          input: './src/entry-server.js',
        },
      },
    },
  },
});
`;

console.log("\nVite 7 with Environment API (SSR):");
console.log(vite7EnvConfig);

// Vite 8.x Features (June 2026)
console.log("\nVite 8.x Key Features:");
console.log("1. Powered by Rolldown (Rust-based bundler, replaces Rollup)");
console.log("   - 10-30x faster production builds");
console.log("   - ~75% less memory usage");
console.log("   - Drop-in replacement for Rollup-based builds");
console.log("2. Improved HMR with Rolldown's incremental compilation");
console.log("3. Native TypeScript ESM output (no .js extension rewriting)");
console.log("4. Better compatibility with Node.js ESM resolution");
console.log("5. Updated plugin API with Rolldown hook compatibility");
console.log("6. Node 20.19+ / 22.12+ minimum (same as Vite 7)");

console.log("\n⚠️ Migration from Vite 7 to Vite 8:");
console.log("- Most Rollup plugins work via compatibility layer");
console.log("- Check custom Rollup plugins for Rolldown compatibility");
console.log("- Review rollupOptions in vite.config.ts for deprecated options");
console.log("- Run 'npx vite build' and check for warnings");

// Vite 8 config with Rolldown
const vite8Config = `
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Rolldown is the default bundler in Vite 8
    // No configuration needed - it just works
    target: 'baseline-widely-available',
  },
});
`;

console.log("\nVite 8 with Rolldown (default):");
console.log(vite8Config);

// Basic vite.config.js
const viteBasicConfig = `
import { defineConfig } from 'vite';

export default defineConfig({
  // Root directory
  root: './src',
  
  // Base public path
  base: '/',
  
  // Build output directory
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  
  // Dev server
  server: {
    port: 3000,
    open: true
  }
});
`;

console.log("Basic vite config:");
console.log(viteBasicConfig);

// Lightning CSS is opt-in
const viteLightningConfig = `
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    // Optional: Use Lightning CSS for processing
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 111,
        safari: 16
      }
    }
  }
});
`;

console.log("\nVite with Lightning CSS (opt-in transformer):");
console.log("// Note: Lightning CSS is used by default for CSS minification in production");
console.log(viteLightningConfig);

// Vite with React
const viteReactConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000
  },
  
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
});
`;

console.log("\nVite with React:");
console.log(viteReactConfig);

// Vite with environment variables
const viteEnvConfig = `
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL)
    },
    
    server: {
      proxy: {
        '/api': {
          target: env.API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\\/api/, '')
        }
      }
    }
  };
});
`;

console.log("\nVite with environment variables:");
console.log(viteEnvConfig);

// .env files
console.log("\n.env file structure:");
console.log(`
# .env.development
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=My App (Dev)

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# Usage in code
const apiUrl = import.meta.env.VITE_API_URL;
`);

// Use cases:
// - Fast development server
// - Hot Module Replacement (HMR)
// - Modern build tool
// - Framework plugins
// - Environment variables

// ============================================
// 3. Section 3: Code Splitting
// ============================================

console.log("\n=== Code Splitting ===");

// Dynamic imports
console.log("Dynamic imports:");
console.log(`
// Load module on demand
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module.js');
  heavyFunction();
});

// Conditional loading
if (userPreference === 'advanced') {
  const { AdvancedFeature } = await import('./advanced-feature.js');
  new AdvancedFeature().init();
}
`);

// Route-based code splitting (React)
console.log("\nRoute-based code splitting (React):");
console.log(`
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
`);

// Webpack code splitting
console.log("\nWebpack splitChunks:");
console.log(`
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor code
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        },
        // Common code
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        },
        // React code
        react: {
          test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
          name: 'react',
          priority: 20
        }
      }
    }
  }
};
`);

// Prefetch and preload
console.log("\nPrefetch and preload:");
console.log(`
// Prefetch: Load during idle time
import(/* webpackPrefetch: true */ './optional-feature.js');

// Preload: Load in parallel with parent
import(/* webpackPreload: true */ './critical-feature.js');

// HTML link tags
<link rel="prefetch" href="/optional-feature.js">
<link rel="preload" href="/critical-feature.js" as="script">
`);

// Use cases:
// - Reduce initial bundle size
// - Load features on demand
// - Route-based splitting
// - Vendor code separation

// ============================================
// 4. Section 4: Production Optimization
// ============================================

console.log("\n=== Production Optimization ===");

// Code minification
console.log("Code minification:");
console.log(`
// Webpack with Terser
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log
            drop_debugger: true
          }
        }
      })
    ]
  }
};

// Vite uses esbuild by default (faster)
export default defineConfig({
  build: {
    minify: 'esbuild', // or 'terser'
    target: 'es2015'
  }
});
`);

// Tree shaking
console.log("\nTree shaking:");
console.log(`
// Only import what you need
import { map, filter } from 'lodash-es'; // ✅ Tree-shakeable
// import _ from 'lodash'; // ❌ Imports everything

// Mark side-effect-free packages
// package.json
{
  "sideEffects": false
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}
`);

// Asset optimization
console.log("\nAsset optimization:");
console.log(`
// Image optimization
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

// Webpack
{
  test: /\\.(png|jpg|jpeg)$/,
  use: [
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { quality: 75 },
        pngquant: { quality: [0.65, 0.90] }
      }
    }
  ]
}

// Vite plugin
import viteImagemin from 'vite-plugin-imagemin';

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 7 },
    mozjpeg: { quality: 75 },
    pngquant: { quality: [0.65, 0.9] }
  })
]
`);

// Caching strategies
console.log("\nCaching strategies:");
console.log(`
// Content hash in filenames
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  }
};

// Cache-Control headers
Cache-Control: public, max-age=31536000, immutable

// Service Worker caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/app.js',
        '/styles.css',
        '/logo.png'
      ]);
    })
  );
});
`);

// Bundle analysis
console.log("\nBundle analysis:");
console.log(`
// Webpack Bundle Analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin()
]

// Vite plugin
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

// Run analysis
npm run build -- --analyze
`);

// Use cases:
// - Reduce bundle size
// - Improve load times
// - Optimize assets
// - Enable caching
// - Monitor bundle size

// ============================================
// 5. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Over-configuration
console.log("\nPitfall 1: Over-configuration");
console.log("  Too many webpack options become confusing");
console.log("  Fix: Start simple, add complexity as needed");

// Pitfall 2: Tree shaking not working
console.log("\nPitfall 2: Tree shaking not working");
console.log("  Side effects prevent dead code elimination");
console.log("  Fix: Use 'sideEffects': false in package.json");
console.log("  Fix: Use ES module imports/exports");

// Pitfall 3: Large bundle sizes
console.log("\nPitfall 3: Large bundle sizes");
console.log("  Bundling entire library instead of needed parts");
console.log("  Fix: Use dynamic imports, analyze bundle size");

// Pitfall 4: Cache invalidation issues
console.log("\nPitfall 4: Cache invalidation");
console.log("  Users get stale cached assets");
console.log("  Fix: Use content hashing in filenames");

// Pitfall 5: Development vs production mismatch
console.log("\nPitfall 5: Development vs production mismatch");
console.log("  Code works in dev but fails in production");
console.log("  Fix: Test production build before deploying");
console.log("  Fix: Minification can change behavior");

// Pitfall 6: Source map exposure
console.log("\nPitfall 6: Source map exposure");
console.log("  Source maps expose original code in production");
console.log("  Fix: Don't upload source maps to public servers");

// ============================================
// 6. Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Analyze bundle size regularly (webpack-bundle-analyzer)");
console.log("2. Use code splitting and dynamic imports");
console.log("3. Enable tree shaking with ES modules");
console.log("4. Use content hashing for cache busting");
console.log("5. Test production build before deploying");
console.log("6. Configure source maps appropriately");
console.log("7. Use environment variables for configuration");
console.log("8. Keep dependencies updated");
console.log("9. Use Vite for faster development experience");
console.log("10. Monitor build times and optimize");

console.log("\n❌ DON'T:");
console.log("1. Don't over-configure webpack");
console.log("2. Don't upload source maps to public servers");
console.log("3. Don't ignore bundle size warnings");
console.log("4. Don't skip production build testing");
console.log("5. Don't use CommonJS if tree shaking is needed");
console.log("6. Don't bundle unnecessary dependencies");
console.log("7. Don't ignore cache invalidation");
console.log("8. Don't forget to optimize images and assets");
console.log("9. Don't disable minification in production");
console.log("10. Don't use outdated build tools");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Bundle size creep");
console.log("2. Tree shaking compatibility");
console.log("3. Cache invalidation timing");
console.log("4. Development vs production differences");
console.log("5. Source map security");
console.log("6. Build tool deprecation");
console.log("7. Dependency compatibility");
console.log("8. Environment variable exposure");


// ============================================
// 7. Section 5: Additional Build Tooling
// ============================================

console.log("\n=== Section 5: Babel, PostCSS, and ESLint ===");

// Babel — JavaScript transpiler
console.log("\n📦 Babel — JavaScript Transpiler:");
console.log(`
// Babel converts modern JS (ES6+) to backwards-compatible versions
// Configuration: babel.config.js or .babelrc

// Key presets:
// @babel/preset-env — Automatically determines needed transforms
// @babel/preset-react — JSX transformation
// @babel/preset-typescript — Strip TypeScript types

// Key plugins:
// @babel/plugin-transform-runtime — Avoid polluting global scope
// @babel/plugin-proposal-decorators — Decorator support (Stage 2.7)

// Example babel.config.js:
// module.exports = {
//   presets: [
//     ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
//     '@babel/preset-typescript'
//   ],
//   plugins: ['@babel/plugin-transform-runtime']
// };

// Babel vs TypeScript compiler:
// - Babel: transpile only (no type checking), faster, more plugins
// - tsc: transpile + type check, slower but more thorough
// - Common pattern: Babel for transpilation, tsc --noEmit for type checking
`);

// PostCSS — CSS transformation
console.log("\n📦 PostCSS — CSS Transformation Pipeline:");
console.log(`
// PostCSS processes CSS with plugins (similar to Babel for JS)

// Key plugins:
// autoprefixer — Add vendor prefixes automatically
// cssnano — CSS minification
// postcss-preset-env — Future CSS features today
// postcss-import — Inline @import rules
// tailwindcss — Utility-first CSS framework (built on PostCSS)

// Example postcss.config.js:
// module.exports = {
//   plugins: [
//     require('tailwindcss'),
//     require('autoprefixer'),
//     require('cssnano')({ preset: 'default' })
//   ]
// };

// Integration with build tools:
// - Vite: Built-in PostCSS support (postcss.config.js auto-detected)
// - Webpack: postcss-loader in module.rules
// - Lightning CSS: Faster Rust-based alternative (used in Vite 7+)
`);

// ESLint — Static analysis and code quality
console.log("\n📦 ESLint — JavaScript/TypeScript Linting:");
console.log(`
// ESLint catches errors and enforces code style before runtime

// Key configurations:
// eslint:recommended — Built-in recommended rules
// @typescript-eslint/recommended — TypeScript-specific rules
// eslint-config-prettier — Disable rules conflicting with Prettier

// Example .eslintrc.json:
// {
//   "extends": [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "prettier"
//   ],
//   "parser": "@typescript-eslint/parser",
//   "plugins": ["@typescript-eslint"],
//   "rules": {
//     "no-console": "warn",
//     "@typescript-eslint/no-unused-vars": "error"
//   }
// }

// Integration:
// - Vite: vite-plugin-eslint
// - Webpack: eslint-webpack-plugin
// - CI/CD: Run eslint in pipeline before build
// - Pre-commit: lint-staged + husky for staged files only

// Prettier — Code formatter (complement to ESLint):
// - Formats code consistently (quotes, semicolons, indentation)
// - .prettierrc: { "singleQuote": true, "semi": true, "tabWidth": 2 }
// - Use eslint-config-prettier to avoid conflicts
`);


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. WEBPACK CONFIGURATION
   TS:  webpack.config.ts with typed configuration
   TS:  import { Configuration } from 'webpack';
   TS:  const config: Configuration = { ... };

2. VITE CONFIGURATION
   TS:  vite.config.ts with defineConfig
   TS:  import { defineConfig, UserConfig } from 'vite';
   TS:  Type-safe plugin configuration

3. CODE SPLITTING
   TS:  Type-safe dynamic imports
   TS:  const module: typeof import('./module') = await import('./module');
   TS:  React.lazy with component types

4. BUILD SCRIPTS
   TS:  Type-safe build scripts with ts-node
   TS:  import type { BuildOptions } from 'vite';
   TS:  Typed environment variables

5. PLUGIN DEVELOPMENT
   TS:  Type-safe plugin APIs
   TS:  import { Plugin } from 'webpack';
   TS:  Typed plugin hooks

⚠️ BUILD TOOL COMPARISON:
┌──────────────┬─────────────┬─────────────┬──────────────┐
│ Feature      │ Webpack     │ Vite 5/7    │ Vite 8       │
├──────────────┼─────────────┼─────────────┼──────────────┤
│ Dev Server   │ Slower      │ Fast (ESM)  │ Fast (ESM)   │
│ HMR          │ Good        │ Instant     │ Instant      │
│ Build Speed  │ Slower      │ Fast        │ 10-30x faster│
│ Config       │ Complex     │ Simple      │ Simple       │
│ Ecosystem    │ Mature      │ Growing     │ Growing      │
│ Bundle Size  │ Larger      │ Smaller     │ Smaller      │
│ Bundler      │ Webpack     │ Rollup      │ Rolldown(Rust)│
└──────────────┴─────────────┴─────────────┴──────────────┘

🔧 BEST PRACTICES:
- Use code splitting for large apps
- Enable tree shaking
- Optimize images and assets
- Use content hashing for caching
- Analyze bundle size regularly
- Minimize dependencies
- Use production mode for builds
- Enable source maps for debugging

📘 See related:
- 32-modules.js (ES Modules)
- 46-performance.js (Performance optimization)
- 39-es2022-plus-features.js (Dynamic imports)
*/


// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 32-modules.js - ES Modules");
console.log("📘 47-typescript-advanced.js - TypeScript tooling");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 49-build-tools-ts-comparison.ts
*/
