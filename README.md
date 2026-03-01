# HENRi

## Run locally

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/index.html
```

## Fixing VS Code / TypeScript errors in `script.js`

If you see many errors like `')' expected` / `';' expected` on almost every line, the file is usually not saved as plain JavaScript.

### Checklist

1. Open `script.js` and ensure the first line is exactly:

   ```js
   const root = document.documentElement;
   ```

2. Make sure there are **no markdown fences** in the file (remove lines like ` ```js ` or ` ``` `).
3. Save the file as **UTF-8** (bottom-right encoding in VS Code).
4. Ensure file extension is `.js` (not `.ts`, `.json`, or `.txt`).
5. Reload VS Code window (`Developer: Reload Window`).

### Quick validation

Run:

```bash
node --check script.js
```

If no output appears, syntax is valid.
