#!/usr/bin/env node

/**
 * SajiloStay UI Component Library Setup Script
 * 
 * This script helps you quickly install and configure the UI component library
 * in your React project.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router-dom'
];

const COMPONENT_FILES = [
  'design-system.css',
  'Button.js',
  'Button.css',
  'Input.js', 
  'Input.css',
  'Card.js',
  'Card.css',
  'Modal.js',
  'Modal.css',
  'Badge.js',
  'Badge.css',
  'Navbar.js',
  'Navbar.css',
  'UIShowcase.js',
  'UIShowcase.css',
  'index.js',
  'README.md'
];

function checkDependencies() {
  console.log('🔍 Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missing = REQUIRED_DEPENDENCIES.filter(dep => !dependencies[dep]);
    
    if (missing.length > 0) {
      console.log('❌ Missing dependencies:');
      missing.forEach(dep => console.log(`   - ${dep}`));
      console.log('\nInstall them with:');
      console.log(`npm install ${missing.join(' ')}`);
      return false;
    }
    
    console.log('✅ All dependencies are installed');
    return true;
  } catch (error) {
    console.log('❌ Could not read package.json');
    return false;
  }
}

function createDirectoryStructure() {
  console.log('📁 Creating directory structure...');
  
  const dirs = [
    'src/components',
    'src/components/ui'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ Created ${dir}`);
    } else {
      console.log(`   📁 ${dir} already exists`);
    }
  });
}

function copyComponentFiles(sourceDir = './src/components/ui') {
  console.log('📋 Copying component files...');
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Source directory ${sourceDir} not found`);
    console.log('Make sure you\'re running this script from the correct location');
    return false;
  }
  
  const targetDir = 'src/components/ui';
  
  COMPONENT_FILES.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`   ✅ Copied ${file}`);
    } else {
      console.log(`   ⚠️  ${file} not found in source`);
    }
  });
  
  return true;
}

function updateMainCSS() {
  console.log('🎨 Updating main CSS...');
  
  const mainCSSPaths = [
    'src/index.css',
    'src/App.css',
    'src/styles/main.css'
  ];
  
  const importStatement = `@import './components/ui/design-system.css';\n`;
  
  let updated = false;
  
  for (const cssPath of mainCSSPaths) {
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, 'utf8');
      
      if (!content.includes('design-system.css')) {
        fs.writeFileSync(cssPath, importStatement + content);
        console.log(`   ✅ Added import to ${cssPath}`);
        updated = true;
        break;
      } else {
        console.log(`   📝 ${cssPath} already includes design-system.css`);
        updated = true;
        break;
      }
    }
  }
  
  if (!updated) {
    console.log('   ⚠️  No main CSS file found. Please manually import:');
    console.log(`   @import './components/ui/design-system.css';`);
  }
}

function createExampleUsage() {
  console.log('📝 Creating example usage...');
  
  const exampleContent = `import React from 'react';
import { Button, Card, CardHeader, CardContent, CardFooter, Input } from './components/ui';

function ExampleComponent() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-xl font-bold">Welcome to SajiloStay UI</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Beautiful, modern components for your travel platform.
          </p>
          <Input 
            label="Your Name"
            placeholder="Enter your name..."
            className="mb-4"
          />
        </CardContent>
        <CardFooter>
          <Button variant="primary" fullWidth>
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ExampleComponent;
`;
  
  fs.writeFileSync('src/ExampleComponent.js', exampleContent);
  console.log('   ✅ Created src/ExampleComponent.js');
}

function addShowcaseRoute() {
  console.log('🔗 Adding showcase route...');
  
  const routeCode = `
// Add this to your App.js routes:
import { UIShowcase } from './components/ui';

// In your router:
<Route path="/ui" element={<UIShowcase />} />
`;
  
  console.log('   📝 Add this route to your App.js:');
  console.log(routeCode);
}

function main() {
  console.log('🚀 SajiloStay UI Component Library Setup\n');
  
  // Check if we're in a React project
  if (!fs.existsSync('package.json')) {
    console.log('❌ No package.json found. Make sure you\'re in a React project directory.');
    process.exit(1);
  }
  
  // Run setup steps
  const steps = [
    checkDependencies,
    createDirectoryStructure,
    () => copyComponentFiles(),
    updateMainCSS,
    createExampleUsage,
    addShowcaseRoute
  ];
  
  for (const step of steps) {
    try {
      const result = step();
      if (result === false) {
        console.log('❌ Setup failed. Please check the errors above.');
        process.exit(1);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      process.exit(1);
    }
    console.log(''); // Add spacing
  }
  
  console.log('🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Visit /ui to see the component showcase');
  console.log('2. Check src/ExampleComponent.js for usage examples');
  console.log('3. Import components with: import { Button } from "./components/ui"');
  console.log('4. Read the documentation in src/components/ui/README.md');
  console.log('\nHappy coding! 🏠✨');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  createDirectoryStructure,
  copyComponentFiles,
  updateMainCSS,
  createExampleUsage
};
