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
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          mui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            name: 'vendor-mui',
            priority: 20,
            chunks: 'all'
          },
          stripe: {
            test: /[\\/]node_modules[\\/]@stripe[\\/]/,
            name: 'vendor-stripe',
            priority: 15,
            chunks: 'all'
          },
          xlsx: {
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            name: 'vendor-xlsx',
            priority: 15,
            chunks: 'all'
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all'
          }
        }
      }
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
    devServer: isDev ? buildDevServ(options) : undefined
  }
}
