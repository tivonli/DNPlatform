<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ page import="java.util.Locale" %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Change Password</title>
	<link href="../../skins/common/style/login.css" rel="stylesheet" type="text/css" />
	 <script type="text/javascript" src="../../js/jquery-1.6.js"></script>
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
<div class="changePassword popupBox1 frame1_1">
	<div class="t_l">
    	<div class="t_r">
        	<div class="t_c">
            	<div class="title">Change Password</div>
        	</div>
        </div>
     </div>
    <div class="m_l">
    	<div class="m_r">
    	  <div class="f_content">
			   <form  id="changePasswordForm" method="post" action="<c:url value='/rest/user/changePassword'/>">
				<ul class="changePassword_content form_1">
                	<li><div class="lable"><AutoId:i18n key="OldPassword"/>:</div><div class="inp"><input name="oldPassword" type="password" style="width:200px;"/></div></li>
                	<li><div class="lable"><AutoId:i18n key="NewPassword"/>:</div><div class="inp"><input name="newPasswordFirst"    type="password" style="width:200px;"/></div></li>
                	<li><div class="lable"><AutoId:i18n key="RetypeNewPassword"/>:</div><div class="inp"><input name="newPassword" type="password" style="width:200px;"/></div></li>
                    <li class="btn"><input type="submit" value="<AutoId:i18n key="submit"/>"/><input style="margin-left:10px;" type="reset" value="<AutoId:i18n key="reset"/>"/></li>
                    <li><input name="uuid" type="hidden" value="<%= request.getParameter("uuid") %>"/></li>
                </ul>
		       </form>
    	  </div>
    	  <div class="blank_line"></div>
        </div>
    </div>
    <div class="b_l">
    	<div class="b_r">
        	<div class="b_c login_bottom version_build_number">
				
            </div>
        </div>
    </div>
</div>
	 

<script type="text/javascript">
$(document).ready(function() {
    $('#changePasswordForm').submit(function(e){
        $.post(this.action, $(this).serialize(),function(rest){
           alert('Form Submit success');
        });
    });  
    
    return false;   
});         
</script>	 
	
</body>


</html>