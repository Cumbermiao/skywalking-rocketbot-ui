## webpack5 升级

### 1. rk-icon 图标组件使用时 svg 图标不展示问题；

处理步骤： 使用命令查看 webpack 实际配置， 发现默认使用 `asset/resource` 处理 svg 文件；修改 webpack 配置如下修复该问题：
```js
{
  test: /\.svg$/,
  loader: 'svg-sprite-loader',
  options: {
    symbolId: '[name]'
  },
  type: 'javascript/auto'
}
```

### 2. `ScriptExternalLoadError: Loading script failed. (missing http://localhost:8090/remoteEntry.js)`

根因分析：vue.config.js 中配置了 splitChunks.chunks 为 `all`的分包策略导致的远程 app 的资源无法被加载。建议修改为 `async`,`initial`会导致打包体积较大。

### 3. 从 remote 的文件加载资源时，加载的域名为当前应用的域名。

处理步骤：设置 vue.config.js 中的 publicPath 为 `auto` 即可。