//图片上传预览    IE是用了滤镜。
//imghead img的id
//preview div的id
function previewImage(file, imghead) { 
  
  var objUrl = getObjectURL(file.files[0]) ; 
	if (objUrl) {
		$("#"+imghead).attr("src", objUrl) ;
	}
}

function getObjectURL(file) {
	var url = null ; 
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}