---
layout: home
title: 'xObservable'
titleTemplate: 'A lightweight observable implementation for TypeScript'
hero:
    name: 'xObservable'
    text: 'Reactive streams for TypeScript'
    tagline: A small, dependency-free observable core with subjects and composable operators.
    actions:
        - theme: brand
          text: Get Started
          link: ./guide
        - theme: alt
          text: View on GitHub
          link: https://github.com/remotex-labs/xObservable
    image:
        src: /logo.png
        alt: 'xObservable logo'
features:
    - icon: 🌊
      title: Push-based streams
      details: Create an Observable from a handler that pushes values through next, error, and complete.
    - icon: 📡
      title: Multicast subjects
      details: A Subject is both an observable and an observer, sharing one emission sequence across all subscribers.
    - icon: 🧠
      title: Stateful BehaviorSubject
      details: Always holds a current value and replays it to every new subscriber on subscription.
    - icon: 🔗
      title: Composable operators
      details: Chain map, filter, distinctUntilChanged, and tap through a fully typed pipe.
    - icon: 🛡️
      title: Safe by default
      details: Handler and operator throws are routed to the observer's error handler instead of crashing the stream.
    - icon: 🪶
      title: Zero dependencies
      details: A tiny runtime with no external packages, shipped as both ESM and CommonJS.
---
