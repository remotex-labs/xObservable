/**
 * Imports
 */

import { defineVersionedConfig } from '@viteplus/versions';

/**
 * Doc config
 */

export default defineVersionedConfig({
    title: 'xObservable',
    base: '/xObservable/',
    description: 'A lightweight observable implementation for TypeScript',
    head: [
        [ 'link', { rel: 'icon', type: 'image/png', href: '/xObservable/logo.png' }],
        [ 'meta', { name: 'theme-color', content: '#646cff' }]
    ],
    versionsConfig: {
        current: 'v1.1.x',
        versionSwitcher: {
            text: 'Version',
            includeCurrentVersion: true
        }
    },
    themeConfig: {
        logo: '/logo.png',

        search: {
            provider: 'local'
        },

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide' },
            {
                text: 'Core',
                items: [
                    { text: 'Observable', link: '/core/observable' },
                    { text: 'Subject', link: '/core/subject' },
                    { text: 'BehaviorSubject', link: '/core/behavior-subject' }
                ]
            },
            { text: 'Operators', link: '/operators/overview' },
            { component: 'VersionSwitcher' }
        ],

        sidebar: {
            root: [
                { text: 'Getting Started', link: '/guide' },
                { text: 'Release Notes', link: '/release' },
                {
                    text: 'Core',
                    collapsed: false,
                    items: [
                        { text: 'Observable', link: '/core/observable' },
                        { text: 'Subject', link: '/core/subject' },
                        { text: 'BehaviorSubject', link: '/core/behavior-subject' }
                    ]
                },
                {
                    text: 'Operators',
                    collapsed: false,
                    items: [{ text: 'Overview', link: '/operators/overview' }]
                },
                {
                    text: 'Guides',
                    collapsed: false,
                    items: [
                        { text: 'Piping & Composition', link: '/guides/piping' },
                        { text: 'Error Handling', link: '/guides/error-handling' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/remotex-labs/xObservable' },
            { icon: 'npm', link: 'https://www.npmjs.com/package/@remotex-labs/xobservable' }
        ],

        docFooter: {
            prev: true,
            next: true
        },
        footer: {
            message: 'Released under the Mozilla Public License 2.0',
            copyright: `Copyright © ${ new Date().getFullYear() } @remotex-labs/xObservable Contributors`
        }
    }
});
