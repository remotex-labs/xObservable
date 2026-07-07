# Release Notes

What shipped in the v1.0.x line of `@remotex-labs/xobservable`.

## v1.0.0

Initial release: a lightweight, dependency-free observable implementation for TypeScript.

### Core

- [`Observable<T>`](core/observable): a lazy, push-based stream. `subscribe` accepts a full observer object or positional `next`/`error`/`complete`
callbacks and returns an unsubscribe function that stops delivery and runs the handler's cleanup.
- [`Subject<T>`](core/subject): a multicast stream that is both an observable and an observer, with error aggregation across observers.
- [`BehaviorSubject<T>`](core/behavior-subject): a subject that holds a current value (readable via `value`) and replays it to new subscribers.

### Operators

- [`map`, `filter`, `distinctUntilChanged`, and `tap`](operators/overview), composed through [`pipe`](core/observable#pipe) with full type inference.

### Error handling

- Safe observers: a handler that throws synchronously routes the error to the observer instead of crashing the subscription. See [Error Handling](guides/error-handling).

### Types

- Exported types: `ObserverInterface`, `NextType`, `ErrorType`, `CompleteType`, `UnsubscribeType`, `OperatorFunctionType`, `UnaryFunctionInterface`.

## See also

- [Getting Started](guide)
- [Piping & Composition](guides/piping)
