# Operators

Operators are small functions that take a source observable and return a new one. You apply them with
[`pipe`](../guides/piping). Each operator subscribes to its source, transforms the notifications, and forwards them
to its own observer. Errors thrown inside an operator callback are routed to the observer's `error` handler.

```ts
import { Observable, map, filter, distinctUntilChanged, tap } from '@remotex-labs/xobservable';
```

## `map`

Projects each value through a function.

```ts
const doubled = numbers.pipe(map((x) => x * 2));
```

| Parameter | Description                               |
|-----------|-------------------------------------------|
| `project` | Transforms each source value into output. |

If `project` throws, the error is routed to `error` and that value is not emitted.

## `filter`

Emits only the values that satisfy a predicate; non-matching values are dropped.

```ts
const evens = numbers.pipe(filter((x) => x % 2 === 0));
```

| Parameter   | Description                                           |
|-------------|-------------------------------------------------------|
| `predicate` | Returns `true` to emit the value, `false` to drop it. |

## `distinctUntilChanged`

Emits a value only when it differs from the previously emitted one. The first value always passes through.

```ts
// Default strict equality
source.pipe(distinctUntilChanged());

// Compare by a field
users.pipe(distinctUntilChanged((prev, curr) => prev.id === curr.id));
```

| Parameter   | Default             | Description                                          |
|-------------|---------------------|------------------------------------------------------|
| `compareFn` | `(a, b) => a === b` | Returns `true` when two values are considered equal. |

## `tap`

Runs a side effect for each value and forwards the value unchanged. Useful for logging or tracking.

```ts
const logged = numbers.pipe(tap((x) => console.log('value', x)));
```

| Parameter    | Description                                            |
|--------------|--------------------------------------------------------|
| `sideEffect` | Invoked for each value; its return value is ignored.   |

If `sideEffect` throws, the error is routed to `error` and that value is not emitted.

## Composing operators

Operators combine left to right in a single `pipe` call:

```ts
const result = source.pipe(
    filter((x) => x % 2 === 0),
    map((x) => x * 10),
    distinctUntilChanged()
);
```

See [Piping & Composition](../guides/piping) for how types flow through the chain.
