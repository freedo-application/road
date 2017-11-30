var FreeDoTool=FreeDoTool||{};

///////////////////////////数学计算函数
/**
 * [lonLatHeightMinMax 计算经纬高中对应的最大最小值]
 * @param  {[{lon:1,lat:1,height:1}]} positions [经纬高对象数组]
 * @return {[type]}           [结果对象]
 */
FreeDoTool.lonLatHeightMinMax=function(positions){
	//计算最大最小值
	var min={},max={};
	var minLon=minLat=minHeight=Number.MAX_VALUE;
	var maxLon=maxLat=maxHeight=Number.MIN_VALUE;
    var position=null;

		for(var i=0;i<positions.length;i++){
			position=positions[i];

			if(position.lon<minLon)
				minLon=position.lon;
			if(position.lat<minLat)
				minLat=position.lat;
			if(position.height<minHeight)
				minHeight=position.height;

			if(position.lon>maxLon)
				maxLon=position.lon;
			if(position.lat>maxLat)
				maxLat=position.lat;
			if(position.height>maxHeight)
				maxHeight=position.height;
		}

	return minMax= {
			minLon:minLon,
			minLat:minLat,
			minHeight:minHeight,
			maxLon:maxLon,
			maxLat:maxLat,
			maxHeight:maxHeight
		}
}

/**
 * [doublecartesian3Distance 计算两点距离]
 * @param  {[type]} cartesian3A [点A]
 * @param  {[type]} cartesian3B [点B]
 * @return {[type]}             [距离]
 */
FreeDoTool.doubleCartesian3Distance=function(cartesian3A,cartesian3B){
	return Math.sqrt(Math.pow(cartesian3A.x-cartesian3B.x,2)+Math.pow(cartesian3A.y-cartesian3B.y,2)+Math.pow(cartesian3A.z-cartesian3B.z,2));
}


/**
 * [getXYByAddDegree 获得二维坐标系中转换角度后的新x,y]
 * @param  {[type]} x           [x坐标]
 * @param  {[type]} y           [y坐标]
 * @param  {[type]} delatDegree [角度增量，角度制]
 * @return {[type]}             [description]
 */
FreeDoTool.getXYByAddDegree=function(x,y,delatDegree){
	 var oldRadians;
	 if(x==0&&y>0)
	 	oldRadians=FreeDo.Math.toRadians(90);
	 else if(x==0&&y<0)
	 	oldRadians=FreeDo.Math.toRadians(-90);
	 else if(y==0&&x>0)
	 	oldRadians=FreeDo.Math.toRadians(0);
	 else if(y==0&&x<0)
	 	oldRadians=FreeDo.Math.toRadians(180);
	 else
	 	oldRadians=Math.atan(x/y);

	 var length=Math.sqrt(x*x+y*y);

	 var newRadians=oldRadians+FreeDo.Math.toRadians(delatDegree);

	 var newX=Math.sin(newRadians)*length;
	 var newY=Math.cos(newRadians)*length;

	 return {
	 	x:newX,
	 	y:newY
	 }
}



///////////////////////////位置姿态缩放变换函数
/**
 * [resetPositionOrientation 改变entity的位置姿态]
 * @param  {[type]} entity  [实体对象]
 * @param  {[type]} lon     [经度]
 * @param  {[type]} lat     [纬度]
 * @param  {[type]} height  [高]
 * @param  {[type]} heading [description]
 * @param  {[type]} pitch   [俯仰角]
 * @param  {[type]} roll    [旋转]
 * @return {[type]}         [void]
 */
FreeDoTool.entityResetPositionOrientation=function(entity,lon,lat,height,heading,pitch,roll)
{

	var position=FreeDo.Cartesian3.fromDegrees(lon,lat,height);

	var radHeading=FreeDo.Math.toRadians(heading);
	var radPitch=FreeDo.Math.toRadians(pitch);
	var radRoll=FreeDo.Math.toRadians(roll);

	var hpr=FreeDo.HeadingPitchRoll(radHeading,radPitch,radRoll);

	var orientation=FreeDo.Transforms.headingPitchRollQuaternion(position,hpr);

	entity.position=position;
	entity.orientation=orientation;
}

/**
 * [getModelMatrix 根据经纬高,姿态,缩放,创建对象的modelMatrix]
 * @param  {[type]} lon     [经度]
 * @param  {[type]} lat     [纬度]
 * @param  {[type]} height  [高度]
 * @param  {[type]} heading [转向角]
 * @param  {[type]} pitch   [俯仰角]
 * @param  {[type]} roll    [旋转]
 * @param  {[type]} scaleX  [X轴缩放系数 number]
 * @param  {[type]} scaleY  [Y轴缩放系数 number]
 * @param  {[type]} scaleZ  [Z轴缩放系数 number]
 * @return {[type]}         [modelMatrix]
 */
FreeDoTool.getModelMatrix=function(lon,lat,height,heading,pitch,roll,scaleX,scaleY,scaleZ)
{
		var scaleCartesian3=new FreeDo.Cartesian3(scaleX,scaleY,scaleZ); //获得三元素，直接通过数字获得
		var scaleMatrix=FreeDo.Matrix4.fromScale(scaleCartesian3);//获得缩放矩阵

		var position = FreeDo.Cartesian3.fromDegrees(lon,lat,height);//根据经纬高获得位置三元素

		var heading=FreeDo.Math.toRadians(heading);
		var pitch=FreeDo.Math.toRadians(pitch);
		var roll=FreeDo.Math.toRadians(roll);
		var hpr=new FreeDo.HeadingPitchRoll(heading,pitch,roll);
		var transform=FreeDo.Transforms.headingPitchRollToFixedFrame(position,hpr);//获得姿态矩阵

		var matrix4=new FreeDo.Matrix4();

		FreeDo.Matrix4.multiply(transform,scaleMatrix,matrix4);
		
		return matrix4;
}

/**
 * [entityResetPositionOrientationScale 重置模型的位置姿态缩放]
 * @param   {[primitive]} model [模型对象]
 * @param  {[type]} lon     [经度]
 * @param  {[type]} lat     [纬度]
 * @param  {[type]} height  [高度]
 * @param  {[type]} heading [转向角]
 * @param  {[type]} pitch   [俯仰角]
 * @param  {[type]} roll    [旋转]
 * @param  {[type]} scaleX  [X轴缩放系数 number]
 * @param  {[type]} scaleY  [Y轴缩放系数 number]
 * @param  {[type]} scaleZ  [Z轴缩放系数 number]
 * @return {[type]}         [void]
 */
FreeDoTool.primitiveResetPositionOrientationScale=function(model,lon,lat,height,heading,pitch,roll,scaleX,scaleY,scaleZ)
{
		var matrix4=this.getModelMatrix(lon,lat,height,heading,pitch,roll,scaleX,scaleY,scaleZ);
		model.modelMatrix=matrix4;
}


/**
 * [modelsChangePosition 计算多模型旋转后的位置和方向角]
 * @param  {[{lon:1,lat,1,height:1,heading:1}]}  positionHeadings [代表模型经纬高方向角的数组]
 * @param  {[type]} dHeading         [方向角的变更值]
 * @return {[{lon:1,lat,1,height:1}]}                  [模型新的位置方向角的数组]
 */
FreeDoTool.modelsChangePosition=function(positionHeadings,dHeading){
	//计算几何中心点
	var minMax=this.lonLatHeightMinMax(positionHeadings);
	var avgPosition={
		lon:(minMax.minLon+minMax.maxLon)/2,
		lat:(minMax.minLat+minMax.maxLat)/2,
		height:(minMax.minHeight+minMax.maxHeight)/2
	};

	//计算中心点处经纬放心比例
	var cartesian3A=FreeDo.Cartesian3.fromDegrees(avgPosition.lon-0.5,avgPosition.lat,avgPosition.height);
	var cartesian3B=FreeDo.Cartesian3.fromDegrees(avgPosition.lon+0.5,avgPosition.lat,avgPosition.height);
		//单位经度对应米
	var lengthLon=this.doubleCartesian3Distance(cartesian3A,cartesian3B);

		cartesian3A=FreeDo.Cartesian3.fromDegrees(avgPosition.lon,avgPosition.lat-0.5,avgPosition.height);
		cartesian3B=FreeDo.Cartesian3.fromDegrees(avgPosition.lon,avgPosition.lat+0.5,avgPosition.height);
		//单位纬度对应米
	var lengthLat=this.doubleCartesian3Distance(cartesian3A,cartesian3B);

	//计算新坐标系下的经纬值对应的x,y值并根据dHeading计算出新的x,y和对应的三维坐标
	var changePositionsHeadings=[];

	for(var i=0;i<positionHeadings.length;i++){
		var oldPosition=positionHeadings[i];//代表原经纬高
		var newPosition={};//代表二维坐标系内的x,y
		var changePosition;//代表二维坐标系内角度转换后的x,y

		newPosition.x=(oldPosition.lon-avgPosition.lon)*lengthLon;
		newPosition.y=(oldPosition.lat-avgPosition.lat)*lengthLat;
		newPosition.z=oldPosition.height-avgPosition.height;

		changePosition=this.getXYByAddDegree(newPosition.x,newPosition.y,dHeading);
		changePosition.height=newPosition.z;

		changePosition.lon=changePosition.x/lengthLon+avgPosition.lon;
		changePosition.lat=changePosition.y/lengthLat+avgPosition.lat;


		changePositionsHeadings.push(changePosition);
	}

	return changePositionsHeadings
}



///////////////////////////飞行函数
/**
 * [flyToModel 使相机飞到对应的模型处]
 * @param  {[type]} camera [相机 scene.camera]
 * @param  {[type]} model  [模型]
 * @return {[type]}        [void]
 */
FreeDoTool.flyToModel=function(camera,model)
{
	var center=new FreeDo.Cartesian3();
	FreeDo.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center,center);

	var boundingSphere=new FreeDo.BoundingSphere(center,model.boundingSphere.radius);

	camera.flyToBoundingSphere(boundingSphere,
	{
		duration:1,
		offset:new FreeDo.HeadingPitchRange(camera.heading,camera.pitch)
	});
}

/**
 * [flyToModels 多模型飞行]
 * 1.根据传入的模型数组计算出lon(min/max),lat(min/max),height(min/max)
 * 2.由三个最大最小值计算出对应的几何平均值avgLon=(lonMin+lonMax)/2,avgLat=(latMin+latMax)/2,avgHeight=(heightMin+heightMax)/2
 * 3.将中心点坐标系和最大经纬高组成的点坐标转换成直角坐标系中的向量
 * 4.计算出由步奏3得出的两点的距离r=sqrt(pow((x1-x2),2)+pow((y1-y2),2)+pow((z1-z2),2));
 * 5.根据r和几何中心点算出一个包围球，飞到这个包围球
 * @param  {[type]} camera [description]
 * @param  {[type]} positions [经纬高数组：[{lon:1,lat:1,height:1},{lon:2,lat:2,height:2}]]
 * @return {[type]}        [description]
 */
FreeDoTool.flyToModels=function(camera,positions,callback)
{
	var minMax=this.lonLatHeightMinMax(positions);
	//得到几何平均值
	var avgPosition={
		lon:(minMax.minLon+minMax.maxLon)/2,
		lat:(minMax.minLat+minMax.maxLat)/2,
		height:(minMax.minHeight+minMax.maxHeight)/2
	}

	//转换成对应的向量
	var maxCartesian3=FreeDo.Cartesian3.fromDegrees(minMax.maxLon,minMax.maxLat,minMax.maxHeight);
	var avgCartesian3=FreeDo.Cartesian3.fromDegrees(avgPosition.lon,avgPosition.lat,avgPosition.height);
	
	//计算向量距离
	var distance=this.doubleCartesian3Distance(maxCartesian3,avgCartesian3);

	// 设置半径的最小值
	if (distance < 20 ){
		distance = 20;
		distance *= 2.0;
	}

	//计算包围球
	var boundingSphere=new FreeDo.BoundingSphere(avgCartesian3,distance);
	
	//飞
	camera.flyToBoundingSphere(boundingSphere,
	{
		duration:2,
		offset:new FreeDo.HeadingPitchRange(camera.heading,camera.pitch),
		complete: function(){
			callback();
		}
	});
};

/**
 * [jumpToModel 使相机跳到对应的模型处]
 * @param  {[type]} camera [相机 scene.camera]
 * @param  {[type]} model  [模型]
 * @return {[type]}        [void]
 */
FreeDoTool.jumpToModel=function(camera,model)
{
	var center=new FreeDo.Cartesian3();
	FreeDo.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center,center);

	var boundingSphere=new FreeDo.BoundingSphere(center,model.boundingSphere.radius);

	camera.flyToBoundingSphere(boundingSphere,
	{
		duration:0.1,
		offset:new FreeDo.HeadingPitchRange(camera.heading,camera.pitch)
	});
};


///////////////////////////鼠标事件函数
/**
 * [initDoubleClick 初始化页面双击事件]
 * @param  {[type]}   viewer   [页面场景]
 * @param  {Function} callback [点击事件回调函数,注入所点击的object对象或者为undefined]
 * @return {[type]}            [void]
 */
FreeDoTool.initDoubleClick=function(viewer,callback)
{
	var screenSpaceEventHandler = new FreeDo.ScreenSpaceEventHandler(viewer.canvas);

	screenSpaceEventHandler.setInputAction(function(movement){
		var picked = viewer.scene.pick(movement.position);
		callback.call(window,picked);
	}, FreeDo.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

};


///////////////////////////模型外观函数
/**
 * [showModel 显示模型]
 * @param  {[type]} primitive [primitive对象]
 * @return {[type]}           [description]
 */
FreeDoTool.showModel=function(primitive){
	primitive.show=true;
};
/**
 * [hideModel 隐藏模型]
 * @param  {[type]} primitive [primitive对象]
 * @return {[type]}           [description]
 */
FreeDoTool.hideModel=function(primitive){
	primitive.show=false;
};
/**
 * [toggleModel 切换显示隐藏状态]
 * @param  {[type]} primitive [description]
 * @return {[type]}           [description]
 */
FreeDoTool.toggleModel=function(primitive){
	primitive.show=!primitive.show;
}
/**
 * [changeColor 修改模型颜色]
 * @param  {[type]} primitive [description]
 * @param  {[type]} red       [description]
 * @param  {[type]} green     [description]
 * @param  {[type]} blue      [description]
 * @param  {[type]} alpha     [description]
 * @return {[type]}           [description]
 */
FreeDoTool.changeColor=function(primitive,red,green,blue,alpha){
	primitive.color=new FreeDo.Color(red,green,blue,alpha);
}
///////////////////////////自定义Geometry用到的函数
/**
 * 地理坐标转世界坐标
 * @param {*地理坐标} HPRArray 
 */
FreeDoTool.TransfPointToCartesian3 = function (HPRArray) {
  var cartesianarray = []
  for (let i = 0; i < HPRArray.length; i++) {
    cartesianarray[i] = FreeDo.Cartesian3.fromDegrees(HPRArray[i].lon, HPRArray[i].lat, HPRArray[i].height)
  }
  return cartesianarray
}

/**
 *世界坐标转换自身坐标  
 * @param {*要进行转换的世界坐标} cartesianarray 
 * @param {*原点} o 
 */
var o = new FreeDo.Cartesian3()
FreeDoTool.TransfCartesian3ToSelf = function (cartesianarray) {
  var array = []
  for (var i = 0; i < cartesianarray.length; i++) {
    array[i] = new FreeDo.Cartesian3(cartesianarray[i].x - o.x, cartesianarray[i].y - o.y, cartesianarray[i].z - o.z)
  }
  return array
}

/**
 * n个点拓宽后得到的2n个点
 * @param {*地理坐标（经度、纬度、高度）} HPRArray 
 * @param {*道路中心到路边的距离} width 
 */
FreeDoTool.getPointArray = function (cartesians, relarray, width) {

  // 第一点第二点构成的向量
  var xl1 = new FreeDo.Cartesian3()
  // 第二点第三点构成的向量
  var xl2 = new FreeDo.Cartesian3()
  // 两个法向量
  var f1 = new FreeDo.Cartesian3()
  var f2 = new FreeDo.Cartesian3()
  // 两个单位法向量
  var normalxl1 = new FreeDo.Cartesian3()
  var normalxl2 = new FreeDo.Cartesian3()
  // 合向量
  var addxl1 = new FreeDo.Cartesian3()
  var addxl2 = new FreeDo.Cartesian3()
  // 两个点
  var p1 = new FreeDo.Cartesian3()
  var p2 = new FreeDo.Cartesian3()
  //
  var midwidth = null
  // 夹角
  var angle = null
  // 存放计算出来的点
  var calculatearray = []
  // 判断点的个数
  switch (relarray.length) {
    case 0:

      break
    case 1:

      break

    case 2:
      // 以该点为起始点的向量
      FreeDo.Cartesian3.subtract(relarray[1], relarray[0], xl1)
      // 该向量的两个法向量
      FreeDo.Cartesian3.cross(cartesians[0], xl1, f1)
      FreeDo.Cartesian3.cross(xl1, cartesians[0], f2)
      // 单位法向量
      FreeDo.Cartesian3.normalize(f1, normalxl1)
      FreeDo.Cartesian3.normalize(f2, normalxl2)
      // 以width为模长的法向量
      normalxl1.x = normalxl1.x * width
      normalxl1.y = normalxl1.y * width
      normalxl1.z = normalxl1.z * width
      normalxl2.x = normalxl2.x * width
      normalxl2.y = normalxl2.y * width
      normalxl2.z = normalxl2.z * width
      // 求两个点的坐标(起点)
      FreeDo.Cartesian3.add(relarray[0], normalxl1, p1)
      FreeDo.Cartesian3.add(relarray[0], normalxl2, p2)
      // 将两个点存放到数组中
      calculatearray.push(new FreeDo.Cartesian3(p1.x, p1.y, p1.z))
      calculatearray.push(new FreeDo.Cartesian3(p2.x, p2.y, p2.z))

      // 求两个点的坐标（终点）
      FreeDo.Cartesian3.add(relarray[1], normalxl1, p1)
      FreeDo.Cartesian3.add(relarray[1], normalxl2, p2)
      // 将两个点存放到数组中
      calculatearray.push(new FreeDo.Cartesian3(p1.x, p1.y, p1.z))
      calculatearray.push(new FreeDo.Cartesian3(p2.x, p2.y, p2.z))
      break

    default:

      // 计算是否有三点一线的情况，有则删去中间点
      for (let i = 1; i < relarray.length - 1; i++) {
        // 计算第二个点和第一个点的差值，得到向量1
        FreeDo.Cartesian3.subtract(relarray[i], relarray[i - 1], xl1)
        // 计算第三个点和第二个点的差值，得到向量2
        FreeDo.Cartesian3.subtract(relarray[i + 1], relarray[i], xl2)
        // 判断两个向量的夹角是否为0
        if (FreeDo.Cartesian3.angleBetween(xl1, xl2) == 0) {
          // 如果条件成立则删除中间点
          relarray.splice(i--, 1)
        }
      }
      for (let i = 0; i < relarray.length; i++) {
        // 第一个点
        if (i == 0) {
          // 以该点为起始点的向量
          FreeDo.Cartesian3.subtract(relarray[i + 1], relarray[i], xl1)
          // 该向量的两个法向量
          FreeDo.Cartesian3.cross(cartesians[i], xl1, f1)
          FreeDo.Cartesian3.cross(xl1, cartesians[i], f2)
          // 单位法向量
          FreeDo.Cartesian3.normalize(f1, normalxl1)
          FreeDo.Cartesian3.normalize(f2, normalxl2)
          // 以width为模长的法向量
          normalxl1.x = normalxl1.x * width
          normalxl1.y = normalxl1.y * width
          normalxl1.z = normalxl1.z * width
          normalxl2.x = normalxl2.x * width
          normalxl2.y = normalxl2.y * width
          normalxl2.z = normalxl2.z * width
          // 求两个点的坐标
          FreeDo.Cartesian3.add(relarray[i], normalxl1, p1)
          FreeDo.Cartesian3.add(relarray[i], normalxl2, p2)
          // 将两个点存放到数组中
          calculatearray.push(new FreeDo.Cartesian3(p1.x, p1.y, p1.z))
          calculatearray.push(new FreeDo.Cartesian3(p2.x, p2.y, p2.z))

        // 最后一个点
        } else if (i == relarray.length - 1) {
          // 以该点为起始点的向量
          FreeDo.Cartesian3.subtract(relarray[i], relarray[i - 1], xl1)
          // 该向量的两个法向量
          FreeDo.Cartesian3.cross(cartesians[i], xl1, f1)
          FreeDo.Cartesian3.cross(xl1, cartesians[i], f2)
          // 单位法向量
          FreeDo.Cartesian3.normalize(f1, normalxl1)
          FreeDo.Cartesian3.normalize(f2, normalxl2)
          // 以width为模长的法向量
          normalxl1.x = normalxl1.x * width
          normalxl1.y = normalxl1.y * width
          normalxl1.z = normalxl1.z * width
          normalxl2.x = normalxl2.x * width
          normalxl2.y = normalxl2.y * width
          normalxl2.z = normalxl2.z * width
          // 求两个点的坐标
          FreeDo.Cartesian3.add(relarray[i], normalxl1, p1)
          FreeDo.Cartesian3.add(relarray[i], normalxl2, p2)
          // 将两个点存放到数组中
          calculatearray.push(new FreeDo.Cartesian3(p1.x, p1.y, p1.z))
          calculatearray.push(new FreeDo.Cartesian3(p2.x, p2.y, p2.z))
        // 中间的点
        } else {
          // 求中间点法向量的模长
          FreeDo.Cartesian3.subtract(relarray[i - 1], relarray[i], xl1)
          FreeDo.Cartesian3.subtract(relarray[i + 1], relarray[i], xl2)
          angle = FreeDo.Cartesian3.angleBetween(xl1, xl2) / 2
          midwidth = width / Math.sin(angle)

          FreeDo.Cartesian3.subtract(relarray[i + 1], relarray[i], xl1)
          FreeDo.Cartesian3.subtract(relarray[i], relarray[i - 1], xl2)
          FreeDo.Cartesian3.normalize(xl1, xl1)
          FreeDo.Cartesian3.normalize(xl2, xl2)
          FreeDo.Cartesian3.add(xl1, xl2, addxl1)

          FreeDo.Cartesian3.cross(cartesians[i], addxl1, f1)
          FreeDo.Cartesian3.normalize(f1, normalxl1)
          normalxl1.x = normalxl1.x * midwidth
          normalxl1.y = normalxl1.y * midwidth
          normalxl1.z = normalxl1.z * midwidth
          FreeDo.Cartesian3.add(relarray[i], normalxl1, p1)

          FreeDo.Cartesian3.cross(addxl1, cartesians[i], f2)
          FreeDo.Cartesian3.normalize(f2, normalxl2)
          normalxl2.x = normalxl2.x * midwidth
          normalxl2.y = normalxl2.y * midwidth
          normalxl2.z = normalxl2.z * midwidth
          FreeDo.Cartesian3.add(relarray[i], normalxl2, p2)

          calculatearray.push(new FreeDo.Cartesian3(p1.x, p1.y, p1.z))
          calculatearray.push(new FreeDo.Cartesian3(p2.x, p2.y, p2.z))
        }
      }
      break
  }
  return { c3array: cartesians, c3array2: calculatearray }
}

/**
 * 绘制道路
 * @param {场景} scene 
 * @param {经度、纬度、高度数组} HPRArray 
 * @param {路宽} roadwidth 
 */
FreeDoTool.drawRoad = function (scene, HPRArray, roadwidth,imgurl) {
  // 输入系列点后转换成世界坐标
  var cartesians1 = FreeDoTool.TransfPointToCartesian3(HPRArray)
  o.x = cartesians1[0].x
  o.y = cartesians1[0].y
  o.z = cartesians1[0].z
  var relarray1 = FreeDoTool.TransfCartesian3ToSelf(cartesians1)
  // 点拓宽后返回的结果1
  var result1 = FreeDoTool.getPointArray(cartesians1, relarray1, roadwidth)
  // 拓宽后的点
  var calculatearray1 = result1.c3array2
  // 存放路基点的数组
  var HPRArray2 = []
  for (let i = 0; i < HPRArray.length; i++) {
    HPRArray2[i] = { lon: HPRArray[i].lon, lat: HPRArray[i].lat, height: HPRArray[i].height - 3 }
  }
  // 路基宽
  var roadbasewidth = roadwidth+4
  // 输入系列点后转换成世界坐标
  var cartesians2 = FreeDoTool.TransfPointToCartesian3(HPRArray2)
  var relarray2 = FreeDoTool.TransfCartesian3ToSelf(cartesians2)
  // 点拓宽后返回的结果2
  var result2 = FreeDoTool.getPointArray(cartesians2, relarray2, roadbasewidth)
  // 拓宽后的点
  var calculatearray2 = result2.c3array2

  //	顶点位置坐标数组
  var p = []

  for (let i = 0; i < calculatearray2.length; i++) {
    if (i % 2 == 0) {
      p.push(calculatearray2[i].x)
      p.push(calculatearray2[i].y)
      p.push(calculatearray2[i].z)

      p.push(calculatearray1[i].x)
      p.push(calculatearray1[i].y)
      p.push(calculatearray1[i].z)
    }else {
      p.push(calculatearray1[i].x)
      p.push(calculatearray1[i].y)
      p.push(calculatearray1[i].z)

      p.push(calculatearray2[i].x)
      p.push(calculatearray2[i].y)
      p.push(calculatearray2[i].z)
    }
  }

  var positions = new Float64Array(p)
  // console.log(positions)

  // 顶点纹理坐标数组
  var t = []
  var d1 = null
  var d2 = null
  var d = null
  var tu1 = 0.0
  var tu2 = 0.0
  var tu3 = 0.0
  var tu4 = 0.0

  t.push(tu1, 0.0)
  t.push(tu2, 0.1)
  t.push(tu3, 0.9)
  t.push(tu4, 0.91)
  var range1 = result1.c3array.length - 1
  var num = roadwidth * 2 + Math.sqrt(4 * 4 + 3 * 3) * 2
  for (let i = 0; i < range1; i++) {
    d1 = FreeDo.Cartesian3.distance(calculatearray1[2 * i + 2], calculatearray1[2 * i]) / num
    d2 = FreeDo.Cartesian3.distance(calculatearray1[2 * i + 3], calculatearray1[2 * i + 1]) / num
    d = (d1 + d2) / 2
    tu1 = tu1 + d
    tu2 = tu2 + d
    tu3 = tu3 + d
    tu4 = tu4 + d
    t.push(tu1, 0.0)
    t.push(tu2, 0.1)
    t.push(tu3, 0.9)
    t.push(tu4, 0.91)
  }
  var texCoords = new Float32Array(t)
  console.log(t)


  //	三角形索引数组。
  var ind = []
  var range2 = (result1.c3array.length - 2) * 4 + 2
  for (let i = 0; i <= range2; i++) {
    if ((i - 3) % 4 != 0) {
      ind.push(i + 0)
      ind.push(i + 4)
      ind.push(i + 5)
      ind.push(i + 5)
      ind.push(i + 1)
      ind.push(i + 0)
    }
  }
  var indices = new Uint16Array(ind)
  // console.log(indices)

  var geometry = new FreeDo.Geometry({
    attributes: {
      position: new FreeDo.GeometryAttribute({
        componentDatatype: FreeDo.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: positions
      }),
      st: new FreeDo.GeometryAttribute({
        componentDatatype: FreeDo.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: texCoords
      })
    },
    indices: indices,
    primitiveType: FreeDo.PrimitiveType.TRIANGLES,
    boundingSphere: FreeDo.BoundingSphere.fromVertices(positions)
  })

  var instance = new FreeDo.GeometryInstance({
    geometry: geometry,
    modelMatrix: new FreeDo.Matrix4(
      1, 0, 0, o.x,
      0, 1, 0, o.y,
      0, 0, 1, o.z,
      0, 0, 0, 1
    ),
    attributes: {
      color: FreeDo.ColorGeometryInstanceAttribute.fromColor(FreeDo.Color.RED)
    },
    id: 'trangle'
  })

  // scene.primitives.add(new FreeDo.Primitive({
  //   geometryInstances: instance,
  //   appearance: new FreeDo.PerInstanceColorAppearance({
  //     flat: true,
  //     translucent: false
  //   })
  // }))

  scene.primitives.add(new FreeDo.Primitive({
    geometryInstances: instance,
    appearance: new FreeDo.MaterialAppearance({
      material: new FreeDo.Material({
        fabric: {
          type: 'Image',
          uniforms: {
            image: imgurl
          }
        }
      })

    })
  }))

//   //xiaoffy add
//   var geometry1 = new FreeDo.Geometry({
//     attributes: {
//       position: new FreeDo.GeometryAttribute({
//         componentDatatype: FreeDo.ComponentDatatype.DOUBLE,
//         componentsPerAttribute: 3,
//         values: positions
//       })
//     },
//     indices: indices,
//     primitiveType: FreeDo.PrimitiveType.LINES ,
//     boundingSphere: FreeDo.BoundingSphere.fromVertices(positions)
//   })
//   var instance1 = new FreeDo.GeometryInstance({
//     geometry: geometry1,
//     modelMatrix: new FreeDo.Matrix4(
//       1, 0, 0, o.x,
//       0, 1, 0, o.y,
//       0, 0, 1, o.z,
//       0, 0, 0, 1
//     ),
//     attributes: {
//       color: FreeDo.ColorGeometryInstanceAttribute.fromColor(FreeDo.Color.RED)
//     },
//     id: 'lines'
//   })
//  scene.primitives.add(new FreeDo.Primitive({
//     geometryInstances: instance1,
//     appearance: new FreeDo.PerInstanceColorAppearance({
//       flat: true,
//       translucent: false
//     })
//   }))
}