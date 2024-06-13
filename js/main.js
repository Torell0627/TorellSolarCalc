/*jslint browser:true */
"use strict";
function addMonths(elem)
{
	var annualUseKw = 0, dailyUseKw = 0, i = 0, x = 0;
	var months = document.getElementById(elem).getElementsByTagName('input');
	for(i=0;i<months.length;i++)
	{
		x = Number(months[i].value);
		annualUseKw += x;
	}
	dailyUseKw = annualUseKw/365;
	return dailyUseKw;
}

function sunHours()
{	
	var hrs;
	var theZone = document.forms.solarForm.zone.selectedIndex;
	theZone+=1;
	switch(theZone)
	{
		case 1:
			hrs = 0;
		case 2:
			hrs = 6;
			break;
		case 3:
			hrs = 5.5;
			break;
		case 4:
			hrs = 5;
			break;
		case 5:
			hrs = 4.5;
			break;
		case 6:
			hrs = 4.2;
			break;
		case 7:
			hrs = 3.5;
			break;
		default:
			hrs = 0; 
	}
	return hrs;
}

function calculatePanel()
{
	var userChoice = document.forms.solarForm.panel.selectedIndex;
	var panelOptions = document.forms.solarForm.panel.options;
	var power = panelOptions[userChoice].value;
	var name = panelOptions[userChoice].text;
	var x = [power, name];
	return x;
}


function calculateSolar()
{

	var dailyUseKw = addMonths('mpc');
	var sunHoursPerDay = sunHours();
	var minKwNeeds = dailyUseKw/sunHoursPerDay;
	var realKwNeeds = minKwNeeds * 1.25;
	var realWattNeeds = realKwNeeds * 1000;
	var panelInfo = calculatePanel();
	var panelOutput = panelInfo[0];
	var panelName = panelInfo[1];
	var panelsNeeded = Math.ceil(realWattNeeds/panelOutput);
	
	var feedback = "";
	feedback += "<p>Based on your average daily use of "+Math.round(dailyUseKw)+" kWh you will need to purchase "+panelsNeeded+" "+panelName+" solar panels to offset 100% of your electricity bill</p>";
	feedback += "<h2>Additional Details</h2>";
	feedback += "<p>Your average daily electricity consumption: "+Math.round(dailyUseKw)+" Kwh per day.</p>";
	feedback += "<p>Average sunshine hours per day: "+sunHoursPerDay+" hours</p>";
	feedback += "<p>Realistic watts needed per hour: "+Math.round(realWattNeeds)+" watts/hour.</p>";
	feedback += "<p>The "+panelName+" panel you selected generates about "+panelOutput+" watts per day.</p>";
	
	document.getElementById('feedback').innerHTML = feedback;
}
document.addEventListener("DOMContentLoaded", function() {
    const form = document.forms.solarForm;
    const inputs = form.querySelectorAll('input[type="number"]');
    const zoneSelect = form.zone;
    const panelSelect = form.panel;

    inputs.forEach(input => {
        input.addEventListener('input', updateCalculation);
    });

    zoneSelect.addEventListener('change', updateCalculation);
    panelSelect.addEventListener('change', updateCalculation);

    function validateForm() {
        let valid = true;
        inputs.forEach(input => {
            if (input.value === "" || isNaN(input.value) || input.value < 0) {
                valid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        if (zoneSelect.selectedIndex === 0 || panelSelect.selectedIndex === 0) {
            valid = false;
        }
        return valid;
    }

    function updateCalculation() {
        if (validateForm()) {
            calculateSolar();
        } else {
            document.getElementById('feedback').innerHTML = "<p>Please enter valid data in all fields to calculate your solar needs.</p>";
        }
    }
});
