"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ThreeStranaService = void 0;
var core_1 = require("@angular/core");
var THREE = require("three");
var ThreeStranaService = /** @class */ (function () {
    function ThreeStranaService(node, soil, strana, scene) {
        this.node = node;
        this.soil = soil;
        this.strana = strana;
        this.scene = scene;
        this.AllStranaList = this.soil.AllStranaList;
    }
    // 表示ケースを変更する
    ThreeStranaService.prototype.changeData = function (row, index) {
        if (index === void 0) { index = this.soil.currentIndex; }
        // soilとcurrentIndexを共有する。または、changeNodeから得る
        this.currentIndex = index;
        var nodeData = this.node.getNodeJson(0);
        if (Object.keys(nodeData).length <= 0) {
            return;
        }
        var stranaData = this.strana.getOrganizationJson(0, this.currentIndex);
        this.changeStrana(row, stranaData[this.currentIndex], nodeData);
        this.scene.render();
        return;
    };
    ThreeStranaService.prototype.resetData = function () {
        this.organizationList = this.strana.getOrganizationJson(0);
        for (var i = 1; i <= Object.keys(this.organizationList).length; i++) {
            this.currentIndex = i.toString();
            var row = Object.keys(this.organizationList[i]).length;
            this.soil.changeCase(i);
            for (var j = 1; j <= row; j++) {
                this.changeData(j, this.currentIndex);
            }
            // this.changeData()
        }
        // this.soil.currentIndexを1に戻すために実行
        this.soil.changeCase(1);
    };
    // ケースを追加する
    // private addCase(id: string): void {
    //   const ThreeObject = new THREE.Object3D();
    //   ThreeObject.name = id;
    //   ThreeObject.visible = false; // ファイルを読んだ時点では、全ケース非表示
    //   this.AllStranaList[id] = {
    //     ThreeObject,
    //     pointLoadList: {},
    //     memberLoadList: {},
    //     pMax: 0, // 最も大きい集中荷重値
    //     mMax: 0, // 最も大きいモーメント
    //     wMax: 0, // 最も大きい分布荷重
    //     rMax: 0, // 最も大きいねじり分布荷重
    //     qMax: 0  // 最も大きい軸方向分布荷重
    //   };
    //   this.scene.add(ThreeObject); // シーンに追加
    // }
    ThreeStranaService.prototype.changeStrana = function (row, stranaData, nodeData) {
        var ThreeObject = this.AllStranaList[this.currentIndex].ThreeObject;
        if (ThreeObject.children.length >= 1) {
            while (ThreeObject.children.length > 0) {
                var object = ThreeObject.children[0];
                object.parent.remove(object);
            }
        }
        this.AllStranaList[this.currentIndex].verticeList = [];
        if (stranaData === undefined) {
            return;
        }
        var verticeList = [];
        for (var _i = 0, _a = Object.keys(stranaData); _i < _a.length; _i++) {
            var id = _a[_i];
            var data = stranaData[id];
            if (data.nodeNum === '') {
                continue;
            }
            var node = data.nodeNum;
            var point = nodeData[node];
            if (point === undefined) {
                continue;
            }
            verticeList.push(point);
        }
        if (verticeList.length <= 2)
            return;
        this.AllStranaList[this.currentIndex].verticeList = verticeList;
        this.create(verticeList, ThreeObject);
        // 地表面の座標を獲得する
        this.groundLinear = this.getGroundLinear();
    };
    ThreeStranaService.prototype.create = function (vertice, ThreeObject) {
        var stranaShape = new THREE.Shape();
        stranaShape.moveTo(0, 0);
        for (var num = 1; num < vertice.length; num++) {
            stranaShape.lineTo(vertice[num].x - vertice[0].x, vertice[num].y - vertice[0].y);
        }
        //const geometry = new THREE.ShapeGeometry(stranaShape);
        var extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false
        };
        var geometry = new THREE.ExtrudeGeometry(stranaShape, extrudeSettings);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        if (this.currentIndex === '2') {
            material = new THREE.MeshBasicMaterial({ color: 0x00af30 });
        }
        else if (this.currentIndex === '3') {
            material = new THREE.MeshBasicMaterial({ color: 0x006f60 });
        }
        else if (this.currentIndex === '4') {
            material = new THREE.MeshBasicMaterial({ color: 0x003f90 });
        }
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(vertice[0].x, vertice[0].y, 0.0);
        mesh['memo'] = { position: { x: vertice[0].x, y: vertice[0].y } };
        ThreeObject.add(mesh);
        // ここで当たり判定を行う
        this.detectJudge(mesh, ThreeObject);
    };
    // ケースの荷重図を消去する
    ThreeStranaService.prototype.removeCase = function (id) {
        if (!(id in this.AllStranaList)) {
            return;
        }
        var data = this.AllStranaList[id];
        //this.removeMemberLoadList(data);
        //this.removePointLoadList(data);
        var ThreeObject = data.ThreeObject;
        this.scene.remove(ThreeObject);
        delete this.AllStranaList[id];
        this.scene.render();
    };
    // 節点の入力が変更された場合 新しい入力データを保持しておく
    ThreeStranaService.prototype.changeNode = function (jsonData) {
        //this.newNodeData = jsonData;
        for (var _i = 0, _a = Object.keys(this.AllStranaList); _i < _a.length; _i++) {
            var targetID = _a[_i];
            var target = this.AllStranaList[targetID];
            if (target.ThreeObject.children.length < 1) {
                continue;
            }
            this.changeData(0, targetID);
        }
    };
    // 当たり判定を行う
    ThreeStranaService.prototype.detectJudge = function (mesh, ThreeObject) {
        this.scene.render(); // 当たり判定をするため、一度描画する
        var judge = false; // 最終的な当たり判定
        var verticeList = this.AllStranaList[this.currentIndex].verticeList;
        // 対象のオブジェクトをdetectedObjectsにまとめる
        var detectedObjects = new Array();
        for (var _i = 0, _a = Object.keys(this.AllStranaList); _i < _a.length; _i++) {
            var id = _a[_i];
            var target = this.AllStranaList[id].ThreeObject.children[0];
            if (target !== undefined) {
                detectedObjects.push(target);
            }
        }
        if (detectedObjects.length < 2) {
            return; // 既存のobjectがなければスルー
        }
        for (var _b = 0, verticeList_1 = verticeList; _b < verticeList_1.length; _b++) {
            var vertice = verticeList_1[_b];
            var pointjudge = false;
            // 点の中心付近の点が他のオブジェクトに当たっているか確認
            // 全て当たっていれば、オブジェクト当たり判定はtrue(当たっている)
            // 一つでも当たっていなければ、オブジェクト当たり判定はfalse(当たっていない)
            for (var i = 0; i < 8; i++) {
                var delta = Math.PI / 4 * i + 0.0001; // 0.0001は角度微調整用の定数(Math.atan(1/10000))
                var delta_x = 0.0001 * Math.cos(delta);
                var delta_y = 0.0001 * Math.sin(delta);
                // 当たり判定用の光線を作成
                var TopPos = new THREE.Vector3(vertice.x + delta_x, vertice.y + delta_y, 255);
                var downVect = new THREE.Vector3(0, 0, -1);
                var ray = new THREE.Raycaster(TopPos, downVect.normalize());
                // 当たったobjectを検出する
                var objs = ray.intersectObjects(detectedObjects, true);
                if (objs.length >= 2) { //自身と既存のオブジェクトが検出されたら当たっているとみなす
                    // ここで既存のオブジェクトが2重に検出されている可能性有（バグ）
                    pointjudge = true;
                    break;
                }
            }
            // 全てのpointjudgeがfalse(全ての点で当たっていない)であれば、何もしない。
            // pointjudgeが一つでもtrueであれば、何かする。 
            if (pointjudge) {
                //当たり判定の結果trueを受けて、何かする判定をする。そのためのフラグを作る
                judge = true;
                break;
            }
        }
        if (judge) { // 当たっているので何かする。
            var message = mesh.parent.name + '番の地層が不適切に作成されました';
            mesh.material.color.r = 1.00;
            alert(message);
        }
    };
    // 地表面データの1次式を回収
    ThreeStranaService.prototype.getGroundLinear = function () {
        var GroundLinear = {};
        // const temp_GroundLinear = {};
        var max_x = -65535;
        var min_x = 65535;
        var detectedObjects = [];
        for (var _i = 0, _a = Object.keys(this.AllStranaList); _i < _a.length; _i++) {
            var id = _a[_i];
            // 地表面の左端と右端を調べる
            var verticeList = this.AllStranaList[id].verticeList;
            for (var _b = 0, verticeList_2 = verticeList; _b < verticeList_2.length; _b++) {
                var node = verticeList_2[_b];
                max_x = Math.max(max_x, node.x);
                min_x = Math.min(min_x, node.x);
            }
            // 同時に当たり判定のobjectを回収する
            var ThreeObject = this.AllStranaList[id].ThreeObject;
            detectedObjects.push(ThreeObject);
        }
        for (var x = min_x; x <= max_x; x += 0.1) {
            x = Math.round(x * 10) / 10;
            // 当たり判定用の光線を作成
            var TopPos = new THREE.Vector3(x, 65535, 0.0);
            var downVect = new THREE.Vector3(0, -1, 0);
            var ray = new THREE.Raycaster(TopPos, downVect.normalize());
            // 当たったobjectを検出する
            var objs = ray.intersectObjects(detectedObjects, true);
            var min_distance = objs[0].distance;
            for (var num = 0; num < objs.length; num++) {
                min_distance = Math.min(min_distance, objs[num].distance);
            }
            var y = 65535 - min_distance;
            GroundLinear[x.toString()] = new THREE.Vector2(x, y);
        }
        return GroundLinear;
    };
    ThreeStranaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ThreeStranaService);
    return ThreeStranaService;
}());
exports.ThreeStranaService = ThreeStranaService;
