// TypeScript vs JavaScript: Build Tools Comparison
// 📘 For JavaScript examples, see: 49-build-tools.js
// This file demonstrates TypeScript-specific type features for build tools

export {}; // Make this file a module

// ============================================
// Section 1: Webpack Configuration - Typed
// ============================================

console.log("=== Webpack Configuration - Typed ===\n");

// Type-safe webpack config
console.log(`
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const config: Configuration = {
  entry: './src/index.ts',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

export default config;
`);

// Type-safe environment config
interface BuildEnvironment {
  mode: 'development' | 'production';
  apiUrl: string;
  enableSourceMaps: boolean;
}

function createWebpackConfig(env: BuildEnvironment) {
  console.log("Creating config for:", env.mode);
  return {
    mode: env.mode,
    devtool: env.enableSourceMaps ? 'source-map' : false
  };
}

console.log("Type-safe webpack configuration");

// ============================================
// Section 2: Vite Configuration - Typed
// ============================================

console.log("\n=== Vite Configuration - Typed ===\n");

// Type-safe vite config
console.log(`
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }): UserConfig => {
  return {
    plugins: [react()],
    
    server: {
      port: 3000,
      strictPort: true
    },
    
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components'
      }
    }
  };
});
`);

// Type-safe environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Usage
const apiUrl: string = import.meta.env.VITE_API_URL;
const appTitle: string = import.meta.env.VITE_APP_TITLE;

console.log("Type-safe environment variables");

// ============================================
// Section 3: Code Splitting - Type-Safe Imports
// ============================================

console.log("\n=== Code Splitting - Type-Safe Imports ===\n");

// Type-safe dynamic imports
type ModuleType = typeof import('./module');

async function loadModule(): Promise<ModuleType> {
  const module = await import('./module');
  return module;
}

// Type-safe lazy loading with React
console.log(`
import { lazy, ComponentType, LazyExoticComponent } from 'react';

interface DashboardProps {
  userId: string;
}

const Dashboard: LazyExoticComponent<ComponentType<DashboardProps>> = 
  lazy(() => import('./Dashboard'));

// Usage with type safety
<Suspense fallback={<Loading />}>
  <Dashboard userId="123" />
</Suspense>
`);

// Generic lazy loader
class TypedLazyLoader<T> {
  private module: T | null = null;
  private loading: Promise<T> | null = null;

  constructor(private importFn: () => Promise<{ default: T }>) {}

  async load(): Promise<T> {
    if (this.module) {
      return this.module;
    }

    if (this.loading) {
      return this.loading.then(() => this.module!);
    }

    this.loading = this.importFn().then(m => {
      this.module = m.default;
      return this.module;
    });

    return this.loading;
  }
}

console.log("Type-safe code splitting");

// ============================================
// Section 4: Build Scripts - Type Safety
// ============================================

console.log("\n=== Build Scripts - Type Safety ===\n");

// Type-safe build configuration
interface BuildConfig {
  mode: 'development' | 'production' | 'test';
  sourceMaps: boolean;
  minify: boolean;
  analyze: boolean;
}

class BuildManager {
  constructor(private config: BuildConfig) {}

  async build(): Promise<void> {
    console.log(`Building in ${this.config.mode} mode`);
    
    if (this.config.minify) {
      await this.minify();
    }
    
    if (this.config.analyze) {
      await this.analyze();
    }
  }

  private async minify(): Promise<void> {
    console.log("Minifying code...");
  }

  private async analyze(): Promise<void> {
    console.log("Analyzing bundle...");
  }
}

// Type-safe CLI arguments
interface CLIArgs {
  mode?: 'development' | 'production';
  watch?: boolean;
  port?: number;
}

function parseCLIArgs(args: string[]): CLIArgs {
  const parsed: CLIArgs = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && args[i + 1]) {
      parsed.mode = args[i + 1] as 'development' | 'production';
    }
    if (args[i] === '--watch') {
      parsed.watch = true;
    }
    if (args[i] === '--port' && args[i + 1]) {
      parsed.port = parseInt(args[i + 1], 10);
    }
  }
  
  return parsed;
}

console.log("Type-safe build scripts");

// ============================================
// Section 5: Plugin Development - Typed
// ============================================

console.log("\n=== Plugin Development - Typed ===\n");

// Type-safe Vite plugin
console.log(`
import { Plugin } from 'vite';

interface MyPluginOptions {
  include?: string[];
  exclude?: string[];
}

function myPlugin(options: MyPluginOptions = {}): Plugin {
  return {
    name: 'my-plugin',
    
    configResolved(config) {
      console.log('Config resolved:', config.mode);
    },
    
    transform(code: string, id: string) {
      if (options.include?.some(pattern => id.includes(pattern))) {
        return {
          code: transformCode(code),
          map: null
        };
      }
    }
  };
}

function transformCode(code: string): string {
  return code.replace(/console\\.log/g, '// console.log');
}

export default myPlugin;
`);

// Type-safe Webpack plugin
console.log(`
import { Compiler, WebpackPluginInstance } from 'webpack';

interface MyWebpackPluginOptions {
  enabled: boolean;
}

class MyWebpackPlugin implements WebpackPluginInstance {
  constructor(private options: MyWebpackPluginOptions) {}

  apply(compiler: Compiler): void {
    compiler.hooks.emit.tapAsync(
      'MyWebpackPlugin',
      (compilation, callback) => {
        if (this.options.enabled) {
          console.log('Processing assets...');
        }
        callback();
      }
    );
  }
}

export default MyWebpackPlugin;
`);

console.log("Type-safe plugin development");

// ============================================
// Section 6: Bundle Analysis - Typed
// ============================================

console.log("\n=== Bundle Analysis - Typed ===\n");

// Type-safe bundle stats
interface BundleStats {
  totalSize: number;
  chunks: ChunkInfo[];
  assets: AssetInfo[];
}

interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
}

interface AssetInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
}

class BundleAnalyzer {
  analyze(stats: BundleStats): void {
    console.log(`Total bundle size: ${this.formatSize(stats.totalSize)}`);
    
    const largeChunks = stats.chunks
      .filter(chunk => chunk.size > 100000)
      .sort((a, b) => b.size - a.size);
    
    console.log("Large chunks:");
    largeChunks.forEach(chunk => {
      console.log(`  ${chunk.name}: ${this.formatSize(chunk.size)}`);
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

console.log("Type-safe bundle analysis");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use typed configuration files");
console.log("2. Type environment variables");
console.log("3. Type dynamic imports");
console.log("4. Use typed plugin APIs");
console.log("5. Type build scripts and CLI args");

console.log("\n❌ DON'T:");
console.log("1. Don't use any in build configs");
console.log("2. Don't skip typing environment variables");
console.log("3. Don't ignore plugin type definitions");
console.log("4. Don't use untyped dynamic imports");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - Build Tools                             │
├─────────────────────────────────────────────────────────────────────┤
│ Webpack Config:                                                     │
│   JavaScript: Plain object configuration                            │
│   TypeScript: Configuration interface with type checking            │
│                                                                      │
│ Vite Config:                                                        │
│   JavaScript: defineConfig with JSDoc                               │
│   TypeScript: UserConfig type with full IntelliSense                │
│                                                                      │
│ Environment Variables:                                              │
│   JavaScript: process.env.VAR (untyped)                             │
│   TypeScript: Typed ImportMetaEnv interface                         │
│                                                                      │
│ Code Splitting:                                                     │
│   JavaScript: Dynamic imports return any                            │
│   TypeScript: Type-safe imports with module types                   │
│                                                                      │
│ Plugin Development:                                                 │
│   JavaScript: Untyped plugin hooks                                  │
│   TypeScript: Plugin interface with typed hooks                     │
└─────────────────────────────────────────────────────────────────────┘
`);
