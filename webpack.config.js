const TerserPlugin = require('terser-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	path = require("path"),
	webpack = require('webpack'),
	BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
	ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	CopyPlugin = require('copy-webpack-plugin'),
	RenameWebpackPlugin = require('rename-webpack-plugin'),
	ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin'),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'),
	WriteAssetsWebpackPlugin = require('write-assets-webpack-plugin')

const rootFolder = path.resolve(__dirname)
const sourceFolder = path.join(rootFolder, "src", "assets")
const prodDistOutputFoler = path.join(rootFolder, 'dist')

const entryPointPublic = path.join(sourceFolder, "public", "index.tsx")
const entryPointPrivate = path.join(sourceFolder, "private", "index.tsx")

const package = require('./package.json')
const packageName = package.name

module.exports = (env, options) => {
	const isDev = options.mode === 'development'
	console.log('isDev:', isDev)

	const babelLoader = {
		loader: 'babel-loader',
		options: {
			presets: [
				[
					"@babel/preset-env",
					{
						"targets": {
							"esmodules": false
						}
					}
				],
				"@babel/preset-react"
			],
			plugins: [isDev ? "react-refresh/babel" : false, "@babel/plugin-proposal-object-rest-spread"].filter(Boolean)
		}
	}

	return {
		devtool: isDev ? 'cheap-source-map' : false,

		entry: {
			public: entryPointPublic,
			private: entryPointPrivate
		},

		output: {
			path: prodDistOutputFoler,
			sourceMapFilename: '[file].map',
			filename: 'assets/js/plugin-[name].min.js',
			publicPath: '/wp-content/plugins/wordpress_plugin/',
		},

		resolve: {
			extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css', '.php'],
			modules: ['node_modules'],
		},

		devtool: isDev ? 'source-map' : false,

		plugins: [
			// clean up dist folder
			!isDev && new CleanWebpackPlugin(),

			// dump css into its own files
			new MiniCssExtractPlugin({
				filename: 'assets/css/plugin-[name].min.css',
			}),

			// plugin for React Hot Loader that keeps states for hooks
			isDev ? new ReactRefreshWebpackPlugin({
				disableRefreshCheck: true
			}) : false,

			// copy all existing code over
			new CopyPlugin([
				{ from: 'src', to: './', ignore: ['*/private/**', '*/public/**'] },
			]),

			// rename php files to match the plugin name
			packageName !== 'wordpress_plugin' ? new RenameWebpackPlugin({
				originNameReg: "wordpress_plugin.php",
				targetName: `${packageName}.php`
			}) : false,

			// dynamically change the plugin class name to the package name
			packageName !== 'wordpress_plugin' ? new ReplaceInFileWebpackPlugin([{
				dir: 'dist',
				test: /\.php$/,
				rules: [
					{
						search: /wordpress_plugin/g,
						replace: packageName
					}
				]
			}]) : false,

			// force devserver to write php files to disk
			isDev ? new WriteAssetsWebpackPlugin({ force: true, extension: ['php'] }) : false,

		].filter(Boolean),

		externals: {
			// jquery is loaded by WordPress
			jquery: 'jQuery'
		},

		optimization: {
			splitChunks: {
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.css$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
			minimize: !isDev,
			minimizer: [
				// https://webpack.js.org/plugins/terser-webpack-plugin/
				!isDev && new TerserPlugin({
					terserOptions: {
						output: {
							comments: false,
						},
					},
					extractComments: false,
				}),
			].filter(Boolean),
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						babelLoader,
						'ts-loader'
					]
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: babelLoader
				},
				{
					test: /\.html$/,
					use: 'html-loader'
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: isDev,
								esModule: true,
							},
						},
						'css-loader',
						'sass-loader'
					],
				}
			]
		},

		devServer: {
			hot: true,
			inline: true,
			port: 3000,
			proxy: {
				context: () => true,
				target: 'http://localhost:8084/',
			},
		},
	}
}