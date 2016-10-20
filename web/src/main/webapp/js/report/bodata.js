var digitnexus = digitnexus || {};
digitnexus.utils = digitnexus.utils || {};
digitnexus.utils.bo = digitnexus.utils.bo || {};


digitnexus.utils.bo.MultipleDimBoData = function(jsonBo,parseArgs) {
    digitnexus.utils.bo.BoTable.apply(this,arguments);   
}
digitnexus.utils.inherits(digitnexus.utils.bo.MultipleDimBoData,  digitnexus.utils.bo.BoTable);

digitnexus.utils.bo.MultipleDimBoData.prototype.getData = function() {
    var origData = digitnexus.utils.bo.MultipleDimBoData.superClass_.getData.call(this);
    if(!origData || !origData[0]) {
        return [];
    }
    var len = origData[0].length
    var values = [];
    for(var rowIndex = 0 ; rowIndex < len; rowIndex++) {
        var vs = [];
        for(var colsIndex = 0 ; colsIndex < origData.length; colsIndex++) {
            vs[colsIndex] = origData[colsIndex][rowIndex];
        }
        values.push(vs);
    }
    return values;
}

digitnexus.utils.bo.MultipleTableBoData = function(jsonBo,parseArgs){
	digitnexus.utils.bo.BoTable.apply(this,arguments);
}
digitnexus.utils.inherits(digitnexus.utils.bo.MultipleTableBoData,  digitnexus.utils.bo.BoTable);

digitnexus.utils.bo.MultipleTableBoData.prototype.getData = function(){
	if ("" === this.valueName_) {
        throw "label name can't be found!";
    }	
    var values = [];
    if(digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_){
    	values = values.concat(this.table_);
    }else if(digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_){
    	values = values.concat(this.table_);
    }else{
    	throw "coordinate value invalide" + this.coordinate_;
    }
	return values;
}

digitnexus.utils.bo.MultipleTableBoData.prototype.getLabels = function(){
	if ("" === this.labelName_) {
        throw "label name can't be found!";
    }
	var labels = [];
	if(digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_){
		labels = labels.concat(this.headers_);
	}else if(digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_){
		for(var index = 0; index < this.headers_.length; index ++){
			if(this.labelName_===this.headers_[index].name){
				labels.push(this.headers_[index]);
			}else{
				for(var i = 0; i < this.filterConditions_.length; i ++){
					if(this.filterConditions_[i].selected && this.filterConditions_[i].header.name === this.headers_[index].name){
						labels.push(this.headers_[index]);
					}
				}
			}
		}
	}else{
		throw "coordinate value invalide" + this.coordinate_;
	}
	return labels;
}

digitnexus.utils.bo.LineChartBoData = function(jsonBo,parseArgs) {
    digitnexus.utils.bo.BoTable.apply(this,arguments);   
}
digitnexus.utils.inherits(digitnexus.utils.bo.LineChartBoData,  digitnexus.utils.bo.BoTable);


digitnexus.utils.bo.RadarChartBoData = function(jsonBo,parseArgs) {
    digitnexus.utils.bo.BoTable.apply(this,arguments);   
}
digitnexus.utils.inherits(digitnexus.utils.bo.RadarChartBoData,  digitnexus.utils.bo.BoTable);

digitnexus.utils.bo.RadarChartBoData.prototype.getData = function() {
    
    var origData = digitnexus.utils.bo.RadarChartBoData.superClass_.getData.call(this);
    if(!origData) {
        return [];
    }
    if(origData.length < 3) {
        throw 'You must select at least 3 column data for Radar Chart';
    }
    return origData;
}

digitnexus.utils.bo.RadarChartBoData.prototype.init_ = function() {
    if(this.headers_.length < 3) {
        throw 'At least 3 column data for Radar Chart, but now it only '
            + this.headers_.length ;
    }
    this.filterConditions_ = [];
    if(digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_) {
        for (var index = 0; index < this.headers_.length; index++) {
            if(this.headers_[index] && !this.isLabelColumn_(this.headers_[index])){
                this.filterConditions_.push(new digitnexus.utils.bo.FilterCondition(
                this.headers_[index],false));
            }
        }
    } else if (digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_) {
        
    }
    if(this.filterConditions_.length > 2) {
        this.filterConditions_[0].selected = true;
        this.filterConditions_[1].selected = true;
        this.filterConditions_[2].selected = true;
    }
}

digitnexus.utils.bo.RadarChartBoData.prototype.changeCondition = function(name,selected) {
    for(var fc = 0;fc <  this.filterConditions_.length; fc++ ) {
       if(this.filterConditions_[fc].header.name == name) {
           if(this.filterConditions_[fc].selected != selected) {
                this.filterConditions_[fc].selected = selected;
                return true;
           }else {
               return false;
           } 
       }
   }  
   return false;
}

digitnexus.utils.bo.SingleDimBoData = function(jsonBo,parseArgs) {
    digitnexus.utils.bo.BoTable.apply(this,arguments);   
}

digitnexus.utils.inherits(digitnexus.utils.bo.SingleDimBoData,  digitnexus.utils.bo.BoTable);

digitnexus.utils.bo.SingleDimBoData.prototype.getData = function() {
    var origData = digitnexus.utils.bo.SingleDimBoData.superClass_.getData.call(this);
    if(origData) {
       return origData.length > 0 ? origData[0]: []; 
    }
    return origData;
}

