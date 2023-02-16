# History - Redo and Undo

## Solutions

## Implementation 1 (Impractical)

Add a history to state values

### Analysis

#### Cost

Run-time: O(1) - Just update the history index

Storage: Changed values in storage, history indices, action history, and action state/key (to know which index to update)

#### Pros

- Quick run-time

- No unecessary re-renders

#### Cons

- Hard implementation, especially if state is dynamic - need to understand the structure of each state

- Would all data be stored even if it doesn't have a value intially?

### Structure

#### Redo/undo Action

Undo:

```js
{
  CELL_UNDO: {
    row_x: column_y
    ...
  }
}
```

Redo:

```js
{
  CELL_REDO: {
    row_x: column_y
    ...
  }
}
```

#### Cell History

```js
{
  row_x: {
    column_y: {
      history: [ ... ],
      relativeHistoryIndex: int_z
    }
  }
}
```

#### Action History

```js
[
  CELL_VALUE_UPDATE: {
    row_x: {
      column_y,
      ...
    }
  },
  ...
]
```

#### Action Index

```js
index: int_z
```

## Implementation 2

Retrace history through action history - start from initial app state to desired state through actions

### Analysis

#### Cost

Run-time: O(n) - Need to perform actions to go to desired state

Storage: History index, action history and action values

#### Pros

- Quick run time

- [Already implemented](https://github.com/JannicBeck/undox)

#### Cons

- Have to retrace history from initial state to desired state - takes up to n actions and at least n re-renders (if values are different)

### Structure

#### Redo/undo Action

Undo:

```js
{
  type: UDNO
}
```

Redo:

```js
{
  type: REDO
}
```

#### Action History

```js
[
  {
    type: CELL_UPDATE,
    values: {
      row_x: {
        col_y: {
          value: "First change from initial state"
        }
      }
    }
  },
  ...,
  {
    type: CELL_UPDATE,
    values: {
      row_x: {
        col_y: {
          value: "new value"
        }
      }
    }
  }
]
```

#### Action Index

```js
index: int_z
```

## Implementation 3

Have a history of the entire desired states

### Analysis

#### Cost

Run-time: O(1) - Just update the history index

Storage: History index, entire state

#### Pros

- Quick run-time

- [Already implemented](https://github.com/omnidan/redux-undo)

#### Cons

- Stores values which have not changed

- Storage is expensive and will slow the app down if the state is large

### Structure

#### Redo/undo Action

Undo:

```js
{
  type: UNDO
}
```

Redo:

```js
{
  type: REDO
}
```

#### State History

```js
[
  {
    ...desiredAppStates_1
  },
  ...,
  {
    ...desiredAppStates_x
  }
]
```

#### Action Index

```js
index: int_z
```
