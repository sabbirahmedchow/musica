const port = process.env.PORT || 5000;

module.exports = {
  transpileDependencies: ["vue"],
  devServer: {
    
    proxy: `http://localhost:${port}`,
   
  },
};




