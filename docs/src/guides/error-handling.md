# Error Handling

xObservable is designed so that a throw never silently crashes a stream. Errors are captured and routed to the
observer's `error` handler, or aggregated when a subject notifies many observers.

## Observable handler throws

If an `Observable` handler throws synchronously during `subscribe`, the error is forwarded to `observer.error`
and a no-op unsubscribing is returned:

```ts
new Observable<number>(() => { throw new Error('boom'); })
    .subscribe({
        next: () => {},
        error: (err) => console.error(err) // Error: boom // [!code focus]
    });
```

A throw inside the teardown returned by the handler is likewise routed to `observer.error` when you unsubscribe.

## Operator callback throws

Each [operator](../operators/overview) wraps its callback. A throw in `map`, `filter`, `distinctUntilChanged`, or
`tap` is routed to `error`, and the offending value is not emitted:

```ts
source.pipe(map((x) => { throw new Error('bad'); }))
    .subscribe({
        next: () => {},
        error: (err) => console.error(err) // Error: bad // [!code focus]
    });
```

## Subject aggregation

A [Subject](../core/subject) notifies a snapshot of its observers. If several handlers throw during one emission,
the failures are collected and rethrown together as an `AggregateError` once every observer has been notified:

```ts
subject.subscribe(() => { throw new Error('first'); });
subject.subscribe(() => { throw new Error('second'); });

try {
    subject.next(1);
} catch (err) {
    // err instanceof AggregateError
    // err.errors -> [ Error: first, Error: second ]
}
```

For a throwing `next` handler, the subject first forwards the error to that same observer's `error` handler (a
secondary failure there is ignored), then includes the original error in the aggregate.

## Terminal notifications

`error` and `complete` are terminal. After either fires for a subscription, no further `next`, `error`, or
`complete` is delivered. A completed subject ignores later emissions and completes new subscribers immediately.
