digitnexus.re.operators.FilterOperator = function () {
		digitnexus.utils.MashupOperator.apply(this,arguments);
		this.TAG = "ConditionOperator ";
	        this.id = 500;
		this.type = 500;
		this.name = "ConditionOperator";
		this.descript = "A test operator for testing";	
	};
        
        digitnexus.utils.inherits(digitnexus.re.operators.FilterOperator,digitnexus.utils.MashupOperator);
        digitnexus.re.operators.FilterOperator.prototype.execute = function(context) {
		context.setOutputParameters(context.getInputParameters());
		//context.outputDatasources[0].['data'] = context.inputNodes[0].['data']
        }
        digitnexus.re.operatorManager.registerOperator(new digitnexus.re.operators.FilterOperator());