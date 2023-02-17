// 写法1: 在configureWebpack配置externals 
module.exports = {
  lintOnSave: false,
  // configureWebpack 值为对象，会通过 webpack-merge 合并到最终的配置
  // configureWebpack: {
  //     externals: {
  //         // CDN 的 Element 依赖全局变量 Vue， 所以 Vue 也需要使用 CDN 引入
  //         'vue': 'Vue',
  //         // 属性名称 element-ui, 表示遇到 import xxx from 'element-ui' 这类引入 'element-ui'的，
  //         // 不去 node_modules 中找，而是去找 全局变量 ELEMENT
  //         'element-ui': 'ELEMENT'
  //     }
  // }
}

// 写法2：在configureWebpack配置externals
// module.exports = {
//   // configureWebpack 值为函数，参数 config (被解析的配置)，可直接赋值修改
//   configureWebpack: config => {
//       config.externals = {
//         'vue': 'Vue',
//         'element-ui': 'ELEMENT'
//       }
//   }
// }

// 写法3：在 chainWebpack 配置 externals. 注意：不要写成 config.externals = {...}
// module.exports = {
//   // chainWebpack 只能是函数，参数 config(基于 webpack-chain 的 ChainableConfig 实例)
//   chainWebpack: config => {
//       config.externals({
//           'vue': 'Vue',
//           'element-ui': 'ELEMENT'
//       })
//   }
// }