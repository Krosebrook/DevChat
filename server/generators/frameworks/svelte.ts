import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class SvelteGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateAppFile(config));
    files.push(this.generateMainFile(config));
    files.push(this.generateIndexHtml(config));
    files.push(this.generateViteConfig(config));

    const packageJson = this.generateSveltePackageJson(config);
    const readme = this.generateReadme(config);

    return { files, packageJson, readme };
  }

  private generateAppFile(config: any): GeneratedFile {
    return {
      path: 'src/App.svelte',
      content: `<script lang="ts">
  export let name = '${config.name}';
  const features = ${JSON.stringify(config.features)};
</script>

<main>
  <h1>{name}</h1>
  <p>${config.description}</p>
  <div class="features">
    <h2>Features Included:</h2>
    <ul>
      {#each features as feature}
        <li>{feature}</li>
      {/each}
    </ul>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .features {
    margin-top: 2rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem;
    margin: 0.5rem 0;
    background: #f0f0f0;
    border-radius: 4px;
  }
</style>`,
      type: 'file'
    };
  }

  private generateMainFile(config: any): GeneratedFile {
    return {
      path: 'src/main.ts',
      content: `import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app`,
      type: 'file'
    };
  }

  private generateIndexHtml(config: any): GeneratedFile {
    return {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
      type: 'file'
    };
  }

  private generateViteConfig(config: any): GeneratedFile {
    return {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})`,
      type: 'file'
    };
  }

  private generateSveltePackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.scripts = {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      check: 'svelte-check --tsconfig ./tsconfig.json',
    };

    base.dependencies = {
      svelte: '^4.0.5',
    };

    base.devDependencies = {
      '@sveltejs/vite-plugin-svelte': '^2.4.2',
      '@tsconfig/svelte': '^5.0.0',
      'svelte-check': '^3.4.3',
      typescript: '^5.0.2',
      vite: '^4.4.5',
    };

    return base;
  }
}