const path = require("path");

const getHTMLFiles = require("./utils/get-html-files");
const parseFiles = require("./utils/parse-files");
const getJavascriptFiles = require("./utils/get-javascript-files");


const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


const extractLESS = new ExtractTextPlugin('css/[name].[hash].css');

const config = {
	entry: {},
	output: {
		path: path.resolve(__dirname, "../out"),
		filename: 'js/[name].[hash].js',
		publicPath: '/',
		chunkFilename: 'js/[id].[hash].js'
	},
	mode: "production",
	devtool: 'none',
	watch: false,
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less"]
	},
	optimization: {
		minimizer: [new TerserPlugin()],
	},
	module: {
		rules: [{
				test: /\.js?x$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {}
				}
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			},
			{
				test: /\.html$/,
				use: [{
					loader: 'html-loader',
					options: {
						interpolate: true
					}
				}]
			},
			{ 
				test: /\.hbs$/, 
				loader: "handlebars-loader",
				query: { 
					helperDirs: [
						path.resolve(__dirname, "../client/helpers")
					],
					inlineRequires: '\/images\/'
				}
			},
			{
				test: /\.less$/,
				use: extractLESS.extract({
					fallback: 'style-loader',
					use: [{
							loader: 'css-loader' // translates CSS into CommonJS
						},
						{
							loader: 'less-loader' // compiles Less to CSS
						}
					]
				})

			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [{
					loader: 'file-loader',
					options: {
						name: "img/[name].[hash].[ext]"
					}
				}],
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin([
			"*"
		], {
			root: path.resolve(__dirname, "../out"),
			dry: false,
			verbose: true
		}),
		extractLESS,
	]
}

const clientFolder = path.resolve(__dirname, "../client/")

const htmlFiles = getHTMLFiles(clientFolder);
const parsedHTMLFiles = parseFiles(htmlFiles);

const jsFiles = getJavascriptFiles(parsedHTMLFiles);
const parsedJSFiles = parseFiles(jsFiles)

parsedJSFiles.forEach(jsFile => {
	config.entry[jsFile.name] = jsFile.dir + "/" + jsFile.base;
});

parsedHTMLFiles.forEach(htmlFile => {
	const html = new HtmlWebpackPlugin({
		template: htmlFile.dir + "/" + htmlFile.base,
		filename: path.resolve(__dirname, "../out/" + htmlFile.name + ".html"),
		chunks: [htmlFile.name],
		inject: true,
		minify: true,
		templateParameters:require('../_config.json'),
		inlineSource: '.(js|css|ts)$'
	})
	config.plugins.push(html)
	config.plugins.push(new HtmlWebpackInlineSourcePlugin())
})


module.exports = config;