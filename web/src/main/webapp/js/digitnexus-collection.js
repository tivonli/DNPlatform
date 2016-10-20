/**
 * DigitNexus JavaScript Collection Object <Key-Value: map>
 * @author : bill Huang
 * Data : 2011-07-08 11:30
 */
digitnexus = (typeof digitnexus == 'undefined') ? {} : digitnexus;
digitnexus.Collection = function(){
	this.container = {};
};

/*
 * Put the key--value into the Collection
 * @author : bill Huang
 * Date : 2011-07-08 16:13
 **/
digitnexus.Collection.prototype.put = function(key,value){
	try{
		if(key != null && key != ""){
			this.container[key] = value;
		}
	}catch(e){
		return e;
	}
};
/*
* Get value from Collection by key
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.get = function(key){
	try{
		return this.container[key];
	}catch(e){
		return e;	
	}	
};
/*
* validate key is in the Collection
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.containsKey = function(key){
	try{
		for(var p in this.keyArray()){
			if(p.toString() == key.toString()){
				return true;
			}
		}
		return false;
	}catch(e){
		return e;
	}
};
/*
* validate value is in the Collection
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.containsValue = function(value){
	try{
		for(var p in this.keyArray()){
			if(this.container[p] == value){
				return true;
			}
		}
		return false;
	}catch(e){
		return e;
	}
};
/*
* remove value at Collection by key
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.remove = function(key){
	try{
		delete this.container[key];
	}catch(e){
		return e;
	}
};
/*
* clean the Collection value
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.clear = function(){
	try{
		delete this.container;
		this.container = {};
	}catch(e){
		return e;
	}
};
/*
* Validate the Collection is empty
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.isEmpty = function(){
	if(this.keyArray().length == 0){
		return true;
	}else{
		return false;
	}
};
/*
* get the Collection element size
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.size = function(){
	return this.keyArray().length;
};
/*
* get the Collection key array
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.keyArray = function(){
	var keys = new Array();
	for(var p in this.container){
		keys.push(p);
	}
	return keys;
};
/*
* get the Collection value array
* @author : bill Huang
* Date : 2011-07-08 16:13
*/
digitnexus.Collection.prototype.valueArray = function(){
	var values = new Array();
	var keys = this.container.keyArray();
	for(var i = 0; i < keys.length; i++){
		values.push(this.container[keys[i]]);
	}
	return values;
};