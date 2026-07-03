# BehaviorSubject

A `BehaviorSubject` is a [Subject](../core/subject) that always holds a current value. It is seeded at construction
and replays the latest value to each new subscriber immediately on subscription - so a value is always available,
even before the first `next`.

## Seeding a value

The constructor takes an initial value, or a factory invoked once to compute it.

```ts
import { BehaviorSubject } from '@remotex-labs/xobservable';

const direct = new BehaviorSubject<number>(0);
const lazy = new BehaviorSubject<string>(() => localStorage.getItem('state') ?? 'default');
```

A factory enables lazy or side-effecting initialization; it runs exactly once during construction.

## Replaying to subscribers

Every new subscriber receives the current value right away, then any following emissions.

```ts
const count = new BehaviorSubject<number>(0);

count.subscribe((v) => console.log('A', v)); // A 0  (replayed immediately)
count.next(5);                               // A 5
count.subscribe((v) => console.log('B', v)); // B 5  (replayed immediately)
```

## Reading the current value

The `value` getter returns the latest emitted value (or the initial value).

```ts
const state = new BehaviorSubject<number>(1);

state.value; // 1
state.next(2);
state.value; // 2
```

## API

### `new BehaviorSubject<T>(initialValue)`

| Parameter      | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| `initialValue` | The initial value, or a factory `() => T` invoked once at construction. |

### `get value(): T`

The most recent value: the latest emitted value, or the initial value.

### `subscribe(...)` and `next(value)`

Both override [Subject](../core/subject): `subscribe` replays the current value after registering the observer, and
`next` stores the value before broadcasting so later subscribers receive it. After completion, `subscribe` returns
a no-op unsubscribed and `next` is ignored.
