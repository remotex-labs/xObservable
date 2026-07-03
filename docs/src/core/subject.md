# Subject

A `Subject` is both an observable and an observer. Unlike an [Observable](../core/observable), which runs its handler
once per subscriber, a subject shares a single emission sequence across all of its current observers - it is *hot*
and *multicast*.

## Multicasting

You push values into a subject with `next`, and every current subscriber receives them.

```ts
import { Subject } from '@remotex-labs/xobservable';

const subject = new Subject<number>();

subject.subscribe((v) => console.log('A', v));
subject.subscribe((v) => console.log('B', v));

subject.next(42);
// A 42
// B 42
```

Subscribers only receive values emitted *after* they subscribe; a subject keeps no history. For replaying the
latest value to late subscribers, use a [BehaviorSubject](../core/behavior-subject).

## Emitting

| Method        | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| `next(value)` | Emits a value to every current observer.                                 |
| `error(err)`  | Emits an error to every current observer.                                |
| `complete()`  | Notifies observers, clears the observer set, and marks the subject done. |

```ts
subject.next(1);
subject.complete();
subject.next(2); // ignored - the subject has completed
```

Once completed, emissions are no-ops and any new subscriber receives `complete` immediately.

## Unsubscribing

Each `subscribe` call returns an unsubscribe function that removes just that observer from the set.

```ts
const unsub = subject.subscribe((v) => console.log(v));
subject.next(1); // logged
unsub();
subject.next(2); // not logged
```

## Error aggregation

A subject notifies a snapshot of its observers, so handlers may subscribe or unsubscribe during emission without
disturbing iteration. If one or more handlers throw, the failures are collected and rethrown together as an
`AggregateError` after every observer has been notified.

```ts
subject.subscribe(() => { throw new Error('first'); });
subject.subscribe(() => { throw new Error('second'); });

subject.next(1); // throws AggregateError with both failures // [!code error]
```

A throwing `next` handler is first forwarded to that observer's own `error` handler, then included in the
aggregate. See [Error Handling](../guides/error-handling).
