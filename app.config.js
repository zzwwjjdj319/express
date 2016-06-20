// 全局的应用参数配置

var appCfg = {};

// 全局的文件根目录
appCfg.dir_root = __dirname;

// 导出的appCfg对象为只读
module.exports = Object.freeze(appCfg);
