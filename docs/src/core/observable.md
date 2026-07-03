# Observable

An `Observable` is a lazy, push-based stream of values. Nothing runs until you `subscribe`; each subscription runs
the handler you passed to the constructor, independently of any other subscription.

## Creating an observable

The constructor takes a handler that receives an observer and may return a teardown function.

```ts
import { Observable } from '@remotex-labs/xobservable';

const source = new Observable<number>((observer) => {
    observer.next?.(1);
    observer.next?.(2);
    observer.complete?.();

    return () => console.log('cleaned up'); // optional teardown
});
```

The handler drives the stream by calling `observer.next`, `observer.error`, and `observer.complete`. Because it
runs once per `subscribe`, each subscriber gets its own execution - this is what makes an observable *cold*.

## Subscribing

`subscribe` accepts either an observer object or positional `next`, `error`, and `complete` callbacks. It returns
an unsubscribe function.

```ts
const unsubscribe = source.subscribe({
    next: (value) => console.log(value),
    error: (err) => console.error(err),
    complete: () => console.log('done')
});

unsubscribe(); // stops delivery and runs the teardown
```

If the handler throws synchronously, the error is routed to `observer.error` and a no-op unsubscribe is returned -
see [Error Handling](/guides/error-handling).

## `pipe`

`pipe` composes operators left to right, returning a new observable. With no operators it returns the same
instance, so `pipe()` is always safe to call.

```ts
import { Observable, map, filter } from '@remotex-labs/xobservable';

const result = source.pipe(
    filter((x) => x > 0),
    map((x) => x * 2)
);
```

`pipe` is overloaded up to five operators with full type inference; beyond that the result type is inferred from
the final operator. See [Piping & Composition](/guides/piping).

## API

### `new Observable<T>(handler)`

| Parameter | Description                                                                         |
|-----------|-------------------------------------------------------------------------------------|
| `handler` | Runs on each `subscribe`; receives the observer and may return a teardown function. |

### `subscribe(observerOrNext?, error?, complete?)`

Returns an `UnsubscribeType` function. Pass either a full observer object as the first argument, or a `next`
callback followed by optional `error` and `complete` callbacks.

### `pipe(...operators)`

Returns the transformed observable, or `this` when called with no operators.

## Cold vs hot

An `Observable` is cold: the handler re-runs for every subscriber. When you need a single execution shared across
many subscribers, use a [Subject](/core/subject) instead.
