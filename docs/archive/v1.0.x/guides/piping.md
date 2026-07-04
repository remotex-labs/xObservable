# Piping & Composition

`pipe` composes [operators](../operators/overview) into a single transformed observable. It reduces the operators
over the source, left to right: each operator receives the previous observable and returns the next.

```ts
const result = source.pipe(map((v) => v * 2), filter((v) => v > 10));
// equivalent to: filter(...)(map(...)(source))
```

## No operators is a no-op

Calling `pipe()` with no operators returns the same instance, so it is always safe to call:

```ts
source.pipe() === source; // true
```

## Type inference

`pipe` is overloaded for up to five operators, threading the value type through each step so the result type is
inferred end to end:

```ts
const lengths = strings.pipe(
    filter((s) => s.length > 0), // Observable<string>
    map((s) => s.length)         // Observable<number>
);
// lengths: Observable<number>
```

With more than five operators, the result type is inferred from the final operator.

## Order matters

Operators run in the order you list them. Filtering before mapping is different from mapping before filtering:

```ts
// Keep evens, then multiply
source.pipe(filter((x) => x % 2 === 0), map((x) => x * 10));

// Multiply, then keep values over 10
source.pipe(map((x) => x * 10), filter((x) => x > 10));
```

## Each subscription re-runs the chain

Piping does not subscribe. The composed observable is still lazy: the whole chain runs anew for every
`subscribe` on the result. To share one execution across subscribers, pipe from a [Subject](../core/subject).
