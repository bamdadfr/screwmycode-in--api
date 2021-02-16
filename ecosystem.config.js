module.exports = {
    'apps': [
        {
            'name': 'dev',
            'script': 'src/app.js',
            'instances': 1,
            'autorestart': true,
            'watch': true,
            'time': true,
            'env': {
                'NODE_ENV': 'development',
            },
        },
        {
            'name': 'production',
            'script': 'src/app.js',
            'instances': 1,
            'autorestart': true,
            'watch': false,
            'time': true,
            'env': {
                'NODE_ENV': 'production',
            },
        },
    ],
}
