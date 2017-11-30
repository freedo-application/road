var myViewer = null;
$(function(){
	myViewer = initEarth("earth");
	//屏蔽左下角图标
	//myViewer._cesiumWidget._creditContainer.style.display="none";
	//道路和地名
	yingxiang = CoverageUtil.addImage();
	//var dixing = CoverageUtil.addTitle();
	CoverageUtil.addImageryProvider(myViewer,yingxiang,1);
	//CoverageUtil.addImageryProvider(myViewer,dixing,1);
	//CoverageUtil.addTerrain(myViewer);
	
	
	new Compass(myViewer);
	myViewer.screenSpaceEventHandler.setInputAction(function(){},FreeDo.ScreenSpaceEventType.LEFT_DOUBLE_CLICK );
	myViewer.screenSpaceEventHandler.setInputAction(function(){},FreeDo.ScreenSpaceEventType.LEFT_CLICK );
	
	myViewer.camera .changed.addEventListener(RailwayByDistance);
	
	
	CoverageUtil.initLeftClick(myViewer,test);
	function test(data,data2){
		if(data!=null){
			if(FreeDo.defined(data2.id.id)){
				flag = 0;
				//console.log(data2.id.id)
				showLabelDescript(data2.id.id)
			}
		}
	}
	
	
	
	
	
	
	
	//创建标牌
	labels = [];
	$.getJSON("static/json/label.json",function(data){
		//console.log(data)
		for(var i=0;i<data.length;i++){
			var id = data[i].id;
			var type = data[i].type;
			var lon = data[i].lon;
			var lat = data[i].lat;
			var name = data[i].name;
			var font = data[i].font;
			var scale = data[i].scale;
			var color = data[i].color;
			var showLabel = data[i].showLabel;
			var backGround = data[i].backGround;
			var showDistanceNear = data[i].showDistanceNear;
			var showDistanceFar = data[i].showDistanceFar;
			var backGroundColor = data[i].backGroundColor;
			var showPoint = data[i].showPoint;
			var pointSize = data[i].pointSize;
			var pointColor = data[i].pointColor;
			var pointOutlineColor = data[i].pointOutlineColor;
			var pointOutlineWidth = data[i].pointOutlineWidth;
			var pointshowDistanceNear = data[i].pointshowDistanceNear;
			var pointshowDistanceFar = data[i].pointshowDistanceFar;
			var pixelOffset = data[i].pixelOffset;
			var image = data[i].image;
			var showBillboard = data[i].showBillboard;
			var billboardWidth = data[i].billboardWidth;
			var billboardHeight = data[i].billboardHeight;
			var billboardScale = data[i].billboardScale;
			var billboardshowDistanceNear =  data[i].billboardshowDistanceNear;
			var billboardshowDistanceFar = data[i].billboardshowDistanceFar;
			var description = data[i].description;
			var label = CoverageUtil.addLabel(myViewer,id,lon,lat,0,name,font,scale,eval(color),showLabel,backGround,new FreeDo.DistanceDisplayCondition(showDistanceNear,showDistanceFar),eval(backGroundColor),FreeDo.HorizontalOrigin.LEFT,FreeDo.HorizontalOrigin.LEFT,showPoint,pointSize,eval(pointColor),eval(pointOutlineColor),pointOutlineWidth,new FreeDo.DistanceDisplayCondition(pointshowDistanceNear,pointshowDistanceFar),eval(pixelOffset),image,showBillboard,billboardWidth,billboardHeight,billboardScale,billboardshowDistanceNear,billboardshowDistanceFar);
			label.type = type;
			label.description = description;
			labels.push(label);
		}
	});
	areas = [];
	$.getJSON("static/json/area.json",function(data){
		for(var i=0;i<data.length;i++){
			var name = data[i].name;
			var type = data[i].type;
			var pointArray = data[i].pointArray;
			var show = data[i].show;
			var fill = data[i].fill;
			var outline = data[i].outline;
			var outlineColor = data[i].outlineColor;
			var outlineWidth = data[i].outlineWidth;
			var near = data[i].showDistanceNear;
    		var far = data[i].showDistanceFar;
    		var text = data[i].text;
    		var fillColor = data[i].fillColor;
			var area = CoverageUtil.addPolygon(name,pointArray,show,fill,outline,eval(outlineColor),outlineWidth,new FreeDo.DistanceDisplayCondition(near ,far),eval(fillColor));
			area.text = text;
			area.type = type;
			areas.push(area);
		}
	});
	lines = [];
	$.getJSON("static/json/way.json",function(data){
		for(var i = 0;i<data.length;i++){
    		var id = data[i].id;
    		var type = data[i].type;
    		var line = data[i].pointArray;
    		var wide = data[i].wide;
    		var fillColor = data[i].fillColor;
    		var near = data[i].showDistanceNear;
    		var far = data[i].showDistanceFar;
    		var description = data[i].description;
    		var line = CoverageUtil.line(id,line,wide,eval(fillColor),new FreeDo.DistanceDisplayCondition(near ,far));
    		line.description=description;
    		line.type = type;
    		lines.push(line);
    	}
		
	});
	myViewer.camera.flyTo(
			{
				destination : FreeDo.Cartesian3.fromDegrees(117.4132906308837,39.978578886008236, 90000),
				orientation: 
				{
					heading : FreeDo.Math.toRadians(0), 
					pitch : FreeDo.Math.toRadians(-90),    
					roll : FreeDo.Math.toRadians(0)      
				},
			});
	/*----------------------------------加道路---------------------------------------*/
	var scene=myViewer.scene;
	var userdata1 =[
		{lon:117.25505875721869,lat:39.98177210365956,height:5},
		{lon:117.28483434827947,lat:39.98298808144714,height:5}
	];
	
	var userdata2 =[
		{lon:117.28472774151653,lat:39.98864346369405,height:5},
		{lon:117.28500034922028,lat:39.97743018010012,height:5},
		{lon:117.29090037961728,lat:39.977495571595995,height:5},
		{lon:117.29312110691328,lat:39.97768005029566,height:5}
	];
	
	var userdata3 =[
		{lon:117.29088958460301,lat:39.97750388054197,height:5},
		{lon:117.29149152474821,lat:39.97386967567217,height:5},
		{lon:117.29231871686834,lat:39.972028085422174,height:5},
		{lon:117.29260402553533,lat:39.97042628238812,height:5}
	];
	var imgurl1 = "./static/img/road/road1.jpg";
	var imgurl2 = "./static/img/road/road2.jpg";
	var imgurl3 = "./static/img/road/road3.jpg";
	var imgurl4 = "./static/img/road/road4.jpg";
	//画路
	FreeDoTool.drawRoad(scene,userdata1,4,imgurl3);
	FreeDoTool.drawRoad(scene,userdata2,4,imgurl3);
	FreeDoTool.drawRoad(scene,userdata3,4,imgurl3);

/*----------------------------------加道路---------------------------------------*/
});
function initEarth(id){
	var viewer = new Freedo.Viewer(
			id,
			{
				animation : false,
				baseLayerPicker : false,
				fullscreenButton : false,
				geocoder : false,
				homeButton : false,
				sceneModePicker : true,
				timeline : false,
				navigationHelpButton : false,
				navigationInstructionsInitiallyVisible : false,
				selectedImageryProviderViewModel : false,
				scene3DOnly : true,
				orderIndependentTranslucency:false
			}
	);
	
	return viewer;
}
//路线随相机高度显隐
RailwayByDistance = function(){
	var Camerap  = myViewer.camera.position;
	var ellipsoid = myViewer.scene.globe.ellipsoid;
	//console.log(Camerap)
	//相机的经纬高
	var wgs84 = ellipsoid.cartesianToCartographic(Camerap);
	//console.log(wgs84);
	if(wgs84.height<3000){
		CoverageUtil.hideCoverage(1);
	}else{
		CoverageUtil.addImageryProvider(myViewer,yingxiang,1);
	}
}


