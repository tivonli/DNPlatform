function getXmlHttpObject()
{
  try
    {
    // Firefox, Opera 8.0+, Safari
    var xmlHttp1=new XMLHttpRequest();
    }
  catch (e)
    {
    // Internet Explorer
    try
      {
      xmlHttp1=new ActiveXObject("Msxml2.XMLHTTP");
      }
    catch (e)
      {
      xmlHttp1=new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
  if (xmlHttp1==null)
    {
    alert ("Explorer can not create XMLHTTP Object!!");
    return;
    }
  return xmlHttp1;
}

function sendJson(url, object, action, method, xmlHttpObject, flag){
	var baseUrl = getBaseUrl();
	var xmlHttp = xmlHttpObject;
	var jsonText = JSON.stringify(object, null, 2); 
//	alert(jsonText);
	xmlHttp.onreadystatechange = action;
	xmlHttp.open(method,baseUrl+url,flag);
	xmlHttp.setRequestHeader('Content-type','application/json');
	xmlHttp.send(jsonText);
}
function getBaseUrl(){
	var baseUrl = "";
	var context = (window.location.pathname).substring(1);
	context = context.substring(0,context.indexOf('/'));
	var ctx = window.location.protocol +"//"+ window.location.host + "/" +context+"/";
	if(ctx !== null && ctx !== ""){
		baseUrl = ctx;
	}else {
		baseUrl = "http://127.0.0.1:8081/SCMVisibility/";
	}
	return baseUrl;
}