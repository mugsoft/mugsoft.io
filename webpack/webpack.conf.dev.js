const path = require("path");

const getHTMLFiles = require("./utils/get-html-files");
const parseFiles = require("./utils/parse-files");
const getJavascriptFiles = require("./utils/get-javascript-files");


const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractLESS = new ExtractTextPlugin('css/[name].css');

const config = {
	entry: {},
	output:
	{
		path: path.resolve(__dirname, "../out"),
		filename: 'js/[name].js',
		publicPath: '/',
		chunkFilename: 'js/[id].js'
	},
	mode: "development",
	devtool: 'source-map',
	watch: true,
	resolve:
	{
		extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less"]
	},
	module:
	{
		rules: [
		{
			test: /\.js?x$/,
			exclude: /(node_modules|bower_components)/,
			use:
			{
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
			use: [
			{
				loader: 'html-loader',
				options:
				{
					interpolate: true
				}
			}]
		},
		{ 
			test: /\.hbs$/, 
			loader: "handlebars-loader" ,
			query: { 
				helperDirs: [
					path.resolve(__dirname, "../client/helpers")
				],
				inlineRequires: '\/images\/'
			}
		},
		{
			test: /\.less$/,
			use: extractLESS.extract(
			{
				fallback: 'style-loader',
				use: [
				{
					loader: 'css-loader' // translates CSS into CommonJS
				},
				{
					loader: 'less-loader' // compiles Less to CSS
				}]
			})

		},
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(gif|png|jpe?g|svg)$/i,
			use: [
			{
				loader: 'file-loader',
				options:
				{
					name: "img/[name].[ext]"
				}
			}],
		}]
	},
	plugins: [
		new CleanWebpackPlugin([
			"*"
		],
		{
			root: path.resolve(__dirname, "../out"),
			dry: false,
			verbose: true
		}),
		extractLESS
	]
}

const clientFolder = path.resolve(__dirname, "../client/")

const htmlFiles = getHTMLFiles(clientFolder);
const parsedHTMLFiles = parseFiles(htmlFiles);

const jsFiles = getJavascriptFiles(parsedHTMLFiles);
const parsedJSFiles = parseFiles(jsFiles)

parsedJSFiles.forEach(jsFile =>
{
	config.entry[jsFile.name] = jsFile.dir + "/" + jsFile.base;
});

parsedHTMLFiles.forEach(htmlFile =>
{
	config.plugins.push(new HtmlWebpackPlugin(
	{
		template: htmlFile.dir + "/" + htmlFile.base,
		filename: path.resolve(__dirname, "../out/" + htmlFile.name + ".html"),
		chunks: [htmlFile.name],
		templateParameters:require('../_config.json'),
		inject: true,
		minify: false
	}));
})


module.exports = config;