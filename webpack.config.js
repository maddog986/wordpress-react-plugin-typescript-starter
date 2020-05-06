const path = require("path"),
	webpack = require('webpack'),
	TerserPlugin = require('terser-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'),
	CopyPlugin = require('copy-webpack-plugin'),
	RenameWebpackPlugin = require('rename-webpack-plugin'),
	ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin'),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'),
	WriteAssetsWebpackPlugin = require('write-assets-webpack-plugin')

const package = require('./package.json')
const packageName = package.name

const isDev = process.env.NODE_ENV === "development"

module.exports = {
	mode: isDev ? 'development' : 'production',

	devtool: isDev ? 'source-map' : false,

	entry: {
		public: path.resolve(__dirname, "src", "assets", "public", "index.tsx"),
		private: path.resolve(__dirname, "src", "assets", "private", "index.tsx")
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
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
		isDev && new ReactRefreshWebpackPlugin({
			disableRefreshCheck: true
		}),

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

		// force dev-server to write php files to disk when developing
		isDev && new WriteAssetsWebpackPlugin({ force: true, extension: ['php'] }),

	].filter(Boolean),

	externals: {
		// jquery is loaded by WordPress
		jquery: 'jQuery'
	},

	optimization: {
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
				use: 'babel-loader',
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