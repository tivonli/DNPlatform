/**
 * Render search view for user
 */
(function() {
    function renderListToolbar(options){
        options['showSearchButtons']=false;
        return new ListToolBar(options).render();
    }
    
    function renderSearchView(options){
        var searchView=new SearchView(options);
        searchView.render();
        //Remove User name label and criteria label
        searchView.searchFormEl.find('li>:first-child').remove();
        searchView.searchFormEl.find('li>:first-child').hide();
        return searchView;
    }
    
     //User search customization
    ListToolBar.registerRenderer('com.digitnexus.core.domain.User',renderListToolbar);
    SearchView.registerRenderer('com.digitnexus.core.domain.User',renderSearchView);
    //Role search customization
    //User search customization
    ListToolBar.registerRenderer('com.digitnexus.core.domain.Role',renderListToolbar);
    SearchView.registerRenderer('com.digitnexus.core.domain.Role',renderSearchView);
    //Role search customization
    
    
})();


