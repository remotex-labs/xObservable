# xObservable

[![Documentation](https://img.shields.io/badge/Documentation-orange?logo=typescript&logoColor=f5f5f5)](https://remotex-labs.github.io/xObservable/)
[![npm version](https://img.shields.io/npm/v/@remotex-labs/xobservable.svg)](https://www.npmjs.com/package/@remotex-labs/xobservable)
[![downloads](https://img.shields.io/npm/dm/@remotex-labs/xobservable?label=npm%20downloads)](https://www.npmjs.com/package/@remotex-labs/xobservable)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Test CI](https://github.com/remotex-labs/xObservable/actions/workflows/ci.yml/badge.svg)](https://github.com/remotex-labs/xObservable/actions/workflows/ci.yml)
[![Discord](https://img.shields.io/discord/1364348850696884234?logo=Discord&label=Discord)](https://discord.gg/psV9grS9th)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/remotex-labs/xObservable)

A TypeScript library for push-based reactive streams. Create an `Observable` from a handler, `subscribe` to receive
values, errors, and completion, and compose transformations with operators through a fully typed `pipe`.

It is designed for event handling, state propagation, and data-flow composition, with a multicast `Subject`, a
stateful `BehaviorSubject`, and composable operators - all with safe error handling and per-subscription teardown,
and no runtime dependencies.

## Key Features

- **Push-based streams**: create an `Observable` from a handler that pushes values through `next`, `error`, and `complete`.
- **Multicast subjects**: a `Subject` is both an observable and an observer, sharing one emission sequence across all subscribers.
- **Stateful BehaviorSubject**: always holds a current value and replays it to every new subscriber on subscription.
- **Composable operators**: chain `map`, `filter`, `distinctUntilChanged`, and `tap` through a fully typed `pipe`.
- **Safe by default**: handler and operator throws are routed to the observer's `error` handler instead of crashing the stream.
- **Zero dependencies**: a tiny runtime with no external packages, shipped as both ESM and CommonJS.

## Installation

```bash
npm install @remotex-labs/xobservable
# or
pnpm add @remotex-labs/xobservable
# or
yarn add @remotex-labs/xobservable
```

xObservable requires Node.js 22 or later and has no runtime dependencies.

## Quick start

```ts
import { Observable, map, filter } from '@remotex-labs/xobservable';

const numbers = new Observable<number>((observer) => {
    [ 1, 2, 3, 4 ].forEach((value) => observer.next?.(value));
    observer.complete?.();
});

const unsubscribe = numbers
    .pipe(filter((x) => x % 2 === 0), map((x) => x * 10))
    .subscribe({
        next: (value) => console.log(value), // 20, 40
        complete: () => console.log('done')
    });

unsubscribe(); // stop delivery and run any teardown
```

Parameterize an observable with its value type (`new Observable<number>(...)`) and TypeScript checks the values you
emit and the ones your subscriber receives.

## The observer

Every subscription is driven by an observer: an object with optional `next`, `error`, and `complete` handlers. You
can pass the object directly or pass positional callbacks.

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

## Observable

An `Observable` is a lazy, *cold* stream. Nothing runs until you `subscribe`, and the handler re-runs independently
for every subscriber. It may return a teardown function that runs on unsubscribing.

```ts
const ticks = new Observable<number>((observer) => {
    let count = 0;
    const id = setInterval(() => observer.next?.(count++), 1000);

    return () => clearInterval(id); // teardown
});

const stop = ticks.subscribe((n) => console.log(n));
stop(); // clears the interval
```

## Subject

A `Subject` is both an observable and an observer. Unlike an `Observable`, it shares a single emission sequence
across all of its current observers - it is *hot* and *multicast*. You push values in with `next`.

```ts
import { Subject } from '@remotex-labs/xobservable';

const subject = new Subject<number>();

subject.subscribe((v) => console.log('A', v));
subject.subscribe((v) => console.log('B', v));

subject.next(42);
// A 42
// B 42
```

| Method        | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| `next(value)` | Emits a value to every current observer.                                 |
| `error(err)`  | Emits an error to every current observer.                                |
| `complete()`  | Notifies observers, clears the observer set, and marks the subject done. |

Subscribers only receive values emitted *after* they subscribe; a subject keeps no history. Once completed,
emissions are no-ops and any new subscriber receives `complete` immediately.

## BehaviorSubject

A `BehaviorSubject` is a `Subject` that always holds a current value. It is seeded at construction and replays the
latest value to each new subscriber immediately on subscription.

```ts
import { BehaviorSubject } from '@remotex-labs/xobservable';

const count = new BehaviorSubject<number>(0);

count.subscribe((v) => console.log('A', v)); // A 0  (replayed immediately)
count.next(5);                               // A 5
count.subscribe((v) => console.log('B', v)); // B 5  (replayed immediately)

count.value; // 5 - the current value
```

The constructor also accepts a factory (`() => T`) invoked exactly once, for lazy or side-effecting initialization.

## Operators

Operators are small functions that take a source observable and return a new one; you apply them with `pipe`.
Errors thrown inside an operator callback are routed to the observer's `error` handler and that value is not emitted.

| Operator                           | Description                                                               |
|------------------------------------|---------------------------------------------------------------------------|
| `map(project)`                     | Projects each value through a function.                                   |
| `filter(predicate)`                | Emits only the values that satisfy the predicate.                         |
| `distinctUntilChanged(compareFn?)` | Emits a value only when it differs from the previous one (default `===`). |
| `tap(sideEffect)`                  | Runs a side effect for each value and forwards the value unchanged.       |

```ts
import { map, filter, distinctUntilChanged, tap } from '@remotex-labs/xobservable';

source.pipe(
    tap((x) => console.log('in', x)),
    filter((x) => x % 2 === 0),
    map((x) => x * 10),
    distinctUntilChanged()
);
```

## Piping & composition

`pipe` composes operators left to right, threading the value type through each step so the result type is inferred
end to end. It is overloaded for up to five operators; beyond that the result type is inferred from the final
operator. With no operators, `pipe()` returns the same instance, so it is always safe to call.

```ts
const lengths = strings.pipe(
    filter((s) => s.length > 0), // Observable<string>
    map((s) => s.length)         // Observable<number>
);
// lengths: Observable<number>
```

Piping does not subscribe: the composed observable is still lazy, and the whole chain re-runs for every `subscribe`.
To share one execution across subscribers, pipe from a `Subject`.

## Error handling

xObservable is designed so that a throw never silently crashes a stream.

```ts
// Observable handler throw → routed to observer.error
new Observable(() => { throw new Error('boom'); })
    .subscribe({ next: () => {}, error: (err) => console.error(err) });

// Operator callback throw → routed to observer.error, value not emitted
source.pipe(map(() => { throw new Error('bad'); }))
    .subscribe({ next: () => {}, error: (err) => console.error(err) });
```

A `Subject` notifies a snapshot of its observers, so handlers may subscribe or unsubscribe during emission. If one
or more handlers throw, the failures are collected and rethrown together as an `AggregateError` once every observer
has been notified.

```ts
subject.subscribe(() => { throw new Error('first'); });
subject.subscribe(() => { throw new Error('second'); });

subject.next(1); // throws AggregateError with both failures
```

## Documentation

Full guides and the complete API reference live at
**[remotex-labs.github.io/xObservable](https://remotex-labs.github.io/xObservable/)**.

## Contributing

Contributions are welcome! Open an [issue](https://github.com/remotex-labs/xObservable/issues) or a pull request
on GitHub.

## Links

[Documentation](https://remotex-labs.github.io/xObservable/),
[GitHub Repository](https://github.com/remotex-labs/xObservable),
[Issue Tracker](https://github.com/remotex-labs/xObservable/issues),
[npm Package](https://www.npmjs.com/package/@remotex-labs/xobservable)

## License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.
