/**
 * Copyright (C) 2020. Drew Gauderman
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */

const path = require("path"),
	webpack = require('webpack'),
	TerserPlugin = require('terser-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	CopyPlugin = require('copy-webpack-plugin'),
	ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin'),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin')

const package = require('./package.json')
const packageName = package.name
const packageFolder = path.resolve(__dirname, packageName)
const isDevelopment = process.env.NODE_ENV !== "production"
const devUrl = 'localhost:8084'

const entries = {
	"public": path.resolve(__dirname, "react", "public", "index.tsx"),
	"private": path.resolve(__dirname, "react", "private", "index.tsx"),
}

const entry = isDevelopment ? (process.env.ENTRY ? {
	[process.env.ENTRY]: entries[process.env.ENTRY]
} : {
	"public": entries.public,
	"private": entries.private
}) : entries

console.log('webpack entry:', entry, "\n")

module.exports = {
	mode: isDevelopment ? 'development' : 'production',

	devtool: isDevelopment ? 'source-map' : false,

	watchOptions: {
		poll: 1000,
		aggregateTimeout: 600,
		ignored: ['**/site', '**/node_modules']
	},

	entry,

	output: {
		path: packageFolder,
		sourceMapFilename: '[file].map',
		filename: `assets/js/plugin-[name].min.js`,
		publicPath: `/wp-content/plugins/${packageName}/`,
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css', '.php'],
		modules: ['node_modules'],
	},

	devtool: isDevelopment ? 'source-map' : false,

	module: {
		noParse: [
			/[\/\\]node_modules[\/\\]jquery[\/\\]dist[\/\\]jquery\.min\.js$/
		],
		rules: [
			{
				test: /\.(t|j)sx?$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: true,
						},
					},
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(ttf|eot|otf|woff|png|svg|jpg|gif)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/img/[name].[ext]',
					esModule: false,
				},
			}
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			__VERSION__: JSON.stringify(package.version),
			process: {
				env: {
					NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production')
				}
			}
		}),

		// clean up dist folder
		!isDevelopment && new CleanWebpackPlugin(),

		// dump css into its own files
		new MiniCssExtractPlugin({
			filename: `assets/css/plugin-[name].min.css`,
		}),

		// dynamically change the plugin class name to the package name
		new ReplaceInFileWebpackPlugin([{
			dir: packageFolder,
			test: /\.php$/,
			rules: [
				{
					search: new RegExp(`wordpress_plugin`, 'g'),
					replace: packageName
				}
			]
		}]),

		// copy all existing code over
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "src"),
					to: './',
					globOptions: {
						// ignore these files
						ignore: ['**/private/**', '**/public/**', '**/scss/**', '**.scss', '**.psd']
					}
				}
			],
			options: {
				concurrency: 100
			}
		}),

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			'window.jQuery': 'jquery'
		})
	].filter(Boolean),

	externals: {
		$: 'jquery',
		jquery: 'jQuery'
	},

	optimization: {
		// runtimeChunk: 'single',
		minimize: !isDevelopment,
		minimizer: [
			// https://webpack.js.org/plugins/terser-webpack-plugin/
			!isDevelopment && new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		].filter(Boolean),
	},

	devServer: {
		compress: true,
		inline: true,
		port: 3000,
		writeToDisk: true,
		hot: true,
		proxy: {
			context: () => true,
			target: `http://${devUrl}/`,
		},
	},
}
