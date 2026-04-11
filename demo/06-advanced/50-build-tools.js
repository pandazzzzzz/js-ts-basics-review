// Build Tools Integration Demo
// 📘 For TypeScript comparison, see: 50-build-tools-ts-comparison.ts
// 📘 Webpack: https://webpack.js.org/
// 📘 Vite: https://vitejs.dev/
// 📌 Covers webpack, vite, code splitting, and production optimization

// ============================================
// Section 1: Webpack Configuration
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
// Section 2: Vite Configuration
// ============================================

console.log("\n=== Vite Configuration ===");

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
// Section 3: Code Splitting
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
// Section 4: Production Optimization
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
// Common Pitfalls
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
// Best Practices
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
┌──────────────┬─────────────┬─────────────┐
│ Feature      │ Webpack     │ Vite        │
├──────────────┼─────────────┼─────────────┤
│ Dev Server   │ Slower      │ Fast (ESM)  │
│ HMR          │ Good        │ Instant     │
│ Build Speed  │ Slower      │ Fast        │
│ Config       │ Complex     │ Simple      │
│ Ecosystem    │ Mature      │ Growing     │
│ Bundle Size  │ Larger      │ Smaller     │
└──────────────┴─────────────┴─────────────┘

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
- 27-modules.js (ES Modules)
- 42-performance.js (Performance optimization)
- 33-es2022-plus-features.js (Dynamic imports)
*/
