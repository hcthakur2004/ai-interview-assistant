# AI Interview Assistant

Lightweight React app to let candidates upload a resume, take an AI-assisted interview, and let recruiters review results.

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Run the development server (will pick a free port if 3000 is busy):

```powershell
$env:PORT=0; npm start
```

3. Open the URL printed in your terminal (usually http://localhost:3000 or the port shown).

## Resume upload

- Go to the Candidate flow and upload a PDF resume.
- The app extracts Name, Email, and Phone from the resume text and shows them for confirmation.

## GitHub

To add this project to GitHub from your machine:

1. Create a new empty repository on GitHub (do not initialize with a README).
2. In your project root run (replace the URL with your repo):

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

If you use SSH instead of HTTPS, replace the remote URL accordingly.

## Notes & next steps

- The app uses `react-pdf` to extract PDF text client-side. For more accurate parsing you can add a server-side parser or 3rd-party resume parsing API.
- If you see an ESLint import error pointing to `src/utils/fileUtils.js` about `import/first`, make sure imports are at the top of the file. I fixed the immediate issues in the repository, but if you edit that file later keep imports at top.

If you'd like I can: create a .gitignore, initialize the repo here, and make the first commit for you (I can't create the GitHub remote for you, but I can show the exact commands). Let me know which option you prefer.
