import { GeneratedFile } from './generators/index';

export interface CodeQualityConfig {
  enableESLint: boolean;
  enablePrettier: boolean;
  enableTypeScriptStrict: boolean;
  enableTesting: boolean;
  testFramework: 'jest' | 'vitest' | 'cypress';
  customRules?: Record<string, any>;
}

export class CodeQualityEnhancer {
  /**
   * Add ESLint configuration to generated project
   */
  generateESLintConfig(framework: string, features: string[]): GeneratedFile {
    const baseConfig = {
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: [
        'eslint:recommended',
        ...(framework === 'react' ? ['plugin:react/recommended', 'plugin:react-hooks/recommended'] : []),
        ...(framework === 'nextjs' ? ['next/core-web-vitals'] : []),
        ...(features.includes('typescript') ? ['@typescript-eslint/recommended'] : [])
      ],
      parser: features.includes('typescript') ? '@typescript-eslint/parser' : 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ...(framework === 'react' ? { ecmaFeatures: { jsx: true } } : {})
      },
      plugins: [
        ...(framework === 'react' ? ['react', 'react-hooks'] : []),
        ...(features.includes('typescript') ? ['@typescript-eslint'] : [])
      ],
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',
        ...(framework === 'react' ? {
          'react/prop-types': 'off',
          'react/react-in-jsx-scope': 'off',
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn'
        } : {}),
        ...(features.includes('typescript') ? {
          '@typescript-eslint/no-unused-vars': 'warn',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off'
        } : {})
      },
      settings: {
        ...(framework === 'react' ? { react: { version: 'detect' } } : {})
      }
    };

    return {
      path: '.eslintrc.json',
      content: JSON.stringify(baseConfig, null, 2),
      type: 'file'
    };
  }

  /**
   * Add Prettier configuration
   */
  generatePrettierConfig(): GeneratedFile[] {
    const prettierrc = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      bracketSpacing: true,
      arrowParens: 'avoid'
    };

    const prettierignore = `# Dependencies
node_modules/

# Production builds
dist/
build/
.next/

# Environment files
.env*

# Logs
*.log

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml
`;

    return [
      {
        path: '.prettierrc.json',
        content: JSON.stringify(prettierrc, null, 2),
        type: 'file'
      },
      {
        path: '.prettierignore',
        content: prettierignore,
        type: 'file'
      }
    ];
  }

  /**
   * Generate TypeScript strict configuration
   */
  generateTSConfigStrict(framework: string): GeneratedFile {
    const baseConfig = {
      compilerOptions: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'ES2020'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: framework === 'react' ? 'react-jsx' : undefined,
        
        // Strict mode options
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        exactOptionalPropertyTypes: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        
        // Additional quality checks
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        
        // Path mapping
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.js',
        'src/**/*.jsx'
      ],
      exclude: [
        'node_modules',
        'dist',
        'build'
      ]
    };

    return {
      path: 'tsconfig.json',
      content: JSON.stringify(baseConfig, null, 2),
      type: 'file'
    };
  }

  /**
   * Generate testing setup files
   */
  generateTestingSetup(framework: string, testFramework: 'jest' | 'vitest' | 'cypress'): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    if (testFramework === 'vitest') {
      // Vitest configuration
      const vitestConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'
${framework === 'react' ? "import react from '@vitejs/plugin-react'" : ''}

export default defineConfig({
  plugins: [${framework === 'react' ? 'react()' : ''}],
  test: {
    globals: true,
    environment: '${framework === 'react' ? 'jsdom' : 'node'}',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  }
})`;

      files.push({
        path: 'vitest.config.ts',
        content: vitestConfig,
        type: 'file'
      });

      // Test setup file
      const setupContent = framework === 'react' ? 
        `import '@testing-library/jest-dom'` : 
        `// Test setup file`;

      files.push({
        path: 'src/test/setup.ts',
        content: setupContent,
        type: 'file'
      });

      // Sample test file
      if (framework === 'react') {
        const sampleTest = `import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/universal app generator/i)).toBeInTheDocument()
  })
})`;

        files.push({
          path: 'src/App.test.tsx',
          content: sampleTest,
          type: 'file'
        });
      }
    }

    return files;
  }

  /**
   * Generate package.json scripts for code quality
   */
  generateQualityScripts(config: CodeQualityConfig): Record<string, string> {
    const scripts: Record<string, string> = {};

    if (config.enableESLint) {
      scripts.lint = 'eslint . --ext .ts,.tsx,.js,.jsx';
      scripts['lint:fix'] = 'eslint . --ext .ts,.tsx,.js,.jsx --fix';
    }

    if (config.enablePrettier) {
      scripts.format = 'prettier --write .';
      scripts['format:check'] = 'prettier --check .';
    }

    if (config.enableTesting) {
      if (config.testFramework === 'vitest') {
        scripts.test = 'vitest';
        scripts['test:run'] = 'vitest run';
        scripts['test:coverage'] = 'vitest run --coverage';
      }
    }

    scripts['quality:check'] = 'npm run lint && npm run format:check && npm run test:run';

    return scripts;
  }

  /**
   * Get dependencies for code quality tools
   */
  getQualityDependencies(framework: string, config: CodeQualityConfig): Record<string, string> {
    const devDeps: Record<string, string> = {};

    if (config.enableESLint) {
      devDeps.eslint = '^8.57.0';
      
      if (framework === 'react') {
        devDeps['eslint-plugin-react'] = '^7.34.0';
        devDeps['eslint-plugin-react-hooks'] = '^4.6.0';
      }
      
      if (config.enableTypeScriptStrict) {
        devDeps['@typescript-eslint/eslint-plugin'] = '^6.21.0';
        devDeps['@typescript-eslint/parser'] = '^6.21.0';
      }
    }

    if (config.enablePrettier) {
      devDeps.prettier = '^3.2.5';
      if (config.enableESLint) {
        devDeps['eslint-config-prettier'] = '^9.1.0';
      }
    }

    if (config.enableTesting && config.testFramework === 'vitest') {
      devDeps.vitest = '^1.4.0';
      devDeps['@vitest/coverage-v8'] = '^1.4.0';
      
      if (framework === 'react') {
        devDeps['@testing-library/react'] = '^14.2.1';
        devDeps['@testing-library/jest-dom'] = '^6.4.2';
        devDeps.jsdom = '^24.0.0';
      }
    }

    return devDeps;
  }

  /**
   * Apply code quality enhancements to generated files
   */
  enhanceGeneratedFiles(files: GeneratedFile[], framework: string, features: string[]): GeneratedFile[] {
    const config: CodeQualityConfig = {
      enableESLint: true,
      enablePrettier: true,
      enableTypeScriptStrict: features.includes('typescript'),
      enableTesting: true,
      testFramework: 'vitest'
    };

    const enhancedFiles = [...files];

    // Add ESLint config
    if (config.enableESLint) {
      enhancedFiles.push(this.generateESLintConfig(framework, features));
    }

    // Add Prettier config
    if (config.enablePrettier) {
      enhancedFiles.push(...this.generatePrettierConfig());
    }

    // Add TypeScript strict config
    if (config.enableTypeScriptStrict) {
      enhancedFiles.push(this.generateTSConfigStrict(framework));
    }

    // Add testing setup
    if (config.enableTesting) {
      enhancedFiles.push(...this.generateTestingSetup(framework, config.testFramework));
    }

    // Update package.json with quality scripts and dependencies
    const packageJsonFile = enhancedFiles.find(f => f.path === 'package.json');
    if (packageJsonFile) {
      const packageJson = JSON.parse(packageJsonFile.content);
      
      // Add quality scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        ...this.generateQualityScripts(config)
      };

      // Add quality dependencies
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...this.getQualityDependencies(framework, config)
      };

      packageJsonFile.content = JSON.stringify(packageJson, null, 2);
    }

    return enhancedFiles;
  }
}