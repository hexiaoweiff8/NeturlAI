import GameConfig from "./GameConfig";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded() {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded() {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}
}
//激活启动类
new Main();

let net = new convnetjs.Net();

// 创建网络结构
let layer_defs = [];
// 输入层 1x1x2
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
layer_defs.push({type:'fc', num_neurons:5, activation:'sigmoid'});
layer_defs.push({type:'regression', num_neurons:1});

// 全连接层 20节点, relu方式
// layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
// layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
// // softmax层 预测两种类型的概率:0和1
// layer_defs.push({type:'softmax', num_classes:2});
// 创建网络
net.makeLayers(layer_defs);

// 填充输入数值
let x = new convnetjs.Vol([0.5, -1.3]);

// 训练网络
// let trainer = new convnetjs.Trainer(net, {learn_rate:0.01, l2_decay:0.001});
let trainer = new convnetjs.SGDTrainer(net, {learn_rate:0.01, momentum:0.0, batch_size:1,l2_decay:0.001});
// 计算结果
let probability_volume = net.forward(x);
console.log(probability_volume.w[0]);
// for(let i = 0; i<100; i++){

// 	// 将网络结果向0训练
// 	trainer.train(x, 1);
// 	// 输出训练后结果
// 	probability_volume = net.forward(x);
// 	console.log(probability_volume.w[0]);
// }