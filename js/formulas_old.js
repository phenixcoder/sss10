/*******************************************************
Interpolation formulas for acceleration and velocity
********************************************************/

//Can be used to find the Fa & Fv interp
/**
	Parameters: 
				fArr: - An array of 5 numeric values
				sa: - A single numeric const  
				f_const[]: - An Array of 5 numeric values

	Return: interp[] - the results at most 6 numeric values or null 
*/

function getFAVInterp(fArr, sa, f_const){
	//var f_const = [0.25,0.5,0.75,1,1.25];
	var interp = [0,0,0,0,0,0];

	if(fArr.length === 5){
		for (var i = 0; i < interp.length; i++) {
			if(i === 0)
				interp[i] = (sa <= f_const[i]) ? fArr[0]: null;
			else if (i === 5)
				interp[i] = (sa >= f_const[i-1]) ? fArr[4]: null;
			else
				if (sa > f_const[i-1]  && sa <= f_const[i])
					interp[i] = (sa - f_const[i-1]) / f_const[0]*(fArr[1] - fArr[0]) + fArr[0]; 
				else
					interp[i] = null;		
		};
	}

	return interp;
}


/**
	Parameter:
				favInterp: - is an array of numeric values
	Returns: 
				choice: - returns the largest value from the array 
*/
function getFAV(favInterp){
	var choice = null;
	choice = Math.max(faInterp);
	return choice;
}


/**
	Parameters: 
				ie: - is an numeric value
				fav: - is the numeric value of Fa/Fv
				sa: - is th numeric value of Sa(0.2)/Sa(1.0)
	Returns:
				choice: - returns the product of all three values
*/
function getIeFAVSa02(ie,fav,sa){
	var choice = null;
	choice = ie * fav * sa;
	return choice;
}
 

/*************************************************************************
Structural systems data and tests of possible usage
**************************************************************************/

/**
	Parameters:
				faSa: - is a single numeric value from IEFaSa02
				rtrnVal: - an array of 4 numeric values from restrictions and one of these values maybe returned
				f_const: - an array of 3 numeric values used to compare against rtrnVal
	Return:
				choice: - contains rtrnVal that is selected else returns null
*/

function getAppRestrFASa02 (faSa, rtrnVal, f_const){
	//var f_const = [0.2,0.35,0.75];
	var choice = null;
	if(rtrnVal.length === 4){
		if(faSa < f_const[0])
			choice = rtrnVal[0];
		else
			if (faSa < f_const[1])
				choice = rtrnVal[1];
			else
				if (faSa < 0.75) 
					choice = rtrnVal[2];
				else
					choice = rtrnVal[3]
	}
	return choice;
}

/**
	Parameters:
				fvSa: - is a single numeric value IEFvSa10
				rtrnVal: - is a single numeric value
	Return:
				choice: - returns the rtrnVal if it passes the condition else 999
*/

function getAppRestrFVSa10(fvSa, rtrnVal){
	var f_const = 0.3;
	var choice = null;
	if(fvSa > 0.3)
		choice = rtrnVal;
	else
		choice = 999;

	return choice;
}

/**
	Parameters:
				fvSa: - is a single numeric value
				faSa: - is a single numeric value
				ctgryChoice: - value is true/false
	Return:
				choice: - return the min value from fvSa & faSa if ctgryChoice is false else return 0
*/
function getFinalRestr(fvSa,faSa,ctgryChoice){
	var choice = null;
	if(ctgryChoice === false)
		choice = Math.min(fvSa,faSa);
	else
		choice = 0;
	return choice;
}

