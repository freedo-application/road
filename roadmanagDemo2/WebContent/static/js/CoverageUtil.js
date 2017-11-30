var CoverageUtil = window.CoverageUtil||{}
CoverageUtil.addLabel = function(m_viewer,id,Lon,Lat,Height,text,font,scale,fillColor,showLabel,showBack,distanceDisplayCondition,backgroundColor,horizontalOrigin,verticalOrigin,showPoint,pixelSize,pointColor,pOutlineColor,pOutlineWidth,pdistanceDisplayCondition,pixelOffset,image,showBillboard,billboardWidth,billboardHeight,billboardScale,billboardshowDistanceNear,billboardshowDistanceFar){
	if(!m_viewer.entities.getById(id)){
		var entity = m_viewer.entities.add(
		{
			id : id,
			position : FreeDo.Cartesian3.fromDegrees(Lon, Lat, Height), 
			billboard : {
			    image : image,//
			    show :showBillboard,
			    width : billboardWidth,
			    height : billboardHeight,
			    scale : billboardScale,
			    //color : FreeDo.Color.WHITE,
			    distanceDisplayCondition : new FreeDo.DistanceDisplayCondition(billboardshowDistanceNear ,billboardshowDistanceFar)
		    },
			/*ellipse : {
				    semiMinorAxis : 10,
				    semiMajorAxis : 10,
				    fill : true,
				    material : '../../common/img/bus.svg',//../../../../common/img/bubble2.png   ../../common/img/police.svg
				    distanceDisplayCondition : new FreeDo.DistanceDisplayCondition(50 ,30000)
			},*/
			label : 
			{ //文字标签  
				text : text,  
				font : font, 
				backgroundColor : backgroundColor,
				fillColor : fillColor,
				horizontalOrigin : horizontalOrigin,
				verticalOrigin : verticalOrigin,
				/*outlineColor : outlineColor,
				outlineWidth : outlineWidth,*/
				scale : scale,
				show : showLabel,
				showBackground : showBack,
				//translucencyByDistance : translucencyByDistance,//设置透明
				//scaleByDistance :scaleByDistance,//设置尺度
				//distanceDisplayCondition :new FreeDo.DistanceDisplayCondition(1000.0 ,200000.0),//显示的距离
				distanceDisplayCondition : distanceDisplayCondition,
				pixelOffset:pixelOffset//点与标签的偏移
				
			},
			point :
			{
				show : showPoint,
				pixelSize : pixelSize,
		        color : pointColor,
		        outlineColor : pOutlineColor,
		        outlineWidth : pOutlineWidth,
		        //translucencyByDistance : new FreeDo.NearFarScalar(1000000, 1, 10000000, 0),
				//scaleByDistance : new FreeDo.NearFarScalar(10, 0, 10000000, 1)
		        distanceDisplayCondition :pdistanceDisplayCondition
			}
		});
		return entity;
	}
	
}
//创建图层
CoverageUtil.addImage = function(){
	var tiandituCia = new FreeDo.WebMapTileServiceImageryProvider({
		url : "http://{s}.tianditu.com/cia_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet={TileMatrixSet}&TileMatrix={TileMatrix}&TileRow={TileRow}&Tilecol={TileCol}&style={style}&format=tiles",
		style:"default",
		tileMatrixSetID:"w",
		maximumLevel:17,
		subdomains : ["t7","t6","t5","t4","t3","t2","t1","t0"]
	});
	return tiandituCia;
}
CoverageUtil.addTitle = function(){
	var Title =  new Freedo.WebMapTileServiceImageryProvider({
		url : "http://{s}.tianditu.com/img_c/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet={TileMatrixSet}&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style={style}&format=tiles",
		style:"default",
		tileMatrixSetID:"c",
		tilingScheme:new Freedo.GeographicTilingScheme(),
		tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
		maximumLevel:17,
		subdomains : ["t0","t1","t2","t3","t4","t5","t6","t7"]
	});
	return Title;
}
//添加图层
CoverageUtil.addImageryProvider = function(viewer,imageryProvider,index) {
	if(viewer.imageryLayers.get(index)==undefined){
		var imageLayers = viewer.imageryLayers;
		imageLayers.addImageryProvider(imageryProvider);
	}
}
//画线
CoverageUtil.line = function(name,pointArr,width,color,distanceDisplayCondition){
	var railWay = myViewer.entities.add({
	    id : name,
	    polyline : {
	        positions : FreeDo.Cartesian3.fromDegreesArray(pointArr),
	        width : width,
	        material : color,
	        show : false,
	        distanceDisplayCondition :distanceDisplayCondition
	    }
	});
	return railWay;
}
//移除图层
CoverageUtil.hideCoverage = function(index){
	var layer  = myViewer.imageryLayers.get(index);
	if(layer!=undefined){
		myViewer.imageryLayers.remove(layer,false);
	}
	
}
//省界线的添加
CoverageUtil.addBoundary = function(viewer,path){
	var dataSource = new FreeDo.GeoJsonDataSource(path);

	if(!viewer.dataSources.contains(dataSource)){
		
		viewer.dataSources.add(dataSource.load(path, {
	        fill: new FreeDo.Color(0, 0, 0, 0)
	    }));
		return dataSource;
	}else{
		return null;
	}
}
//添加地形
CoverageUtil.addTerrain = function(viewer){
	//返回上一个设置的地形
	//var oldTerrain = viewer.terrainProvider;
	viewer.terrainProvider = new FreeDo.FreedoTerrainProvider({
		 url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
		 requestWaterMask : false,
		 requestVertexNormals : true
	});
	
	//return newTerrain;
}
//道路描线
CoverageUtil.addPolygon = function(name,wayArray,show,fill,outline,outlineColor,outlineWidth,distanceDisplayCondition,material){
	var Polygon = myViewer.entities.add({
	    id : name,
	    polygon : {
	        hierarchy : FreeDo.Cartesian3.fromDegreesArray(wayArray),
	        material : material,
	        show : show,
	        fill : fill,
	        outline : outline,
	        outlineColor : outlineColor,
	        outlineWidth : outlineWidth,
	        //distanceDisplayCondition :distanceDisplayCondition
	    }
	});
	return Polygon;
}
//左键单击获取经纬度
CoverageUtil.initLeftClick = function(viewer,callback) {
	var screenSpaceEventHandler = new FreeDo.ScreenSpaceEventHandler(viewer.canvas);
	screenSpaceEventHandler.setInputAction(function(movement){
		/*var picked = viewer.scene.pick(movement.position);
		var pick= new FreeDo.Cartesian2(movement.position.x,movement.position.y);
		var cartesian = viewer.camera.pickEllipsoid(pick, viewer.scene.globe.ellipsoid);
		var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
		var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
		console.log(point);
		
		console.log(picked);*/
		$(".msgInfo").hide();
		var picked = viewer.scene.pick(movement.position);
		
		var pick= new FreeDo.Cartesian2(movement.position.x,movement.position.y);
		var cartesian = viewer.camera.pickEllipsoid(pick, viewer.scene.globe.ellipsoid);
		var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
		var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
		console.log(point);
		
		//console.log(picked)
		if(picked==undefined){
			callback(undefined,undefined);
		}else{
			callback(movement.position,picked);
		}
		
		
	}, FreeDo.ScreenSpaceEventType.LEFT_CLICK);
}
CoverageUtil.ModelfromGltf = function(viewer,id,url,lon,lat,height,heading,pitch,roll,scaleX,scaleY,scaleZ){
	var modelMatrix = FreeDoTool.getModelMatrix(lon,lat,height,heading,pitch,roll,scaleX,scaleY,scaleZ);
	var model = viewer.scene.primitives.add(FreeDo.Model.fromGltf(
		{	
				id:id,
				url : url,
				show : true,                    
				modelMatrix : modelMatrix,
		        allowPicking : true,            
		        debugShowBoundingVolume : false, 
		        debugWireframe : false
		}));
	return model;
}
//挖坑
CoverageUtil.potholing =function(){
	
	var viewer = m_Viewer; 
	var scene = viewer.scene;
	//深度检测 不显示地下部分
	//scene.globe.depthTestAgainstTerrain = true;
	var polygon = Freedo.PolygonGeometry.fromPositions({
		  positions : Freedo.Cartesian3.fromDegreesArray([
			  113.60997579264001, 22.770576180921505,
			  113.61205345630484, 22.769223323368976,			  
			  113.62971032866137, 22.796357496668005,
			  113.62805416930284, 22.797291065291397
		  ])
		});
    //console.log(polygon)
	 var gp = new Freedo.GroundErasePrimitive({
        geometryInstances: new Freedo.GeometryInstance({
      	geometry: polygon,
         attributes: {
            color: Freedo.ColorGeometryInstanceAttribute.fromColor(new Freedo.Color(0.0, 0.0, 0.0, 1.0)) // 洞的颜色 (0, 0, 0)表示黑色
          } 
        }),
        classificationType: 0,
        debugShowShadowVolume: false
     });
   //scene.groundPrimitives.add(gp);
   
    //坑壁
   viewer.entities.add({
       id : "kengbi",
	   wall : {
            positions : Freedo.Cartesian3.fromDegreesArray([
113.60997579264001, 22.770576180921505,
113.61205345630484, 22.769223323368976,			  
113.62971032866137, 22.796357496668005,
113.62805416930284, 22.797291065291397,
113.60997579264001, 22.770576180921505
        		]),
            material : "../../common/img/Land001.jpg",
            maximumHeights:[ 0.00001,0.00001,0.00001,0.00001,0.00001],
            minimumHeights:[-100,-100,-100,-100, -100],
            outline : false
        }
    });
   
    //坑底
   viewer.entities.add({
	   id : "kengdi",
	   polygon : {
           hierarchy : Freedo.Cartesian3.fromDegreesArrayHeights([
113.60997579264001, 22.770576180921505,100,
113.61205345630484, 22.769223323368976,100,			  
113.62971032866137, 22.796357496668005,100,
113.62805416930284, 22.797291065291397,100
           ]),
           height:-100,
           material : "../../common/img/Land001.jpg",
       }
   });
   return gp;
}
//流动线
function computeCircle(radius) {
    var positions = [];
    for (var i = 0; i < 360; i++) {
        var radians = Freedo.Math.toRadians(i);
        positions.push(new Freedo.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
}
CoverageUtil.guide = function(polylinePositions,width,image,direction){
	var offsetwenli = new Freedo.Cartesian2(100, 1);
	var dongtaiwenli = m_Viewer.scene.primitives.add(new Freedo.Primitive({
	    geometryInstances : new Freedo.GeometryInstance({
	        id : '1109',
	        show : true,
	        geometry : new Freedo.PolylineVolumeGeometry({
	      	  //vertexFormat : Freedo.VertexFormat.DEFAULT,
	          //polylinePositions : Freedo.Cartesian3.fromDegreesArray([
	    	  polylinePositions : Freedo.Cartesian3.fromDegreesArrayHeights(polylinePositions),
	    	  //流动线宽度
	    	  shapePositions : computeCircle(width)
	    	}),
	    	
	        /* modelMatrix : Freedo.Matrix4.multiplyByTranslation(
	            Freedo.Transforms.eastNorthUpToFixedFrame(Freedo.Cartesian3.fromDegrees(-100.0, 40.0)),
	            new Freedo.Cartesian3(0.0, 0.0, 150000.0),
	            new Freedo.Matrix4()
	        ), */

	        attributes : {
	            color : Freedo.ColorGeometryInstanceAttribute.fromColor(Freedo.Color.CYAN)
	        }
	    }),
	    appearance: new Freedo.MaterialAppearance({
	        materialSupport: Freedo.MaterialAppearance.MaterialSupport.TEXTURED,
	        material: new Freedo.Material({
	          fabric: {
	            type: 'DiffuseMap',
	            uniforms: {
	              image: image,
	              repeat: new Freedo.Cartesian2(50, 1),
	              offset: offsetwenli//添加一个纹理坐标偏移量的uniform变量
	            },
	             components: {
	              //修改着色器给纹理坐标添加偏移量
	              //repeat * materialInput.st-offset +和- 负责流动方向
	              diffuse: 'texture2D(image, fract(repeat * materialInput.st'+direction+'offset)).channels'
	            } 
	          }
	        })
	      })
	})); 
	setInterval(function () {
	    if (offsetwenli.x > 51) {
	    	offsetwenli.x = 50;
	    }
	    offsetwenli.x += 0.005;
	  }, 1);
	return dongtaiwenli;
}
CoverageUtil.viewManage = function(viewer){
	 	var position  = m_Viewer.camera.position;
		var ellipsoid = m_Viewer.scene.globe.ellipsoid;
		var wgs84 = ellipsoid.cartesianToCartographic(position);
		var lat = FreeDo.Math.toDegrees(wgs84.latitude);
		var lon = FreeDo.Math.toDegrees(wgs84.longitude);
		var height = wgs84.height;
		var heading = m_Viewer.camera.heading;
		var roll = m_Viewer.camera.roll;
		var pitch = m_Viewer.camera.pitch;
		var myCamera = {};
		myCamera.lat=lat;
		myCamera.lon =lon;
		myCamera.height = height;
		myCamera.heading = heading;
		myCamera.roll = roll;
		myCamera.pitch = pitch;
		return myCamera;
}