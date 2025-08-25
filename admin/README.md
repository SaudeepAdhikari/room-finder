# Admin folder

This folder is reserved for admin-specific code, scripts, and a possible standalone admin app in the future.

Current status:

- Admin UI components remain inside `client/src/admin` to avoid breaking the site.
- Use this folder to add admin backend utilities or, in future, a separate admin React app.

Suggested next steps:

- If you want to split the admin UI into a separate app, move `client/src/admin` here and create a new React app with its own `package.json`.

## Standalone CRA admin app

To run the standalone admin app (CRA) for local development:

1. From the `admin` folder, install dependencies:

   - npm install

2. Build the admin library used by the main client app (this produces `dist/`):

   - npm run build:lib

3. Start the CRA dev server (use a different port than the main client, e.g. 3001):
   - On Windows Powershell: $env:PORT=3001; npm start

The CRA app imports the compiled `dist/` module. If you prefer to develop the
admin UI directly in this app, you can adapt imports to the local `src/admin`
components and remove the library import.

- Add any admin-only server scripts here that interact with `backend/`.
