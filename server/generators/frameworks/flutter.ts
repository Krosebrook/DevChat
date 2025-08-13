import { BaseGenerator, GenerationResult, GeneratedFile } from '../index';

export class FlutterGenerator extends BaseGenerator {
  async generate(config: any): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    
    files.push(this.generateMainFile(config));
    files.push(this.generatePubspecFile(config));
    files.push(this.generateAndroidManifest(config));

    const readme = this.generateReadme(config);

    return { files, readme };
  }

  private generateMainFile(config: any): GeneratedFile {
    return {
      path: 'lib/main.dart',
      content: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${config.name}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  final List<String> features = ${JSON.stringify(config.features).replace(/"/g, "'")};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${config.name}'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${config.name}',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 16),
            Text(
              '${config.description}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            SizedBox(height: 24),
            Text(
              'Features Included:',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: features.length,
                itemBuilder: (context, index) {
                  return Card(
                    child: ListTile(
                      leading: Icon(Icons.check_circle, color: Colors.green),
                      title: Text(features[index]),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
      type: 'file'
    };
  }

  private generatePubspecFile(config: any): GeneratedFile {
    return {
      path: 'pubspec.yaml',
      content: `name: ${config.name.toLowerCase().replace(/\s+/g, '_')}
description: ${config.description}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true`,
      type: 'file'
    };
  }

  private generateAndroidManifest(config: any): GeneratedFile {
    return {
      path: 'android/app/src/main/AndroidManifest.xml',
      content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="${config.name}"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>`,
      type: 'file'
    };
  }
}