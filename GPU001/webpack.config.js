const path = require('path');
const bundleOutputDir = './dist';

module.exports = {
    entry: {
        "main": "./src/main.ts"
    },
    output: {
        path: path.join(__dirname, bundleOutputDir),
        filename: '[name].bundle.js',
        publicPath: 'public/dist/'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: 'ts-loader'
            },
            {
                test: /\.js$/,
                include: /src/,
                use: 'babel-loader'
            }
        ]
    }
}