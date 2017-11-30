var flag = 0;
$(function () {
	var WINDOW_WIDTH = $(document).width()
	var WINDOW_HEIGHT = $(document).height()
	$('.container-wrapper').height(WINDOW_HEIGHT - 30)
	$('#earth').height(WINDOW_HEIGHT - 30)
	
	var tree = {};
	tree.init = function() {
		var arr = []
		$.ajax({
		    url: './static/tree-menu.json',
		    dataType: "json",
		    success(content) {
		        resData = content;
                let bufferData = {}; // 缓存数据
                let node = null;
                let parentNode = null;
                for (let i = 0; i < content.length; i++) {
                    node = content[i];
                    for (var j = 0; j < arr.length; j++) {
    					if (node.id == arr[j]) node.checked = true
    				};
                }
                lineId = resData[0];
                var on_off;
                $('#tree-menu').tree({
                	data:resData,
                	onLoadSuccess: function() {
    	                on_off = true;//加载完成，正常开启onCheck事件 ， 
    	            },
                    onCheck: function (row,checked){
                    	//console.log(row)
                    	if(on_off){
                    		//console.log(checked)
                    		if(checked==true){
                        		if(row.type=="school"||row.type=="fire"||row.type=="police"||row.type=="hospital"||row.type=="bridge"||row.type=="yangluduan"){
                        			//console.log("标牌")
                        			for(var i = 0;i<labels.length;i++){
                        				if(labels[i].type==row.type){
                        					//console.log(labels[i])
                        					labels[i].label.show=true;
                        					labels[i].billboard.show = true;
                        					labels[i].point.show = true;
                        				}
                        			}
                        		}else if(row.type=="road"){
                        			console.log("道路")
                        			for(var i = 0;i<lines.length;i++){
                        				lines[i].polyline.show=true;
                        			}
                        		}else if(row.type=="government"){
                        			console.log("行政区域")
                        			for(var i = 0;i<areas.length;i++){
                        				areas[i].polygon.show=true;
                        			}
                        		}
                        	}else if(checked==false){
                        		if(row.type=="school"||row.type=="fire"||row.type=="police"||row.type=="hospital"||row.type=="bridge"||row.type=="yangluduan"){
                        			//console.log("隐藏标牌")
                        			for(var i = 0;i<labels.length;i++){
                        				if(labels[i].type==row.type){
                        					//console.log(labels[i])
                        					labels[i].label.show=false;
                        					labels[i].billboard.show = false;
                        					labels[i].point.show = false;
                        				}
                        			}
                        		}else if(row.type=="road"){
                        			console.log("隐藏道路")
                        			for(var i = 0;i<lines.length;i++){
                        				lines[i].polyline.show=false;
                        			}
                        		}else if(row.type=="government"){
                        			console.log("隐藏行政区域")
                        			for(var i = 0;i<areas.length;i++){
                        				areas[i].polygon.show=false;
                        			}
                        		}
                        	}
                    	}
                    	/*if(checked==true){
                    		if(row.type=="school"||row.type=="fire"||row.type=="police"||row.type=="hospital"||row.type=="bridge"||row.type=="roads"){
                    			console.log("标牌")
                    			for(var i = 0;i<labels.length;i++){
                    				if(labels[i].type==row.type){
                    					//console.log(labels[i])
                    					labels[i].label.show=true;
                    					labels[i].billboard.show = true;
                    				}
                    			}
                    		}else if(row.type=="road"){
                    			console.log("道路")
                    		}else if(row.type=="government"){
                    			console.log("行政区域")
                    		}
                    	}else if(checked==false){
                    		if(row.type=="school"||row.type=="fire"||row.type=="police"||row.type=="hospital"||row.type=="bridge"||row.type=="roads"){
                    			console.log("隐藏标牌")
                    		}else if(row.type=="road"){
                    			console.log("隐藏道路")
                    		}else if(row.type=="government"){
                    			console.log("隐藏行政区域")
                    		}
                    	}*/
                    },
                    onClick: function(row) {
                    	$('#tree-menu').tree('check', row.target);
                    	$('.container-wrapper .treegrid-wrapper .title h4').text(row.text)
                    	$('.set-page').attr('src', row.src);
                    	$('.input-list:first').text('')
                    	treegrid.init(row,row.src)
                    	treegrid.btnAble(row.type)
                    }
                });
                $('.tree-icon').remove()
		    }
		});
	}
	tree.show = function () {
		$('#basic').on('click', function () {
			$('.tree-wrapper').toggle()
			$('.tree-wrapper').css({"z-index": "1"})
			$('.treegrid-wrapper,.set-page,.add-edit').hide()
		})
	}
	tree.setInit = function () {
		var data = $('#treegrid').treegrid('getData')
		var type = data[0].type
		var arr = []
		if (JSON.parse(getItem('d'))) {
			var datas = JSON.parse(getItem('d'))[type]
			if (datas) {
				var result = []
				if (datas != '') {
					for( var i = 0; i < datas.length; i++){
						var data = datas[i] 
						if (data.val) {
							arr.push(data.key.split('-')[1])
						};
					}
				}
			};
			
		};
		$.ajax({
		    url: './static/tree_datas.json',
		    dataType: "json",
		    method: "get",
		    success(content) {
		    	console.log(content)
		        resData = content[type];
                let bufferData = {}; // 缓存数据
                let node = null;
                let parentNode = null;
                for (let i = 0; i < resData.length; i++) {
                    node = resData[i]
                    for (var j = 0; j < arr.length; j++) {
    					if (node.id == arr[j]) node.checked = true
    				};
                }
                console.log(content)
                $('#tree').tree({
                	// url: './static/tree_datas.json',
                	data:resData,
                    onCheck: function (row){
                    }
                });
                $('.tree-icon').remove()
		    }
		})
		$('.set-page .fa-close').on('click', function() {
			$('.set-page').hide()
		})
	}
	tree.set = function () {
		$('.set-page .sure').on('click', function() {
			var type = $('#treegrid').treegrid('getData')[0].type
			var nodeY = $('#tree').tree('getChecked');
			var nodeN = $('#tree').tree('getChecked', 'unchecked');
			var arr = []
			var storage = null
			JSON.parse(getItem('d')) ? storage = JSON.parse(getItem('d')): storage = {}
			for(var i = 0; i < nodeY.length; i++){
				var node = {}
				node.key = nodeY[i].text+'-'+nodeY[i].id
				node.val = true;
				arr.push(node)
			}
			for(var i = 0; i < nodeN.length; i++){
				var node = {}
				node.key = nodeN[i].text+'-'+nodeN[i].id
				node.val = false;
				arr.push(node)
			}
			storage[type] = arr
			insert('d', JSON.stringify(storage))
			$('.set-page').hide()
			treegrid.init($('#treegrid').treegrid('getData')[0],$('.set-page').attr('src'))
			$('.treegrid-wrapper').show()
		})
	}

	var treegrid = {} //创建简单表对象
	treegrid.data = null; //简单表数据初始化
	
	treegrid.init = function (data,src) { //初始化简单表
		treegrid.init._addNode = function(data) {
			var _width = WINDOW_WIDTH/11
			var column = [
					{field:'Action',title:'操作',width:_width - 41,align:'center',
						formatter:function(value,row,index){
							var r = '<a href="#" class="fa fa-arrow-circle-right" title="三维跳转" style="color:green;font-size:18px;width:100%"></a> ';
							return r
						}
					},
					{title:'名称',field:'text',width:_width},
					// {title:'电话',field:'phone',width:_width},
					// {title:'负责人',field:'person',width:_width}
					// {title:'经度(°)',field:'lon',width:_width - 10},
					// {title:'纬度(°)',field:'lat',width:_width - 10},
					// {title:'高度(m)',field:'height',width:_width}
			    ]

			if (data.type == 'school' || data.type == 'fire' || data.type == 'police' || data.type == 'hospital' || data.type == 'yangluduan') {
				column.push({title:'电话',field:'phone',width:_width})
				column.push({title:'负责人',field:'person',width:_width})
			}else if(data.type == 'road'){
				column.push({title:'等级',field:'class',width:_width})
				column.push({title:'长度(m)',field:'length',width:_width})
			}else if(data.type == 'government'){
				column.push({title:'颜色',field:'color',width:_width})
				column.push({title:'面积',field:'area',width:_width})
			}else if(data.type == 'bridge'){
				column.push({title:'类型',field:'classType',width:_width})
				column.push({title:'长度',field:'length',width:_width})

			}



			if (JSON.parse(getItem('d'))) {
				var datas = JSON.parse(getItem('d'))
				if(datas[data.type]){
					var type = datas[data.type]
					for( var i = 0; i < type.length; i++){
						var data = type[i] 
						if (data.val) {
							var arr = data.key.split('-')
							column.push({title:arr[0],field:arr[1],width:_width})
						};
					}
				}
				
			}
			return column
		}
		$('.tree-wrapper').toggle()
		$('.treegrid-wrapper').show().width(WINDOW_WIDTH/3-2)
		$('.treegrid-wrapper').css('z-index','1')
		$('.set-page,.add-edit').hide()

		var columnArr = treegrid.init._addNode(data)
		$('#treegrid').treegrid({
		    url: src, 
		    method: 'get', 
		    idField:'id',
		    width: WINDOW_WIDTH / 3,
		    height: WINDOW_HEIGHT -30 -20 -2,
		    columns:[columnArr],
		    onDblClickRow(row) {
		    	   
		    },
		    onClickCell(Action,row){
		    	flag = 1;
		    	treegrid.showInput(row)
		    	$('.treegrid-wrapper').hide()
		    	$('.show').show()
		    }
		});
		

		$('.container-wrapper .fa-close').on('click', function() {
			if ($(this).parents('.title').parent().hasClass('show')) {
				if (flag == 1) {
					//console.log(flag)
					$('.treegrid-wrapper').show()

				}
			}

			$(this).parents('.title').parent().hide()
			
		})
	}
	treegrid.set = function () {
		$('.set').on('click', function () {
			if($(this).attr('editable') == 'true'){
				tree.setInit()
				$('.set-page').show()
				$('.tree-wrapper,.treegrid-wrapper').hide()
			}
		})
	}
	treegrid.getData = function () {
		var addNode = {}
		var data = $('#treegrid').treegrid('getData')
		for (var i in data[0] ){
			addNode[i] = $(`${'#input-' + i}`).val()
		}
		return addNode
	}
	treegrid.input = function (){
		var data = $('#treegrid').treegrid('getData')
		var html = null;
		var flag = $('.input-list:first li').hasClass('input-item')
		if (!flag) {
			for(var i in data[0]){
				if (i != 'labelid' && i != 'id' && i != 'lon' && i != 'lat' && i != 'height' && i != 'state' && i != '_parentId' && i != 'type' && i != 'src') {
					html = `<li class="input-item">
								<label>${chinese (i)}</label>
								<input id=${'input-' + i} class="input-text" >
							</li>`
					$('.input-list:first').append(html)
					// if (inputType(i) == 'numberbox') {
					// 	$('#input-'+i).numberbox({
					// 	    min:0
					// 	});
					// };
					// if (inputType(i) == 'select') {
					// 	$('#input-'+i).combobox({
					// 	    url:'./static/pic_src.json',
					// 	    method: 'get',
					// 	    valueField:'id',
					// 	    textField:'text',
					// 	    height: 28,
					// 	    width: 131,
					// 	    panelHeight:90, //根据有多少个图片定高度
					// 	    editable:false
					// 	})
					// };
				};
			};
		}
	}
	treegrid.showInput = function(row){
		
		$('.show h4 span').text(chinese (row.type))
		//console.log(row)
		$('.show-list').text('')
		if(row.type=="school"||row.type=="fire"||row.type=="police"||row.type=="hospital"||row.type=="bridge"||row.type=="yangluduan"){
			//console.log(row)
			//console.log("标牌飞往")
			

			for(var i = 0;i<labels.length;i++){
				//console.log(labels[i].label.text._value)
				if(row.text==labels[i].label.text._value){
					
					var ellipsoid = myViewer.scene.globe.ellipsoid;
					var wgs84 = ellipsoid.cartesianToCartographic(labels[i].position._value);
					myViewer.camera.flyTo(
		    				{
		    					destination : FreeDo.Cartesian3.fromDegrees(FreeDo.Math.toDegrees(wgs84.longitude), FreeDo.Math.toDegrees(wgs84.latitude), 1000),
		    					orientation: 
		    					{
		    						heading : FreeDo.Math.toRadians(0), 
		    						pitch : FreeDo.Math.toRadians(-90),    
		    						roll : FreeDo.Math.toRadians(0)      
		    					}
		    					
		    				});
				}
			}
		}else if(row.type=="road"){
			//console.log(row.lineid)
			var lon = [];
			var lat = [];
			var positions = [];
			$.getJSON("static/json/way.json",function(data){
				//console.log(data.length)
				for(var i =0;i<data.length;i++){
					
					if(row.lineid==data[i].id){
						
						for(var j=0;j<data[i].pointArray.length;j++){
							//console.log(data[i].pointArray[j])
							if(j%2==0){
								lon.push(data[i].pointArray[j]);
							}else{
								lat.push(data[i].pointArray[j]);
							}							
						}
					}
				}
				for(var i=0;i<lon.length;i++){
    				//a:经纬高对象 放在集合中用于多模型飞行
    				var a = {lon:lon[i],lat:lat[i],height:0};
    				positions.push(a);
    			}
    			FreeDoTool.flyToModels(myViewer.camera,positions,function(){})
			});
		}else if(row.type=="government"){
			console.log("行政区域飞往")
			var lon = [];
			var lat = [];
			var positions = [];
			$.getJSON("static/json/area.json",function(data){
				for(var i =0;i<data.length;i++){
					if(row.areaid==data[i].name){
						for(var j=0;j<data[i].pointArray.length;j++){
							if(j%2==0){
								lon.push(data[i].pointArray[j]);
							}else{
								lat.push(data[i].pointArray[j]);
							}
						}
					}
				}
				for(var i=0;i<lon.length;i++){
    				//a:经纬高对象 放在集合中用于多模型飞行
    				var a = {lon:lon[i],lat:lat[i],height:0};
    				positions.push(a);
    			}
    			FreeDoTool.flyToModels(myViewer.camera,positions,function(){});
			});
		}
		var html = null;
		
		for(var i in row){

			$('.swiper-wrapper').text('')
			if (i != 'lineid' && i != 'areaid' && i != 'labelid' && i != 'id' && i != 'state' && i != '_parentId' && i != 'type') {
				html = `<li class="show-item">
							<label>${chinese (i)}</label>
							<input id=${'show-' + i} class="show-text" value=${row[i]} disabled>
						</li>`
				if (i == "src") {
					for(var j = 0; j < row[i].length; j++){
						console.log(row[i][j])
						html = `<div class="swiper-slide">
								<img src=${row[i][j]} class="pic" alt="">
								</div>`
						$('.swiper-wrapper').append(html)
					}
					
					// swiper()
					return
				};
				$('.show-list').append(html)
				
			};
		};

	}
	treegrid.btnAble = function (type) {
		$('.add,.del,.set').attr('editable',true)
		if (type == 'government') {
			$('.add,.del,.set').attr('editable',false)
		};
	}
	treegrid.addEditDown = function(){
		$('.fa-angle-double-down').on('click', function() {
			console.log($(this).eq())
			$(this).parent().siblings().toggle()
		})
	}
	treegrid.add = function () {
		
		$('.add').on('click', function() {
			if($(this).attr('editable') == 'true'){
				treegrid.input()
				$('.add-edit .sure').addClass('add-sure').removeClass('edit-sure')
				$('.add-edit').show()
				$('.treegrid-wrapper').css('z-index','-1')
				$('.tree-wrapper').hide()
				$('.add-edit input').val('')
				$('.input-list').hide()
			}
		})
			$('.add-edit .sure').on('click', function() {
				if (!$(this).hasClass('add-sure')) return
				var node = $('#treegrid').treegrid('getSelected')
				treegrid.add._insert()
				$('.add-edit').hide()
				$('.treegrid-wrapper').css('z-index','1')
			})
			treegrid.add._insert = function() {
				var node = $('#treegrid').treegrid('getData')
				var addNode = treegrid.getData()
				var type = node[0].type

				addNode.id = node[node.length-1].id+1;
				if (node){
					$('#treegrid').treegrid('insert', {
						after: node[node.length-1].id,
						data: addNode
					});
				}
				switch (type){
					case "school":
						console.log('学校接口')
						break;
					case "fire":
						console.log('消防接口')
						break;
					case "police":
						console.log('公安接口')
						break;
					case "hospital":
						console.log('医院接口')
						break;
				}
			}

		
	}
	treegrid.edit = function() {
		$('.edit').on('click', function() {
			treegrid.input()
			var node = $('#treegrid').treegrid('getSelected')
			$('.add-edit .sure').addClass('edit-sure').removeClass('add-sure')
			if (node) {
				treegrid.edit._showData(node)
			}else {
				$('.del-box .content').text('请选中删除的记录！')
				$('.del-box').show()
			}
		})
		$('.add-edit .sure').on('click', function() {
			if (!$(this).hasClass('edit-sure')) return
			var node = $('#treegrid').treegrid('getSelected')
			if (node) {
				treegrid.add._edit(node)
				$('.add-edit').hide()
				$('.treegrid-wrapper').css('z-index','1')
			}
		})
		treegrid.edit._showData = function (node) {
			$('.add-edit').show()
			$('.treegrid-wrapper').css('z-index','-1')
			for (var i in node){
				$('#input-' + i).val(node[i])
				if (inputType(i) == 'select') {
					$('#input-'+i).combobox('setValue', node[i])
				};
			}
		}
		treegrid.add._edit = function (node) {
			var addNode = treegrid.getData()
			var type = node.type
			var title = $('.container-wrapper .title h4').text()
			$('#treegrid').treegrid('update', {
				id:node.id ,
				row: addNode
			});
			switch (type){
				case "school":
					console.log('学校接口')
					break;
				case "fire":
					console.log('消防接口')
					break;
				case "police":
					console.log('公安接口')
					break;
				case "hospital":
					console.log('医院接口')
					break;
			}
		}
	}
	treegrid.del = function () {
		$('.container-wrapper .del-box').css({'position':'absolute',"left": WINDOW_WIDTH/2-100+'px','top':WINDOW_HEIGHT/2 - 50 +'px'})
		$('.del').on('click', function() {
			if($(this).attr('editable') == 'true'){
				var node = $('#treegrid').treegrid('getSelected')
				if (node) {
					$('.del-box .content').text('是否删除！')
					$('.del-box').show()
				}else {
					$('.del-box .content').text('请选中删除的记录！')
					$('.del-box').show()
				}
			}
		})
		$('.del-box .sure').on('click', function(){
			var node = $('#treegrid').treegrid('getSelected')
			var text = $('.del-box .content').text()
			if (text == '是否删除！') {
				var title = $('.container-wrapper .title h4').text()
				var type = node.type
				if (node) {
					$('#treegrid').treegrid('remove', node.id);
					switch (type){
						case "school":
							console.log('学校接口')
							break;
						case "fire":
							console.log('消防接口')
							break;
						case "police":
							console.log('公安接口')
							break;
						case "hospital":
							console.log('医院接口')
							break;
					}
				}
				$('.del-box').hide()
			}else{
				$('.del-box').hide()
			}
		})
	}

	tree.init()
	tree.show()
	tree.set()
	treegrid.addEditDown()
	treegrid.add()
	treegrid.set()
	treegrid.edit()
	treegrid.del()
	swiper()


})
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
function showLabelDescript(id){

	var html = null;
	//console.log(id)
	var data =null;
	if(isContains(id, "school")){
			$.ajax({
			  url: "static/school.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "fire")){
		$.ajax({
			  url: "static/fire.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "police")){
		$.ajax({
			  url: "static/police.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "hospital")){
		$.ajax({
			  url: "static/hospital.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "road")){
		console.log("000000000000000000")
		$.ajax({
			  url: "static/road.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "yangluduan")){
		$.ajax({
			  url: "static/roads.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "bridge")){
		$.ajax({
			  url: "static/bridge.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}else if(isContains(id, "area")){
		$.ajax({
			  url: "static/government.json",
			  type: 'get',
			  success: function (information) {
				  data = information;
			  },
			  fail: function (err, status) {
			    console.log(err)
			  },
			  async:false
			})
	}
	

	for(var i in data){
		if (data[i].labelid == id||data[i].areaid== id||data[i].lineid==id){

			$('.swiper-wrapper').text('')
			$('.show-list').text('')
			for(var j in data[i]){
				$('.show h4 span').text(chinese (data[i].type))
				
				if (j != 'lineid' && j != 'areaid' && j != 'labelid' && j != 'id' && j != 'state' && j != '_parentId' && j != 'type') {
					html = `<li class="show-item">
								<label>${chinese (j)}</label>
								<input id=${'show-' + j} class="show-text" value=${data[i][j]} disabled>
							</li>`
					if (j == "src") {
						for(var k = 0; k < data[i][j].length; k++){
							console.log(data[i][j][k])
							html = `<div class="swiper-slide">
									<img src=${data[i][j][k]} class="pic" alt="">
									</div>`
							$('.swiper-wrapper').append(html)
						}
						$('.show').show()
						// mySwiper.update()
						// swiper()
						return
					};
					$('.show-list').append(html)
				}
			}
			
		}
	}
}
function swiper(){
	var mySwiper = new Swiper ('.swiper-container', {
	    direction: 'horizontal',
	    // loop: true,
	    // 如果需要分页器
	    // pagination: '.swiper-pagination',
	    
	    // 如果需要前进后退按钮
	    nextButton: '.swiper-button-next',
	    prevButton: '.swiper-button-prev',
	    observer:true,//修改swiper自己或子元素时，自动初始化swiper 
	    observeParents:false,//修改swiper的父元素时，自动初始化swiper 
	    // onImagesReady: function(swiper){ 
	    // 　　　mySwiper.update();  
	    // 　　　mySwiper.startAutoplay();
	    // // 　　  mySwiper.reLoop();  
	    // 　　  mySwiper.updateSlidesSize() 
	    // 　　  mySwiper.updateProgress()
	    // }

	    
	  })
}

	



