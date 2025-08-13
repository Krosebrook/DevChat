import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class NextJSGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateAppFile(config));
    files.push(this.generateLayoutFile(config));
    files.push(this.generatePageFile(config));
    files.push(this.generateNextConfig(config));
    
    if (config.features.includes('api')) {
      files.push(...this.generateApiRoutes(config));
    }

    const packageJson = this.generateNextPackageJson(config);
    const readme = this.generateReadme(config);

    return { files, packageJson, readme };
  }

  private generateAppFile(config: any): GeneratedFile {
    return {
      path: 'app/layout.tsx',
      content: `import './globals.css'

export const metadata = {
  title: '${config.name}',
  description: '${config.description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      type: 'file'
    };
  }

  private generateLayoutFile(config: any): GeneratedFile {
    return {
      path: 'app/globals.css',
      content: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`,
      type: 'file'
    };
  }

  private generatePageFile(config: any): GeneratedFile {
    return {
      path: 'app/page.tsx',
      content: `export default function Home() {
  return (
    <div className="container">
      <h1>${config.name}</h1>
      <p>${config.description}</p>
      <div>
        <h2>Features Included:</h2>
        <ul>
          ${config.features.map((f: string) => `<li>${f}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  )
}`,
      type: 'file'
    };
  }

  private generateNextConfig(config: any): GeneratedFile {
    return {
      path: 'next.config.js',
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,
      type: 'file'
    };
  }

  private generateApiRoutes(config: any): GeneratedFile[] {
    return [{
      path: 'app/api/hello/route.ts',
      content: `export async function GET() {
  return Response.json({ message: 'Hello from ${config.name}!' })
}`,
      type: 'file'
    }];
  }

  private generateNextPackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.scripts = {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    };

    base.dependencies = {
      next: '14.0.0',
      react: '^18',
      'react-dom': '^18',
    };

    base.devDependencies = {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      eslint: '^8',
      'eslint-config-next': '14.0.0',
      typescript: '^5',
    };

    return base;
  }
}