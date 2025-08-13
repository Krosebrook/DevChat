import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class TauriGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateTauriConfig(config));
    files.push(this.generateMainRustFile(config));
    files.push(this.generateCargoToml(config));
    files.push(this.generateFrontendFiles(config));

    const packageJson = this.generateTauriPackageJson(config);
    const readme = this.generateReadme(config);

    return { files, packageJson, readme };
  }

  private generateTauriConfig(config: any): GeneratedFile {
    return {
      path: 'src-tauri/tauri.conf.json',
      content: JSON.stringify({
        build: {
          beforeDevCommand: 'npm run dev',
          beforeBuildCommand: 'npm run build',
          devPath: 'http://localhost:1420',
          distDir: '../dist',
          withGlobalTauri: false
        },
        package: {
          productName: config.name,
          version: '0.0.0'
        },
        tauri: {
          allowlist: {
            all: false,
            shell: {
              all: false,
              open: true
            }
          },
          bundle: {
            active: true,
            targets: 'all',
            identifier: `com.${config.name.toLowerCase().replace(/\s+/g, '')}.app`,
            icon: [
              'icons/32x32.png',
              'icons/128x128.png',
              'icons/128x128@2x.png',
              'icons/icon.icns',
              'icons/icon.ico'
            ]
          },
          security: {
            csp: null
          },
          windows: [
            {
              fullscreen: false,
              resizable: true,
              title: config.name,
              width: 800,
              height: 600
            }
          ]
        }
      }, null, 2),
      type: 'file'
    };
  }

  private generateMainRustFile(config: any): GeneratedFile {
    return {
      path: 'src-tauri/src/main.rs',
      content: `// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`,
      type: 'file'
    };
  }

  private generateCargoToml(config: any): GeneratedFile {
    return {
      path: 'src-tauri/Cargo.toml',
      content: `[package]
name = "${config.name.toLowerCase().replace(/\s+/g, '-')}"
version = "0.0.0"
description = "${config.description}"
authors = ["you"]
license = ""
repository = ""
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[build-dependencies]
tauri-build = { version = "1.0", features = [] }

[dependencies]
tauri = { version = "1.0", features = ["shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[features]
# by default Tauri runs in production mode
# when \`tauri dev\` runs it is executed with \`cargo run --no-default-features\` if \`devPath\` is an URL
default = ["custom-protocol"]
# this feature is used used for production builds where \`devPath\` points to the filesystem
# DO NOT remove this
custom-protocol = ["tauri/custom-protocol"]`,
      type: 'file'
    };
  }

  private generateFrontendFiles(config: any): GeneratedFile {
    return {
      path: 'src/main.ts',
      content: `document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
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
});`,
      type: 'file'
    };
  }

  private generateTauriPackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.scripts = {
      dev: 'tauri dev',
      build: 'tauri build',
      'tauri:dev': 'tauri dev',
      'tauri:build': 'tauri build',
    };

    base.dependencies = {
      '@tauri-apps/api': '^1.5.0',
    };

    base.devDependencies = {
      '@tauri-apps/cli': '^1.5.0',
      typescript: '^5.0.2',
      vite: '^4.4.5',
    };

    return base;
  }
}