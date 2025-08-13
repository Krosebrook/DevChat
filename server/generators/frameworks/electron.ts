import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class ElectronGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateMainFile(config));
    files.push(this.generateRendererFile(config));
    files.push(this.generateIndexHtml(config));
    files.push(this.generatePreloadFile(config));

    const packageJson = this.generateElectronPackageJson(config);
    const readme = this.generateReadme(config);

    return { files, packageJson, readme };
  }

  private generateMainFile(config: any): GeneratedFile {
    return {
      path: 'src/main.ts',
      content: `import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});`,
      type: 'file'
    };
  }

  private generateRendererFile(config: any): GeneratedFile {
    return {
      path: 'src/renderer.ts',
      content: `document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = \`
      <div class="container">
        <h1>${config.name}</h1>
        <p>${config.description}</p>
        <div class="features">
          <h2>Features Included:</h2>
          <ul>
            \${${JSON.stringify(config.features)}.map(f => \`<li>\${f}</li>\`).join('')}
          </ul>
        </div>
      </div>
    \`;
  }
});`,
      type: 'file'
    };
  }

  private generateIndexHtml(config: any): GeneratedFile {
    return {
      path: 'src/renderer/index.html',
      content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${config.name}</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .features ul {
        list-style: none;
        padding: 0;
      }
      .features li {
        padding: 0.5rem;
        margin: 0.5rem 0;
        background: #f0f0f0;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="../renderer.js"></script>
  </body>
</html>`,
      type: 'file'
    };
  }

  private generatePreloadFile(config: any): GeneratedFile {
    return {
      path: 'src/preload.ts',
      content: `import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Expose safe APIs here
});`,
      type: 'file'
    };
  }

  private generateElectronPackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.main = 'dist/main.js';
    base.scripts = {
      dev: 'concurrently "npm run build:watch" "npm run start:electron"',
      build: 'tsc',
      'build:watch': 'tsc --watch',
      'start:electron': 'wait-on dist/main.js && electron .',
      'build:prod': 'npm run build && electron-builder',
    };

    base.dependencies = {
      electron: '^27.0.0',
    };

    base.devDependencies = {
      '@types/node': '^20.0.0',
      'electron-builder': '^24.0.0',
      concurrently: '^8.0.0',
      'wait-on': '^7.0.0',
      typescript: '^5.0.2',
    };

    return base;
  }
}