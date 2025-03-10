import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'

const isProd = process.env['NODE_ENV'] === 'production'

const sharedRules = [
    {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
        options: {
            configFile: 'tsconfig.json',
        },
    },
    // {
    //     test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
    //     type: 'asset',
    // }
]

const sharedGlobalCssRule = {
    test: /\.css$/i,
    include: /\.global\.css$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                modules: false,
                url: false,
            },
        },
    ],
}

const localIdentName = '[name]-[local]-[hash:base64:5]'

const clientCssModulesRule = {
    test: /\.css$/i,
    exclude: /\.global\.css$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                modules: {
                    mode: 'local',
                    localIdentName,
                    namedExport: false,
                },
                url: false,
            },
        },
    ],
}

const serverCssModulesRule = {
    test: /\.css$/i,
    exclude: /\.global\.css$/,
    use: [
        {
            loader: 'css-loader',
            options: {
                modules: {
                    mode: 'local',
                    localIdentName,
                    namedExport: false,
                    exportOnlyLocals: true,
                },
            },
        },
    ],
}

export default [
    {
        entry: './src/client/main.tsx',
        devtool: isProd ? false : 'source-map',
        output: {
            path: path.resolve(import.meta.dirname, 'build/client'),
            publicPath: '/static',
            clean: true,
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new WebpackManifestPlugin(),
            /**
             * NOTE: This omits all loader modules from the client bundle.
             */
            new webpack.NormalModuleReplacementPlugin(
                /.*\.loader\.ts$/, //
                path.resolve(import.meta.dirname, 'null.ts'),
            ),
        ],
        module: {
            rules: [...sharedRules, clientCssModulesRule, sharedGlobalCssRule],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
    },
    {
        entry: './src/server/main.tsx',
        devtool: isProd ? 'source-map' : 'eval-source-map',
        // skip bundling `node_modules` using `webpack-node-externals`
        externalsPresets: { node: true },
        externals: [
            nodeExternals({
                // this is a monorepo, with deps in project root's
                // rely on this package's `package.json` instead of the contents of local `node_modules
                modulesFromFile: true,
            }),
        ],
        // make `__dirname` available
        context: path.resolve(import.meta.dirname),
        node: {
            __dirname: true,
        },
        output: {
            path: path.resolve(import.meta.dirname, 'build/server'),
            publicPath: '',
            clean: true,
        },
        plugins: [new MiniCssExtractPlugin()],
        module: {
            rules: [...sharedRules, serverCssModulesRule, sharedGlobalCssRule],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
    },
]
