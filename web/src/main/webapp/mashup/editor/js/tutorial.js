var digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};
digitnexus.editor.Tutorial =  function(){
  
}

digitnexus.editor.Tutorial.prototype.getPageList_ = function(container) {
    var plist = ["base/base.html",'基本概念',"development/dev.html",'开发',"report/report.html",'报表'];
    
    return plist;
}

digitnexus.editor.Tutorial.prototype.createOneItem = function(path,label) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href=path;
  a.target='content';
  var node = document.createTextNode(label);
  a.appendChild(node);
  li.appendChild(a);
  return li;
}

digitnexus.editor.Tutorial.prototype.loadPageList = function(container) {
    if(!container) {
        return ;
    }
    var pageList = this.getPageList_();
    if(!pageList) {
        return ;
    }
    for(var index = 0;index < pageList.length;) {
        if(!pageList[index]){
            continue;
        }
        container.appendChild(this.createOneItem(pageList[index],pageList[index+1]));
        index+=2;
    }
    
}
digitnexus.editor.Tutorial.prototype.getInstance = function() {
    if(!this.instance_) {
        this.instance_=  new digitnexus.editor.Tutorial();
    }
    return this.instance_;
}