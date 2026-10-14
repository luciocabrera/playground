# playground

A small Vite + React page with four pieces:

- `Accordion` / `Accordion.Item` — the container keeps which panels are open
- `Tags` / `Tags.Item` — a container and the tag children inside it
- `sortByKeys(data, keys)` — returns a new array sorted by that key list
- `sortByValue(data, values, key)` — orders one field by a list you write. See [sortByValue](#sortbyvalue) below

```bash
npm install
npm run dev
npm test
npm run build
```

## sortByValue

`sortByValue` puts rows in an order you choose. You pick one field and hand it the list of values that field should follow. The first string in that list comes first.

```ts
sortByValue(rows, ["white", "others", "black"], "color");
```

The three arguments are:

- `data` — the rows, an array of objects.
- `values` — the order for one field. `"others"` may appear in this list.
- `key` — the field to read, such as `"color"`.

The list is the order. `"white"` is the first string in this call, so white rows come first.

### One call, followed by hand

Start with four rows:

| name  | color |
| ----- | ----- |
| Ink   | black |
| Poppy | red   |
| Snow  | white |
| Sea   | blue  |

Call `sortByValue(rows, ["white", "others", "black"], "color")`. The result is Snow, Poppy, Sea, Ink.

The function gets there in four steps. The helpers in `src/lib/sortByValue.ts` are those steps.

1. `ranksFor` turns the names in the list into ranks. A rank is the position of that string, starting at 0. `"others"` is left out of the map. It is the slot for colors the list does not name. The map for this call is `white → 0`, `black → 2`.
2. `indexOfValue` finds `"others"` at index 1. That number is the fallback rank. Every color the map does not contain gets rank 1. With no `"others"` in the list, the fallback is `values.length`, so those rows come after every named value.
3. For each row, `fieldOf` reads `row.color`, and `rankOf` turns that color into a rank. Snow is 0. Poppy and Sea are 1. Ink is 2.
4. `toSorted` orders the rows by those ranks and returns a new array. The original `data` array stays as it was.

| name  | color | rank | why |
| ----- | ----- | ---: | --- |
| Snow  | white | 0 | `"white"` is the first string in the list |
| Poppy | red   | 1 | `"red"` is not in the list, so it uses the `"others"` slot |
| Sea   | blue  | 1 | same slot as Poppy; Sea already came after Poppy, so it stays after |
| Ink   | black | 2 | `"black"` is the third string in the list |

Poppy and Sea share rank 1. `toSorted` keeps their original order, so Poppy stays ahead of Sea. The same rule groups Snow before Paper when both are white in the swatch list on the page.

### Cases worth trying

**`"others"` in the middle.** In the call above, red and blue sit between white and black. Move `"others"` and those two rows move with it.

**No `"others"`.** `sortByValue(rows, ["white", "black"], "color")` gives Snow, Ink, then Poppy and Sea. Red and blue were not named, and with no slot for them their rank is 2, the length of the list.

**A value written twice.** `["black", "white", "black"]` gives black rank 0. The second `"black"` is ignored. `ranksFor` keeps the first index only.

**A missing field.** A row with no `color` property reads as `undefined`. `rankOf` sends that through the same fallback as red and blue, so the row uses the `"others"` slot.

**A bad argument.** `sortByValue` throws `TypeError` when `data` or `values` is not an array, or when `key` is not a non-empty string.
