# Issues

## Async Subscription

Some components that have large resource requirements may not yet be set for unmounting.

## Xlsx-populate

- No support for saved multiple selection (use multiple selection then save the excel file). No work around at the moment.

## Heavy Loads

Only heavy loads, the application hangs. We could use a web-worker to handle the processing in the background.

## React Window

When the width/height of the frozen column/rows is greater than the dimension of the visisble window, the frozen area can be scrolled.

## Excel

- Default theme colours are hard-coded from excel (not really an issue if this never changes). It's possible that we could get the colours from Xlsx-populate and store it as a state: { ...appState, themes: { ... } }

## Slate-js

- [Multiple instance bug](https://github.com/ianstormtaylor/slate/pull/3506)
