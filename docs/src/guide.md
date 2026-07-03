# Getting Started

xObservable is a small, dependency-free implementation of push-based reactive streams. You create an `Observable`
from a handler, `subscribe` to receive values, and compose transformations with operators through `pipe`.

## Installation

::: code-group

```bash [npm]
npm install @remotex-labs/xobservable
```

```bash [pnpm]
pnpm add @remotex-labs/xobservable
```

```bash [yarn]
yarn add @remotex-labs/xobservable
```

:::

xObservable requires Node.js 22 or later and has no runtime dependencies.

## Quick start

```ts
import { Observable, map, filter } from '@remotex-labs/xobservable';

const numbers = new Observable<number>((observer) => {
    [ 1, 2, 3, 4 ].forEach((value) => observer.next?.(value)); // [!code focus]
    observer.complete?.();                                     // [!code focus]
});

const unsubscribe = numbers
    .pipe(filter((x) => x % 2 === 0), map((x) => x * 10))
    .subscribe({
        next: (value) => console.log(value), // 20, 40
        complete: () => console.log('done')
    });

unsubscribe(); // stop delivery and run any teardown
```

Parameterize an observable with its value type, as in `new Observable<number>(...)`. TypeScript then checks the
values you emit and the ones your subscriber receives.

## Core concepts

| Concept                                    | Description                                                                 |
|--------------------------------------------|-----------------------------------------------------------------------------|
| [Observable](/core/observable)             | A lazy, push-based stream. The handler runs once per `subscribe`.           |
| [Subject](/core/subject)                   | A multicast stream that is both an observable and an observer.              |
| [BehaviorSubject](/core/behavior-subject)  | A subject that holds a current value and replays it to new subscribers.     |
| [Operators](/operators/overview)           | Small functions composed with `pipe` to transform a stream.                 |

## The observer

Every subscription is driven by an observer: an object with optional `next`, `error`, and `complete` handlers.
You can pass the object directly, or pass positional callbacks.

```ts
// Observer object
source.subscribe({
    next: (value) => console.log('value:', value),
    error: (err) => console.error('error:', err),
    complete: () => console.log('completed')
});

// Positional callbacks
source.subscribe(
    (value) => console.log(value),
    (err) => console.error(err),
    () => console.log('completed')
);
```

`error` and `complete` are terminal: after either fires, no further values are delivered.

## Unsubscribing

`subscribe` returns an unsubscribe function. Calling it stops delivery and runs the teardown the handler returned.

```ts
const ticks = new Observable<number>((observer) => {
    let count = 0;
    const id = setInterval(() => observer.next?.(count++), 1000);

    return () => clearInterval(id); // teardown // [!code focus]
});

const stop = ticks.subscribe((n) => console.log(n));
stop(); // clears the interval
```

## Next steps

- [Observable](/core/observable): the stream primitive and its `subscribe`/`pipe` API.
- [Subject](/core/subject) and [BehaviorSubject](/core/behavior-subject): multicasting and shared state.
- [Operators](/operators/overview): `map`, `filter`, `distinctUntilChanged`, and `tap`.
- [Piping & Composition](/guides/piping): how `pipe` chains operators with full type inference.
- [Error Handling](/guides/error-handling): how throws are captured and surfaced.
