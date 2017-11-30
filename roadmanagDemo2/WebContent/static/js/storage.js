var arrDisplay = [0, 1, 1, 1];
//存储，IE6~7 cookie 其他浏览器HTML5本地存储
// if (window.localStorage) {
//     localStorage.setItem("menuTitle", arrDisplay);	
// } else {
//     Cookie.write("menuTitle", arrDisplay);	
// }
// var strStoreDate = window.localStorage? localStorage.getItem("data"): Cookie.read("data");
// console.log(strStoreDate)


function setStorage(key, val) {
	localStorage.setItem(key, val);
}
function setCookie(key, val) {
	Cookie.write(key, val);
}
function getStorage(key) {
	return localStorage.getItem(key);
}
function getCookie(key) {
	return Cookie.read(key);
}



function insert(key, val) {
	if (window.localStorage) {
	    setStorage(key, val)
	} else {
	    setCookie(key, val)	
	}					
}
function getItem(key) {
	if (window.localStorage) {
	   return getStorage(key)

	} else {
	    return getCookie(key);
	}					
}
function chinese (text) {
	switch (text){
		case "school":
			return "学校"
			break;
		case "fire":
			return "消防"
			break;
		case "police":
			return "公安"
			break;
		case "hospital":
			return "医院"
			break;
		case "road":
			return "道路"
			break;
		case "bridge":
			return "桥梁"
			break;
		case "yangluduan":
			return "养路段"
			break;
		case "government":
			return "行政区域"
			break;


		case "text":
			return "名称："
			break;
		case "phone":
			return "联系方式："
			break;
		case "person":
			return "负责人："
			break;
		case "studentNum":
			return "学生人数："
			break;
		case "techerNum":
			return "教师人数："
			break;
		case "src":
			return "图片："
			break;
		case "lon":
			return "经度(°)："
			break;
		case "lat":
			return "纬度(°)："
			break;
		case "height":
			return "高(m)："
			break;
		case "class":
			return "等级："
			break;
		case "length":
			return "长度(m)："
			break;
		case "number":
			return "车道数："
			break;
		case "width":
			return "宽度(m)："
			break;
		case "texture":
			return "纹理："
			break;
		case "color":
			return "颜色："
			break;
		case "area":
			return "面积："
			break;
		case "limitWeight":
			return "限重："
			break;
		case "classType":
			return "类型："
			break;
		

		
	}
}
function inputType (type) {
	if (type == 'studentNum' || type == 'techerNum') {
		return 'numberbox'
	}else if(type == 'src' || type == 'texture' ){
		return 'select'
	}
}









