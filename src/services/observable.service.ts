/**
 * Type-only imports erased during TypeScript compilation.
 */

import type { ObserverInterface, OperatorFunctionType } from '@interfaces/observable.interface';
import type { NextType, TeardownType, UnsubscribeType, ErrorType, CompleteType } from '@interfaces/observable.interface';

/**
 * A push-based stream of values that can be observed over time.
 *
 * @template T - Type of values emitted by this observable.
 *
 * @remarks
 * The core of the lightweight observable implementation: it supports subscription, safe error handling, and operator
 * chaining through {@link pipe}. The subscription handler runs once per {@link subscribe} call.
 *
 * @example
 * ```ts
 * const numbers = new Observable<number>(observer => {
 *   [1, 2, 3].forEach(v => observer.next?.(v));
 *   observer.complete?.();
 *   return () => console.log('cleaned up');
 * });
 *
 * const sub = numbers.subscribe({
 *   next: v => console.log(v),
 *   complete: () => console.log('done')
 * });
 *
 * sub(); // triggers cleanup
 * ```
 *
 * @see pipe
 * @see ObserverInterface
 * @see OperatorFunctionType
 *
 * @since 1.0.0
 */

export class ObservableService<T = unknown> {
    /**
     * Creates a new observable from a subscription handler.
     *
     * @param handler - Run on each {@link subscribe} call; receives the observer and may return a cleanup function.
     *
     * @remarks
     * The handler drives the stream by calling `observer.next`, `observer.error`, and `observer.complete`, and may
     * return a teardown for resource cleanup. Running per subscription enables lazy setup and external event binding.
     *
     * @example
     * ```ts
     * const ticks = new ObservableService<number>((observer) => {
     *   let count = 0;
     *   const id = setInterval(() => observer.next?.(count++), 1000);
     *
     *   return () => clearInterval(id);
     * });
     * ```
     *
     * @see ObserverInterface
     * @since 1.0.0
     */

    constructor(
        private readonly handler: (observer: ObserverInterface<T>) => TeardownType | void
    ) {}

    /**
     * Subscribes to this observable to receive values, errors, and completion.
     *
     * @param observerOrNext - A full observer object, or a `next` callback.
     * @param error - Error handler, used when the first argument is a `next` callback.
     * @param complete - Completion handler, used when the first argument is a `next` callback.
     * @returns Idempotent unsubscribe function that stops delivery and runs the handler's cleanup; it also implements
     * {@link Disposable}, so it can be bound with a `using` declaration.
     *
     * @remarks
     * If the handler throws synchronously, the error is routed to the observer and a no-op unsubscribing is returned.
     * The returned function is safe to call more than once - the teardown runs at most once - and disposes cleanly
     * when released through `Symbol.dispose`.
     *
     * @example
     * ```ts
     * // Observer object
     * source.subscribe({ next: v => console.log(v), error: e => console.error(e) });
     *
     * // Positional callbacks
     * source.subscribe(v => console.log(v), e => console.error(e), () => console.log('done'));
     *
     * // Scoped subscription - unsubscribed automatically when the block exits
     * {
     *   using sub = source.subscribe(v => console.log(v));
     * }
     * ```
     *
     * @since 1.0.0
     */

    subscribe(
        observerOrNext?: ObserverInterface<T> | NextType<T>,
        error?: ErrorType,
        complete?: CompleteType
    ): UnsubscribeType {
        const observer = this.createSafeObserver(observerOrNext, error, complete);
        let cleanup: TeardownType | void;

        try {
            cleanup = this.handler(observer);
        } catch (err) {
            observer.error?.(err);

            return this.toUnsubscribe(() => {});
        }

        return this.toUnsubscribe(() => {
            try {
                cleanup?.();
            } catch (err) {
                observer.error?.(err);
            }
        });
    }

    /**
     * Returns this observable unchanged.
     *
     * @returns This observable.
     *
     * @since 1.0.0
     */

    pipe(): this;

    /**
     * Applies a single operator.
     *
     * @since 1.0.0
     */

    pipe<A>(
        op1: OperatorFunctionType<T, A>
    ): ObservableService<A>;

    /**
     * Applies two operators in sequence.
     *
     * @since 1.0.0
     */

    pipe<A, B>(
        op1: OperatorFunctionType<T, A>, op2: OperatorFunctionType<A, B>
    ): ObservableService<B>;

    /**
     * Applies three operators in sequence.
     *
     * @since 1.0.0
     */

    pipe<A, B, C>(
        op1: OperatorFunctionType<T, A>,
        op2: OperatorFunctionType<A, B>,
        op3: OperatorFunctionType<B, C>
    ): ObservableService<C>;

    /**
     * Applies four operators in sequence.
     *
     * @since 1.0.0
     */

    pipe<A, B, C, D>(
        op1: OperatorFunctionType<T, A>,
        op2: OperatorFunctionType<A, B>,
        op3: OperatorFunctionType<B, C>,
        op4: OperatorFunctionType<C, D>
    ): ObservableService<D>;

    /**
     * Applies five operators in sequence.
     *
     * @since 1.0.0
     */

    pipe<A, B, C, D, E>(
        op1: OperatorFunctionType<T, A>,
        op2: OperatorFunctionType<A, B>,
        op3: OperatorFunctionType<B, C>,
        op4: OperatorFunctionType<C, D>,
        op5: OperatorFunctionType<D, E>
    ): ObservableService<E>;

    /**
     * Applies five or more operators in sequence; the result type is inferred from the final operator.
     *
     * @since 1.0.0
     */

    pipe<A, B, C, D, E, Ops extends Array<OperatorFunctionType>>(
        op1: OperatorFunctionType<T, A>,
        op2: OperatorFunctionType<A, B>,
        op3: OperatorFunctionType<B, C>,
        op4: OperatorFunctionType<C, D>,
        op5: OperatorFunctionType<D, E>,
        ...operations: Ops
    ): ObservableService<
        Ops extends [...Array<unknown>, OperatorFunctionType<unknown, infer R>] ? R : T
    >;

    /**
     * Applies each operator left to right and returns the resulting observable.
     *
     * @param operators - Operators to compose over this observable.
     * @returns The transformed observable, or this observable when no operators are given.
     *
     * @remarks
     * Reduces the operators over the current instance:
     * each operator receives the previous observable and returns the next.
     * With no operators, the instance is returned unchanged, so `pipe()` is always safe to call.
     *
     * @example
     * ```ts
     * const result = source.pipe(map(v => v * 2), filter(v => v > 10));
     * ```
     *
     * @see OperatorFunctionType
     * @since 1.0.0
     */

    pipe<R = ObservableService<T>>(...operators: Array<OperatorFunctionType>): R {
        if (operators.length === 0) {
            return this as unknown as R;
        }

        return <R> operators.reduce<ObservableService>(
            (prev, op) => op(prev),
            this as ObservableService
        );
    }

    /**
     * Normalizes subscribe arguments into an {@link ObserverInterface}.
     *
     * @param observerOrNext - A full observer object, or a `next` callback.
     * @param error - Error handler, used when the first argument is a `next` callback.
     * @param complete - Completion handler, used when the first argument is a `next` callback.
     * @returns The resolved observer.
     *
     * @remarks
     * Internal helper. Wraps a `next` callback into an observer, or returns the given observer as-is.
     *
     * @since 1.0.0
     */

    protected createSafeObserver(
        observerOrNext?: ObserverInterface<T> | NextType<T>,
        error?: ErrorType,
        complete?: CompleteType
    ): ObserverInterface<T> {
        return typeof observerOrNext === 'function'
            ? { next: observerOrNext, error, complete }
            : observerOrNext || {};
    }

    /**
     * Wraps a teardown into an idempotent, disposable unsubscribe function.
     *
     * @param teardown - Cleanup to run at most once when the subscription is torn down.
     * @returns An unsubscribe function that runs `teardown` once and implements {@link Disposable} via `Symbol.dispose`.
     *
     * @remarks
     * Internal helper. The returned function guards against repeated invocation, so the teardown runs only once and
     * exposes `Symbol.dispose` so the subscription can be bound with a `using` declaration and released automatically
     * when its enclosing scope exits.
     *
     * @since 1.1.0
     */

    protected toUnsubscribe(teardown: TeardownType): UnsubscribeType {
        let torn = false;
        const unsubscribe = ((): void => {
            if (torn) return;
            torn = true;

            teardown();
        }) as UnsubscribeType;

        unsubscribe[Symbol.dispose] = unsubscribe;

        return unsubscribe;
    }
}
