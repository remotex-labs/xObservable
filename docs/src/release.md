# Release Notes

What changed in each release of `@remotex-labs/xobservable`.

## v1.1.0

Disposable subscriptions: every unsubscribe function now implements `Disposable`, so a subscription can be bound with a `using` declaration and torn down automatically when its scope exits.

```ts
{
    using sub = source.subscribe((value) => console.log(value));
    source.next(1);
} // sub is disposed here - the subscription is torn down automatically
```

### Added

- `UnsubscribeType` is now `(() => void) & Disposable`: the function returned by `subscribe` exposes `Symbol.dispose` and works with `using` declarations. See [Automatic cleanup with `using`](core/observable#automatic-cleanup-with-using).
- New `TeardownType` export: the zero-argument cleanup a handler may return from the [`Observable` constructor](core/observable#new-observablethandler).

### Changed

- Unsubscribe functions are idempotent: calling them more than once (or disposing after unsubscribing) runs the teardown at most once. See [Subscribing](core/observable#subscribing).
- The `Observable<T>` constructor handler is now typed as `(observer) => TeardownType | void` instead of returning an `UnsubscribeType`.
- [`BehaviorSubject.subscribe`](core/behavior-subject#api) on a completed subject returns a disposable no-op instead of a plain function, so `using` works there too.

## Earlier releases

- [v1.0.0](v1.0.x/release) - initial release (archived docs).

## See also

- [Getting Started](guide)
- [Observable](core/observable)
