export default {
    input: 'dist/index.js',
    output: {
        name: 'angular-infinite-list',
        file: 'bundles/angular-infinite-list.umd.js',
        format: 'umd'
    },
    external: [
        '@angular/core',
        '@angular/platform-browser',
        '@angular/common',
        'rxjs/Subject'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/platform-browser': 'ng.platform-browser',
        '@angular/common': 'ng.common',
        "rxjs/Subject": "Rx"
    },
    name: 'angular-infinite-list'
}