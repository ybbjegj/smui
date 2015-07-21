var uglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
module.exports = [{
    entry: './src/ui',
    output: {
        path: './dist',
        filename: 'smui.js',
        library: 'smui',
        libraryTarget: 'umd'
    },
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    devtool: '#source-map'
}, {
    entry: './src/ui',
    output: {
        path: './dist',
        filename: 'smui.debug.js',
        library: 'smui',
        libraryTarget: 'umd'
    },
    devtool: '#source-map'

}]