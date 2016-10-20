<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="common/taglibs.jsp"%>
<%@ page import="java.util.Locale" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><AutoId:i18n key="app.name"/> Login</title>
	<link href="skins/common/style/login.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
</head>
<body>
    <%
      String localeString=org.springframework.context.i18n.LocaleContextHolder.getLocale().toString();
      pageContext.setAttribute("localeString",localeString);
    %>     
	<div class="login_top">
   	  <div class="login_top_l">
        	  <div class="login_top_r">
       	  			<div class="login_top_m"><c:choose><c:when test="${localeString eq 'en'}"><a target="_self" href="?lan=<%=Locale.SIMPLIFIED_CHINESE.toString()%>"><%out.print(new String("中文".getBytes("ISO-8859-1"),"UTF-8"));%></a></c:when> <c:otherwise><a target="_self" href="?lan=<%=Locale.ENGLISH.toString()%>">English</a></c:otherwise></c:choose><div class="separatorLine">|</div><a target="_self" href=""><AutoId:i18n key="help"/></a></div>
          	</div>
  	   </div>
	</div>
	<div class="login">
		<div class="login_content">
		  <div>
			   <form id="loginForm" method="post" action="<c:url value='j_spring_security_check'> <c:param name='lan'   value='${param.lan}' /></c:url>">
		    	<input type="hidden" name="formAlert" value="<AutoId:i18n key='LoginAlert'/>" />		    	
		    	<div class="login_inp">
			        	<div class="login_inp_l">
			            	<div class="login_inp_r">
			        	  	   <div class="login_inp_m">
			        	  		 <div class="login_inp_id"></div>
			        	  		 <div class="login_inp_lable"><AutoId:i18n key="id"/>:</div>
			        	  		 <input name="j_username" type="text" value='<c:if test="${not empty param.login_error}"><c:out value="${SPRING_SECURITY_LAST_USERNAME}"/></c:if>'/>
			        	  		</div>
			                </div>
			            </div>
			        	<div class="login_inp_l">
			            	<div class="login_inp_r">
			       	  		  <div class="login_inp_m">
                              	<div class="login_inp_pw"></div>
                              	<div class="login_inp_lable"><AutoId:i18n key="pw"/>:</div>
                                <input name="j_password" type="password" />
                              </div>
			                </div>
			            </div>
   	  					<div class="login_btn2"><a class="login_btn_ForgetPW" href="<c:url value='/jsp/user/forgotPassword.jsp'><c:if test="${not empty param.lan}"><c:param name='lan'   value='${param.lan}' /></c:if></c:url>"><AutoId:i18n key="ForgotPassword"/></a></div>
		        </div>
		        <div>
		           <input type="button" onclick="checkLoginInfo()" class="login_btnLogin" style="border:0px;" value=""/>
		        </div>
		      </form>
	       </div> 
	       <div id="login_tip" class="login_tip">
	          <c:if test="${not empty param.login_error}">
			      <p><c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/></p>
		      </c:if>
	       </div> 
			<div class="login_bottom version_build_number">
				<AutoId:i18n key="CompanyLoginInfo"/>&nbsp;&nbsp;&nbsp;&nbsp;<AutoId:i18n key="VersionName"/>&nbsp;:&nbsp;<AutoId:i18n key="VersionNumber"/>&nbsp;&nbsp;&nbsp;&nbsp;<AutoId:i18n key="BuildName"/>&nbsp;:&nbsp;<AutoId:i18n key="BuildNumber"/>
			</div>
	    </div>
	    <div class="login_shadow"></div>
	</div>  
<script type="text/javascript">
	try{
		var browserHeight=0;
	    function getBrowserWindowInformation(){
	        // this should work for all browsers except ie
	        if (self.innerHeight){
	            browserHeight = self.innerHeight;
	            // now determine if we are showing a scrollbar, if so reduce the dimensions accordingly
	            var mozillaHeight = document.height;

	        }
	        // and this handles internet explorer 6 strict mode
	        else if (document.documentElement && document.documentElement.clientHeight)
	            browserHeight = document.documentElement.clientHeight;
	        // and this handles other browsers
	        else if (document.body)
	            browserHeight = document.body.clientHeight;
	    }
	    getBrowserWindowInformation();
	    document.getElementById('username').focus();
	    document.getElementById('encaseLoginDiv').style.height=browserHeight+'px';		
	}catch(e){}
	
	function checkLoginInfo(){
		var name = $.trim(document.getElementById('loginForm').j_username.value);
		var pwd = $.trim(document.getElementById('loginForm').j_password.value);
		if(name == '' && pwd == ''){
		//	alert(document.getElementById('loginForm').formAlert.value);
			document.getElementById("login_tip").innerHTML="<p>"+document.getElementById('loginForm').formAlert.value;
		}else{
			document.getElementById('loginForm').submit();
		}
	}
	
	
	$(document).ready(function(){
		$(document).bind("keyup",function(event){
			if(event.which == 13){
				checkLoginInfo();
			} 
		})
	})
</script>	
</body>


</html>