# Room Finder Project

A modern room listing and search application with a clean, organized codebase.

## Project Structure

```
room/
├── backend/               # Backend API server
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
│
├── public/               # Static public files
│
├── src/                  # Frontend source code
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   │   ├── cards/        # Card components
│   │   ├── forms/        # Form components
│   │   └── ui/           # Basic UI elements
│   ├── config/           # Configuration files
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
│
├── archived/             # Archived/removed files
```

## Development Scripts

The project includes several utility scripts to help with development and maintenance:

### Server Management

- **restart_server.bat** - Interactive menu to start frontend/backend servers

### Code Maintenance

- **cleanup.js** - Removes console logs and unnecessary comments
- **cleanup-empty.js** - Identifies empty files and directories
- **delete-empty-files.js** - Deletes specified empty files
- **find_duplicates.js** - Detects duplicate or similar code
- **fix_imports.js** - Standardizes import statements
- **organize_folders.js** - Organizes project file structure
- **force_rebuild.js** - Clears caches and rebuilds the project
- **force_refresh.js** - Refreshes development environment

To run any of these scripts:

```
node script-name.js
```

## Organization Scripts

- `organize-ui.js`: Sets up the UI component folder structure

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
