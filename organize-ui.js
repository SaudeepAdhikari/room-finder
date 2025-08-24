// Setup UI Components
// This script organizes UI components and structure
// For Room Finder App

const fs = require('fs');
const path = require('path');

// Function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Define the UI component organization structure
const uiComponentsStructure = {
  'src/components/ui/buttons': [
    'PrimaryButton',
    'SecondaryButton',
    'IconButton',
    'OutlineButton'
  ],
  'src/components/ui/inputs': [
    'TextInput',
    'SearchInput',
    'Checkbox',
    'RadioButton',
    'Select',
    'DatePicker'
  ],
  'src/components/ui/layout': [
    'Container',
    'Grid',
    'Flex',
    'Box'
  ],
  'src/components/ui/navigation': [
    'ModernNavbar',
    'TabBar',
    'MenuBar',
    'Breadcrumbs'
  ],
  'src/components/ui/feedback': [
    'Toast',
    'Alert',
    'Modal',
    'Spinner'
  ],
  'src/components/ui/cards': [
    'RoomCard',
    'PropertyCard',
    'InfoCard'
  ]
};

// Create the UI component directory structure
Object.keys(uiComponentsStructure).forEach(dir => {
  ensureDirectoryExists(dir);
});

// Create a UI component index file
Object.keys(uiComponentsStructure).forEach(dir => {
  const components = uiComponentsStructure[dir];
  const indexContent = `// Auto-generated index file for ${path.basename(dir)} components
${components.map(comp => `import ${comp} from './${comp}';`).join('\n')}

export {
  ${components.join(',\n  ')}
};
`;
  
  fs.writeFileSync(path.join(dir, 'index.js'), indexContent);
});

// Create the main UI components index file
const mainIndexContent = `// Main UI components export file
${Object.keys(uiComponentsStructure).map(dir => {
  const folderName = path.basename(dir);
  return `import * as ${folderName} from './${folderName}';`;
}).join('\n')}

export {
  ${Object.keys(uiComponentsStructure).map(dir => path.basename(dir)).join(',\n  ')}
};
`;

ensureDirectoryExists('src/components/ui');
fs.writeFileSync(path.join('src/components/ui', 'index.js'), mainIndexContent);