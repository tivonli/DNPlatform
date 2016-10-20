/**
 * web client operator cookie utils
 * @author : bill
 * Date : 2011-09-26 10:00
 */
var CookieUtil = {
		currentLanguageName:'lan',
		currentLocale:null
};
/*
 * init cookie
 * @author : bill
 * Date : 2011-09-26 15:27 
 * */
CookieUtil.initCookie = function(){
	CookieUtil.currentLocale = LAN; //CookieUtil.getCookie(CookieUtil.currentLanguageName);
	//if(CookieUtil.currentLocale == "" || CookieUtil.currentLocale == null){
	//	CookieUtil.setCookie(CookieUtil.currentLanguageName, "en", 365);
	//	CookieUtil.currentLocale = "en";
	//}
	return CookieUtil.currentLocale;
}
/*
 * get cookie
 * @author : bill
 * Date : 2011-09-26 15:27 
 * */
CookieUtil.getCookie = function(c_name){
	if(document.cookie.length > 0){
		var c_start = document.cookie.indexOf(c_name + "=");
		if(c_start != -1){
			c_start=c_start + c_name.length+1;
			var c_end = document.cookie.indexOf(";",c_start);
			if(c_end == -1){
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}else{
		return "";
	}
}
/*
 * set cookie
 * @author : bill
 * Date : 2011-09-26 15:27 
 * */
CookieUtil.setCookie = function(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
/*
 * delete cookie
 * @author : bill
 * Date : 2011-09-26 15:27 
 * */
CookieUtil.delCookie = function(c_name,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()-expiredays);
	var cval=CookieUtil.getCookie(c_name);
	if(cval!=null){
		document.cookie= c_name + "="+escape(cval)+";expires="+exdate.toGMTString();
	} 
}
/**
 * get the cookie value by name
 * this function can replace the getCookie function
 * Because the getCookie function use unescape function 
 * and the unescape function was discarded..
 * so can change to decodeURIComponent function
 * Date : 2013-01-09 10:30 
 * */
CookieUtil.fetchCookie = function(c_name){
	var allCookies = document.cookie;
	if(allCookies != "" && allCookies.length >0){
		var c_start = allCookies.indexOf(c_name + "=");
		if(c_start != -1){
			c_start=c_start + c_name.length+1;
			var c_end = allCookies.indexOf(";",c_start);
			if(c_end == -1){
				c_end = allCookies.length;
			}
			return decodeURIComponent(allCookies.substring(c_start,c_end));
		}
	}else{
		return "";
	}
}
/**
 * store the name-value to cookies
 * this function can be replace the setCooke function
 * Because the setCooke function use escape function 
 * and the escape function was discarded..
 * so can change to encodeURIComponent function
 * Date : 2013-01-09 10:30 
 * */
CookieUtil.storeCookie = function(c_name,value,expiredays,path,domain,secure){
	var cookie = c_name+"="+encodeURIComponent(value);
	if(expiredays && expiredays != 0 ){
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		cookie += "; max-age=" + exdate.toGMTString();
	}else if(expiredays == 0){
		cookie += "; max-age=0";
	}
	if(path){
		cookie += "; path=" + path;
	}
	if(domain){
		cookie += "; domain=" + domain;
	}
	if(secure){
		cookie += "; secure";
	}
}
/**
 * delete the cookie
 * this function can replace the deleteCookie function
 * Date : 2013-01-09 10:30 
 * */
CookieUtil.removeCookie = function(c_name){
	var val = CookieUtil.fetchCookie(c_name);
	if(val!=null){
		CookieUtil.storeCookie(c_name, val, 0, null, null, null);
	}
}
/**
 * test browser can enabled the cookie
 * Date : 2013-01-09 10:30 
 * */
CookieUtil.enabled = function(){
	// Use navigator.cookieEnabled if this browser defines it
	if(navigator.cookieEnabled != undefined){
		return navigator.cookieEnabled;
	}
	//If we've already cached a value, use that value;
	if(Cookie.enabled.cache != undefined){
		return Cookie.enabled.cache;
	}
	//Otherwise, create a test cookie with a lifetime
	document.cookie = "testcookie=test; max-age=10000"; //Set cookie
	
	//Now see if that cookie was saved
	var cookies = document.cookie;
	if(cookies.indexOf("testcookie=test") == -1){
		// The cookie was not saved
		return Cookie.enabled.cache = false;
	}else{
		// Cookie was saved, so we've got to delete it before returning
		document.cookie = "testcookie=test; max-age=0";// Delete cookie
		return Cookie.enabled.cache = true;
	}
}