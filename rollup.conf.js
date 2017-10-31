export default {
    input: 'dist/index.js',
    output: {
        file: 'bundles/angular-infinite-list.umd.js',
        format: 'umd'
    },
    external: [
        '@angular/core',
        '@angular/platform-browser',
        '@angular/common'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/platform-browser': 'ng.platform-browser',
        '@angular/common': 'ng.common'
    },
    name: 'angular-infinite-list'
}