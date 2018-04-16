module.exports = {
  type: 'web-app',
  devServer: {
      disableHostCheck: true
  },
  webpack: {
      define: {
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        },
      extra: {
              module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          }
        ]
    }
      }
  }
}
