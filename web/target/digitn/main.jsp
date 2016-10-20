<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="common/taglibs.jsp"%>
<%@ include file="common/header.jsp"%>        
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <title><AutoId:i18n key="app.name"/></title>
        <style type="text/css">
            @import "skins/common/style/generalStyle.css";
            @import "skins/common/style/jquery-foxibox.css";
            @import "skins/common/style/jquery.fileupload-ui.css";
            @import "skins/common/style/ui.multiselect.css";
            @import "skins/common/style/map.css"; 
            @import "css/spectrum.css";
            @import "css/user_profile.css";

            @import "js/report/styles/common.css";
            @import "js/report/closure/goog/css/menu.css";
		    @import "js/report/closure/goog/css/menuitem.css";
		    @import "js/report/closure/goog/css/menuseparator.css";
		    @import "js/report/closure/goog/css/filteredmenu.css";
		    @import "js/report/closure/goog/css/filterobservingmenuitem.css";
		    @import "js/report/closure/goog/css/tristatemenuitem.css";
            
            @import "skins/${CURRENT_SKIN_DIR}/style/common.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/jquery-ui-1.8.16.custom.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/layout-default-latest.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/demo_page.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/demo_table_jui.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/news.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/jquery.noty.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/noty_theme_default.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/chosen.css";
            @import "skins/${CURRENT_SKIN_DIR}/style/jquery.wijmo-open.2.3.4.css";
            
        </style>
        <!-- jquery js file list  -->
        <script type="text/javascript" src="js/jquery-1.7.1.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.8.16.custom.js"></script>
        <script type="text/javascript" src="js/jquery.blockUI.js"></script>
        <script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
        <script type="text/javascript" src="js/jquery-ui-timepicker-localization.js"></script>
        <script type="text/javascript" src="js/jquery.layout-latest.js"></script>
        <script type="text/javascript" src="js/jquery.ba-resize.min.js"></script>
        <script type="text/javascript" src="js/jquery.dataTables.js"></script>
        <script type="text/javascript" src="js/jquery-foxibox.js"></script>
        <script type="text/javascript" src="js/chosen.jquery.js"></script>
        <script type="text/javascript" src="js/ICanHaz.js"></script>
        <script type="text/javascript" src="js/spectrum.js"></script>
        <script type="text/javascript" src="js/jquery.wijmo-open.all.2.3.4.min.js"></script>
        
        <!-- RGraph js file list -->
        <script type="text/javascript" src="js/report/rgraph/RGraph.common.core.js"></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.common.tooltips.js"></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.common.effects.js"></script>
		<script type="text/javascript" src="js/report/rgraph/RGraph.common.dynamic.js"></script>
		<script type="text/javascript" src="js/report/rgraph/RGraph.common.key.js"></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.bar.js"></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.line.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.pie.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.meter.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.funnel.js" ></script>
		<script type="text/javascript" src="js/report/rgraph/RGraph.common.context.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.hbar.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.hprogress.js"></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.radar.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.rose.js" ></script>
        <script type="text/javascript" src="js/report/rgraph/RGraph.rscatter.js" ></script>
        
        <!--   Map js -->
        <script src="http://maps.google.com/maps/api/js?v=3.5&sensor=false&language=zh_CN"></script>
        <!-- 
         <script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&amp;mkt=en-us"></script>
         <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>
        -->
        <script type="text/javascript" src="js/OpenLayers.js"></script>

        <!-- reporting engine js file -->
        <script type="text/javascript" src="js/report/closure/goog/base.js"></script>
        <script type="text/javascript" src="js/report/mashuputils.js"></script>
        <script type="text/javascript" src="js/report/bodata.js"></script>
        <script type="text/javascript" src="js/report/reportingengine.js"></script>
        <script type="text/javascript" src="js/report/drawoperator.js"></script>
        <script type="text/javascript" src="js/report/filteroperator.js"></script>

        <!-- FusionChart js file -->
        <script type="text/javascript" src="common/charts/FusionCharts.js" ></script>
        <!-- DNplatform js file list -->	
        <script type="text/javascript" src="js/digitnexus-startup.js"></script>
        <script type="text/javascript" src="js/digitnexus-collection.js"></script>
        <script type="text/javascript" src="js/digitnexus-util.js"></script>
        <script type="text/javascript" src="js/jquery.contextmenu.js"></script>
        <script type="text/javascript" src="js/fileuploader.js"></script>
        <script type="text/javascript" src="js/digitnexus-simulator.js"></script>
        <script type="text/javascript" src="js/jquery.validate.custom.js"></script>
        <script type="text/javascript" src="js/digitnexus-combobox.js"></script>
        <script type="text/javascript" src="js/CookieUtil.js"></script>
        <script type="text/javascript" src="js/jquery.noty.js"></script>
        <script type="text/javascript" src="js/ui.multiselect.js"></script>
        

        <script type="text/javascript" src="js/digitnexus-map.js"></script>


        <!--The plugin code is customized to load only base file -->
        <script type="text/javascript" src="js/jquery.i18n.custom.properties-1.0.9.js"></script>
        <script type="text/javascript" src="js/underscore-1.3.3.js"></script>
        <script type="text/javascript" src="js/backbone-0.9.2.js"></script>
        <script type="text/javascript" src="js/backbone-deep-model.js "></script>
        <script type="text/javascript" src="js/Backbone.ModelBinder-0.1.5.js"></script>
        <script type="text/javascript" src="js/view/backboneExtend.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/model/tabsmodel.js"></script>
        <script type="text/javascript" src="js/model/articleModel.js"></script>
        <script type="text/javascript" src="js/model/newsModel.js"></script>
        <script type="text/javascript" src="js/model/reportModel.js"></script>
        <script type="text/javascript" src="js/view/tabsview.js"></script>
        <script type="text/javascript" src="js/view/articleNavigationView.js"></script>
        <script type="text/javascript" src="js/view/articleView.js"></script>
        <script type="text/javascript" src="js/view/listView.js"></script>
        <script type="text/javascript" src="js/view/editAndDetailViewContainer.js"></script>
        <script type="text/javascript" src="js/view/detailView.js"></script>
        <script type="text/javascript" src="js/view/editView.js"></script>
        <script type="text/javascript" src="js/view/editViewToolbar.js"></script>
        <script type="text/javascript" src="js/view/referenceView.js"></script>
        <script type="text/javascript" src="js/view/listTopView.js"></script>
        <script type="text/javascript" src="js/view/searchView.js"></script>
        <script type="text/javascript" src="js/view/taskBarView.js"></script>
        <script type="text/javascript" src="js/view/collectionReferenceViews.js"></script>
        <script type="text/javascript" src="js/view/collectionAggregateReferenceView.js"></script>
        <script type="text/javascript" src="js/view/attachmentView.js"></script>
        <script type="text/javascript" src="js/view/dataLoaderView.js"></script>
        <script type="text/javascript" src="js/view/dashboardView.js"></script>
        <script type="text/javascript" src="js/view/newsView.js"></script>
        <script type="text/javascript" src="js/view/newsTopToolView.js"></script>
        <script type="text/javascript" src="js/view/newsEditAndDetailView.js"></script>
        <script type="text/javascript" src="js/view/reportView.js"></script>
        <script type="text/javascript" src="js/view/userProfileView.js"></script>
        <script type="text/javascript" src="js/view/mapView.js"></script>
        <script type="text/javascript" src="js/view/commentView.js"></script>
        <script type="text/javascript" src="js/view/searchViewCustom.js"></script>
        <script type="text/javascript" src="js/view/aclExpressionView.js"></script>
        <!--Attachment related ui files -->
        <script type="text/javascript" src="js/jquery.fileupload.js"></script>
        <script type="text/javascript" src="js/jquery.iframe-transport.js"></script>
        <script type="text/javascript" src="js/jquery.fileupload-ui.js"></script>
        <script type="text/javascript" src="js/jquery.fileupload-jui.js"></script>

    </head>
    <body  >
        <div class="web">
            <div class="top_content">
                <div class="top_logo">
                    <div class="top_btn">
                        <ul>
                            <li id="logout" class="topBtn_logout"><a href="#" class="btn_4"><div class="btn_4_r"><div class="btn_4_c" id="logout_label"></div></div></a></li>
                            <li id="help" class="topBtn_help"><a href="#" class="btn_4"><div class="btn_4_r"><div class="btn_4_c" id="help_label"></div></div></a></li>
                            <li id="setting" class="topBtn_setting"><a href="#" class="btn_4"><div class="btn_4_r"><div class="btn_4_c" id="setting_label"></div></div></a></li>
                            <li id="tool" class="topBtn_tool"><a href="#" class="btn_4"><div class="btn_4_r"><div class="btn_4_c" id="tool_label"></div></div></a></li>
                        </ul>
                    </div>
                    <div class="top_admin"><AutoId:i18n key="welcome"/>, <%= com.digitnexus.core.security.util.SecurityUtil.getCurrentUser().getFullName() %></div>
                </div>

                <div id="tabs" style="border:0;">
                    <div id="tab_menu" class="top_menu">
                        <div class='top_menu_r'>
                            <ul id="tab_menu_ul" class='top_menu_c'></ul>
                        </div>
                    </div>
                    <div id="tab_content" class="tab_content1">
                        <!-- wrap tab-panels in ui-layout-content div -->
                    </div>
                </div>

            </div>
        </div>
        <div class="bottom_content"><div class="bottom_text"><AutoId:i18n key="CompanyPanelInfo"/></div></div>
        <div id="dialog" class="custom simulator"></div>
        <div id="logoutDialog" class="custom"></div>
        <div id="dataLoaderDialog" class="custom dataLoader popupBox1 frame1_1"></div>
        <div id="settingDialog" class="custom"></div>
        <div id="skinSettingDialog" class="custom"></div>
        <div id="helpDialog" class="custom"></div>
        <div id="error-message"></div>

        <!--Attachment related templates. Using http://icanhazjs.com/-->
        <!--Attachment Form -->
        <script id="attachmentForm" type="text/html">
            <form id="{{formId}}" action="{{action}}" method="POST" enctype="multipart/form-data">
                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
                <div class="fileupload-row fileupload-buttonbar">
                    <div class="span7">
                        <!-- The fileinput-button span is used to style the file input field as button -->
                        <span class="btn btn-success fileinput-button">
                            <i class="icon-plus icon-white"></i>
                            <span>{{labels.add}}</span>
                            <input type="file" name="file" multiple>
                        </span>
                        <button type="submit" class="btn btn-primary start">
                            <i class="icon-upload icon-white"></i>
                            <span>{{labels.start}}</span>
                        </button>
                        <button type="reset" class="btn btn-warning cancel">
                            <i class="icon-ban-circle icon-white"></i>
                            <span>{{labels.cancel}}</span>
                        </button>
                        <button type="button" class="btn btn-danger delete">
                            <i class="icon-trash icon-white"></i>
                            <span>{{labels.deleteFile}}</span>
                        </button>
                        <input type="checkbox" class="toggle">
                    </div>
                    <!-- The global progress information -->
                    <div class="span5 fileupload-progress fade">
                        <!-- The global progress bar -->
                        <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                            <div class="bar" style="width:0%;"></div>
                        </div>
                        <!-- The extended global progress information -->
                        <div class="progress-extended">&nbsp;</div>
                    </div>
                </div>
                <!-- The loading indicator is shown during file processing -->
                <div class="fileupload-loading"></div>
                <br>
                    <!-- The table listing the files available for upload/download -->
                    <table role="presentation" class="table table-striped"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>
            </form>
        </script>
        
        <!--Article Tab layout templates-->
        <!--List View on top, edit and detail view at bottom -->
        <script id="articleTabVerticalLayout" type="text/html">
            <div class="main-content-panel1 ui-tabs-panel">
                <!--The class inner-container is used for lookup of this element by framework -->
                <div class="ui-tabs-panel inner-container">
                    <!--The class list-view is used for lookup of this element by framework -->
                    <div class="main-content-panel1-north list-view ui-layout-north" style="overflow:hidden;width:100%;clear:both;"/>
                    <!--The class detail-and-edit-view is used for lookup of this element by framework -->
                    <div class="main-content-panel1-south detail-and-edit-view ui-layout-center" style="overflow:hidden;width:auto;"/>
                </div>
            </div>
        </script>
        <!--List View on top, edit and detail view at bottom -->
        <script id="articleTabHorizontalLayout" type="text/html">
            <div class="main-content-panel1 ui-tabs-panel userCss main-content-panel-horizontal">
                <!--The class inner-container is used for lookup of this element by framework -->
                <div class="ui-tabs-panel inner-container">
                    <!--The class list-view is used for lookup of this element by framework -->
                    <div class="main-content-panel1-north ui-layout-west list-view" style="overflow:hidden;width:100%;clear:both;"/>
                    <!--The class detail-and-edit-view is used for lookup of this element by framework -->
                    <div class="main-content-panel1-south ui-layout-center detail-and-edit-view" style="overflow:hidden;width:auto;"/>
                </div>
            </div>
        </script>
        
        <script id="fullPageLayout" type="text/html">
            <div class="main-content-panel1 ui-tabs-panel">
            </div>
        </script>
        
        <!--List View on top, edit and detail view at dialog -->
        <script id="articleTabDialogLayout" type="text/html">
            <div class="main-content-panel1 ui-tabs-panel">
                <!--The class inner-container is used for lookup of this element by framework -->
                <div class="ui-tabs-panel inner-container">
                    <!--The class list-view is used for lookup of this element by framework -->
                    <div class="main-content-panel1-north list-view ui-layout-center" style="overflow:hidden;width:100%;clear:both;"/>
                    <!--The class detail-and-edit-view is used for lookup of this element by framework -->
                    <div class="detail-and-edit-view ui-layout-dialog" style="overflow:hidden;width:auto;"/>
                </div>
            </div>
        </script>
        
    </body>
</html>