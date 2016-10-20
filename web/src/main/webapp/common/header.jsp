<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.digitnexus.common.uimanage.UiManageConstants"%>
<%@ page import="java.util.Locale" %>
<%
	String skin_dir = (String)request.getSession().getAttribute(UiManageConstants.CURRENT_SKIN_DIR);
	String lan = (String)request.getSession().getAttribute(UiManageConstants.LAGUAGEPARAMETER);
	if(StringUtils.isEmpty(skin_dir)){
		Cookie[] cookies = request.getCookies();
		for(Cookie cookie : cookies){
			if(cookie.getName().equals(UiManageConstants.CURRENT_SKIN_DIR)){
				skin_dir = cookie.getValue();
			}
		}
		if(StringUtils.isEmpty(skin_dir)){
			skin_dir = "skin2";
		}
	}
	if(StringUtils.isEmpty(lan)){
		lan = org.springframework.context.i18n.LocaleContextHolder.getLocale().toString();
	}
	pageContext.setAttribute(UiManageConstants.CURRENT_SKIN_DIR,skin_dir);
	pageContext.setAttribute(UiManageConstants.LAGUAGEPARAMETER,lan);
%>
<script type="text/javascript">
<!--
	var CURRENT_SKIN_DIR = "${CURRENT_SKIN_DIR}";
	var LAN = '${lan}';
//-->
</script>