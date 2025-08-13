import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class ReactGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    // Generate core React files
    files.push(this.generateAppFile(config));
    files.push(this.generateIndexFile(config));
    files.push(this.generateIndexHtml(config));
    files.push(this.generateViteConfig(config));
    
    // Generate feature-specific files
    if (config.features.includes('authentication')) {
      files.push(...this.generateAuthFiles(config));
    }
    
    if (config.features.includes('database')) {
      files.push(...this.generateDatabaseFiles(config));
    }
    
    if (config.features.includes('api')) {
      files.push(...this.generateApiFiles(config));
    }

    // Generate package.json
    const packageJson = this.generateReactPackageJson(config);
    const readme = this.generateReadme(config);

    return {
      files,
      packageJson,
      readme,
      deploymentConfig: this.generateDeploymentConfig(config)
    };
  }

  private generateAppFile(config: any): GeneratedFile {
    const hasAuth = config.features.includes('authentication');
    const hasApi = config.features.includes('api');
    
    const content = `import React from 'react';
import './App.css';
${hasAuth ? "import { AuthProvider } from './components/Auth/AuthProvider';" : ''}
${hasApi ? "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';" : ''}

${hasApi ? 'const queryClient = new QueryClient();' : ''}

function App() {
  return (
    ${hasApi ? '<QueryClientProvider client={queryClient}>' : ''}
    ${hasAuth ? '<AuthProvider>' : ''}
    <div className="App">
      <header className="App-header">
        <h1>${config.name}</h1>
        <p>${config.description}</p>
        <div className="features">
          <h2>Features Included:</h2>
          <ul>
            ${config.features.map((f: string) => `<li>${f}</li>`).join('\n            ')}
          </ul>
        </div>
      </header>
    </div>
    ${hasAuth ? '</AuthProvider>' : ''}
    ${hasApi ? '</QueryClientProvider>' : ''}
  );
}

export default App;`;

    return { path: 'src/App.tsx', content, type: 'file' };
  }

  private generateIndexFile(config: any): GeneratedFile {
    const content = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    return { path: 'src/main.tsx', content, type: 'file' };
  }

  private generateIndexHtml(config: any): GeneratedFile {
    const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
    <meta name="description" content="${config.description}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    return { path: 'index.html', content, type: 'file' };
  }

  private generateViteConfig(config: any): GeneratedFile {
    const content = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})`;

    return { path: 'vite.config.ts', content, type: 'file' };
  }

  private generateAuthFiles(config: any): GeneratedFile[] {
    const authProvider = `import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Implement actual login logic
      console.log('Login:', email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}`;

    return [
      { path: 'src/components/Auth/AuthProvider.tsx', content: authProvider, type: 'file' }
    ];
  }

  private generateDatabaseFiles(config: any): GeneratedFile[] {
    const dbConfig = `export const dbConfig = {
  // Configure your database connection
  connectionString: process.env.DATABASE_URL || 'sqlite:./database.db',
};`;

    return [
      { path: 'src/lib/database.ts', content: dbConfig, type: 'file' }
    ];
  }

  private generateApiFiles(config: any): GeneratedFile[] {
    const apiClient = `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ApiClient {
  async get(endpoint: string) {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();`;

    return [
      { path: 'src/lib/api.ts', content: apiClient, type: 'file' }
    ];
  }

  private generateReactPackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.scripts = {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
    };

    base.dependencies = {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    };

    base.devDependencies = {
      '@types/react': '^18.0.28',
      '@types/react-dom': '^18.0.11',
      '@vitejs/plugin-react': '^4.0.0',
      typescript: '^5.0.2',
      vite: '^4.4.5',
    };

    // Add feature-specific dependencies
    if (config.features.includes('api')) {
      base.dependencies['@tanstack/react-query'] = '^4.29.7';
    }

    return base;
  }

  private generateDeploymentConfig(config: any): any {
    return {
      vercel: {
        name: config.name,
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
      },
      netlify: {
        build: {
          command: 'npm run build',
          publish: 'dist',
        },
      },
    };
  }
}