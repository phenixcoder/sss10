/*******************************************************
Interpolation formulas for acceleration and velocity
********************************************************/

//Values of Fa lookup table
function faTable(){
	var faLookup = [0.7,0.7,0.8,0.8,0.8,
					0.8,0.8,0.9,1.0,1.0,
					1.0,1.0,1.0,1.0,1.0,
					1.3,1.2,1.1,1.1,1.0,
					2.1,1.4,1.1,0.9,0.9];
	return faLookup;
}

//Values for Fv lookup table
function fvTable(){
	var fvLookup = [0.5,0.5,0.5,0.6,0.6,
					0.6,0.7,0.7,0.8,0.8,
					1.0,1.0,1.0,1.0,1.0,
					1.4,1.3,1.2,1.1,1.1,
					2.1,2.0,1.9,1.7,1.7];
	return fvLookup;
}

function formatSiteOption(letters){
	var choice;

	if(letters === JSON.stringify("A","A"))
		choice = 0;
	else if(letters === JSON.stringify("B","B"))
		choice = 1;
	else if(letters === JSON.stringify("C","C"))
		choice = 2;
	else if(letters === JSON.stringify("D","D"))
		choice = 3;
	else if(letters === JSON.stringify("E","E"))
		choice = 4;
	else
		choice = 5;
	return choice;
}


function getTableRow(table, row_location, row_length){
	var choice = [];
	var table_location = row_location * row_length;
	if(table_location < 0) table_location = 0;
	for(var i = 0; i < row_length;i++){
		choice[i] = table[table_location+i];
	}
	return choice;
}

function getLookUpTableValue (table, row_location, col_location, row_length) {
	var choice;
	var table_location = row_location * row_length -1;
	if(table_location > row_length - 1 ){
		choice = table_location +col_location  ;
	}else{
		choice = col_location;
	}
	return choice;
}

//Can be used to find the Fa & Fv interp
/**
	Parameters: 
				fArr: - An array of 5 numeric values
				sa: - A single numeric const  


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
					interp[i] = (sa - f_const[i-1]) / f_const[0]*(fArr[i] - fArr[i-1]) + fArr[i-1]; 
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
	choice = Math.max.apply(null, favInterp);
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
function getIeFAVSa(ie,fav,sa){
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

function getAppRestrFASa02 (faSa, rtrnVal){
	var f_const = [0.2,0.35,0.75];
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
				importanceCtg: - value is true/false
	Return:
				choice: - return the min value from fvSa & faSa if ctgryChoice is false else return 0
*/
function getFinalRestr(fvSa, faSa, importanceCtg, i){
	var choice = null;

	if(i > 10 && importanceCtg === 1.5){
		choice = 0;
	}
	else
	{
		if(fvSa > faSa)
			choice = faSa;
		else
			choice = fvSa;
	}

	return choice;
}

/*************************************************************************
Structural systems data and tests of possible usage
**************************************************************************/

/**
*/
function checkFaSa(faSa){
	var choice = null;
	if(faSa <= 0.12)
		choice = 0;
	else
		choice = 1;
	return choice;
}

/**
*/
function getHeightLimit(hght, finalRestriction){
	var choice = null;
	if(finalRestriction === 999)
		choice = "No limit";
	else if(finalRestriction === 0 || hght > finalRestriction)
		choice = "Not permitted";
	else
		choice = finalRestriction;
	return choice;
}

