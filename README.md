# playground

A small Vite + React page with four pieces:

- `Accordion` / `Accordion.Item` — the container keeps which panels are open
- `Tags` / `Tags.Item` — a container and the tag children inside it
- `sortByKeys(data, keys)` — returns a new array sorted by that key list
- `sortByValue(data, values, key)` — orders one field by a value list. `others` holds anything the list does not name

```bash
npm install
npm run dev
npm test
npm run build
```
