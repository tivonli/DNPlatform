<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ page import="java.util.Locale" %> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><AutoId:i18n key="ForgotPassword"/></title>
        <link href="../../skins/common/style/login.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="../../js/jquery-1.7.1.js"></script>
        <script type="text/javascript" src="../../js/jquery.i18n.custom.properties-1.0.9.js"></script>
        <script type="text/javascript" src="../../js/jquery.validate.custom.js"></script>
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
        <div class="forgetPassword ui-dialog">
        	<div class="ui-dialog-titlebar">
            	<span class="ui-dialog-title"><AutoId:i18n key="ForgotPassword"/></span>	
            </div>
            <div class="ui-dialog-content">
                <div>
                    <form  id="forgotPasswordForm" method="post" action="<c:url value='/rest/user/forgotPassword'/>">
                         <ul class="forgetPassword_content form_1">
                              <li>
                                  <div class="lable"><AutoId:i18n key="userName"/>:</div>
                                  <div class="inp"><font class="mustFill">*</font><input name="username" type="text" style="width:170px;" class="required"/></div>
                                  
                              </li>
                              <li>
                                  <div class="lable"><AutoId:i18n key="email"/>:</div>
                                  <div class="inp"><font class="mustFill">*</font><input name="email" type="text" style="width:170px;" class="required email"/></div>
                                  
                              </li>
                              <li class="btnbar1"><input id="submit" type="button" value="<AutoId:i18n key="submit"/>"/><input style="margin-left:10px;" type="reset" value="<AutoId:i18n key="reset"/>"/></li>
                              <li class="btnbar2"><a href="../../login.jsp" class="loginbtn_1"><AutoId:i18n key="label_login"/></a></li>
                              <li><div class="login_tip"><p id="messagePanel"></p></div></li>
                         </ul>
                         <input name="locale" type="hidden" value="${localeString}"/>
                    </form>
                </div>
                <div class="blank_line"></div>
             </div>
          </div>
                                            <script type="text/javascript">
                                                $(function () {    	
                                                    var userLocale="<%= localeString %>";
                                                    var submitForm=$("#forgotPasswordForm");
                                                    submitForm.validate();
                                                    $.i18n.properties({
                                                        name:['dnwebmessages_'+userLocale, 'validationmessages_'+userLocale],
                                                        path:'../../i18n/', 
                                                        callback: function() {
                                                            $.i18n.extendValidatePluginMessages();
                                                            $('#submit').click(function(){
                                                                $('#messagePanel').empty();
                                                                $('#messagePanel').removeClass('error');
                                                                if(submitForm.valid()){
                                                                    $.ajax({
                                                                        type: "POST",
                                                                        url: submitForm[0].action,
                                                                        data: submitForm.serialize(), // serializes the form's elements.
                                                                        success: function(data)
                                                                        {
                                                                            $('#messagePanel').append(label_message_success_forgotPassword); 
                                                                        },
                                                                    
                                                                        error:function(jqXHR, textStatus, errorThrown){
                                                                            $('#messagePanel').addClass('error');
                                                                            $('#messagePanel').append(label_error_user_info);
                                                                        }
                                                                    });
                                                                }
                                                                return false;
                                                            });
                                                        }
                                                    });
                
                                                   $("input:reset",submitForm).click(function(){
                                                	   submitForm.validate().resetForm();
                                                	   $('#messagePanel').removeClass('error');
                                                       $('#messagePanel').html("");
                                                	   return true;
                                                   });
                                                });
                                            </script>	 

                                            </body>
                                            </html>