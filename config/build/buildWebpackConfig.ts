import webpack from 'webpack'
import { buildOptions } from './types/config'
import { buildLoaders } from './buildLoaders'
import { buildResolvers } from './buildResolvers'
import { buildPlugins } from './buildPlugins'
import { buildDevServ } from './buildDevServ'

export function buildWebpackConfig (options: buildOptions): webpack.Configuration {
  const { paths, mode, isDev } = options

  return {
    mode,
    entry: paths.entry,
    module: {
      rules: buildLoaders(options)
    },
    resolve: buildResolvers(options),
    output: {
      filename: '[name].[contenthash].js',
      path: paths.build,
      clean: true,
      publicPath: '/'
    },
    plugins: buildPlugins(options),
    devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
    devServer: isDev ? buildDevServ(options) : undefined
  }
}
