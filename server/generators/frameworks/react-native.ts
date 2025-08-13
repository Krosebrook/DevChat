import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class ReactNativeGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateAppFile(config));
    files.push(this.generateIndexFile(config));
    files.push(this.generateMetroConfig(config));

    const packageJson = this.generateRNPackageJson(config);
    const readme = this.generateReadme(config);

    return { files, packageJson, readme };
  }

  private generateAppFile(config: any): GeneratedFile {
    return {
      path: 'App.tsx',
      content: `import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const features = ${JSON.stringify(config.features)};

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.content}>
          <Text style={styles.title}>${config.name}</Text>
          <Text style={styles.description}>${config.description}</Text>
          <Text style={styles.subtitle}>Features Included:</Text>
          {features.map((feature: string, index: number) => (
            <Text key={index} style={styles.feature}>• {feature}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default App;`,
      type: 'file'
    };
  }

  private generateIndexFile(config: any): GeneratedFile {
    return {
      path: 'index.js',
      content: `import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);`,
      type: 'file'
    };
  }

  private generateMetroConfig(config: any): GeneratedFile {
    return {
      path: 'metro.config.js',
      content: `const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);`,
      type: 'file'
    };
  }

  private generateRNPackageJson(config: any): any {
    const base = this.generatePackageJson(config);
    
    base.scripts = {
      android: 'react-native run-android',
      ios: 'react-native run-ios',
      lint: 'eslint .',
      start: 'react-native start',
      test: 'jest',
    };

    base.dependencies = {
      react: '18.2.0',
      'react-native': '0.72.6',
    };

    base.devDependencies = {
      '@babel/core': '^7.20.0',
      '@babel/preset-env': '^7.20.0',
      '@babel/runtime': '^7.20.0',
      '@react-native/eslint-config': '0.72.2',
      '@react-native/metro-config': '0.72.11',
      '@react-native/typescript-config': '0.72.1',
      '@types/react': '^18.0.24',
      '@types/react-test-renderer': '^18.0.0',
      'babel-jest': '^29.2.1',
      eslint: '^8.19.0',
      jest: '^29.2.1',
      'metro-react-native-babel-preset': '0.76.8',
      prettier: '^2.4.1',
      'react-test-renderer': '18.2.0',
      typescript: '4.8.4',
    };

    return base;
  }
}