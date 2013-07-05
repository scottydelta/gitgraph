//GLOBAL VARIABLES
var repoList = [];
var accessToken="";
var loggedUser="";
var gitData=[];
var dateList = [];
var xlist = [];
var ylist = [];
var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var callUrl = "";
var shaList = [];
var userAndrepo = "";
var dataDict = {};
var last_sha = "";
var setInter;
function makeRepolist(){
    var tempVal;
    var tempHtml
    $('#login').hide();
    $('#topText').hide();
    for (var i = 0; i < repoList.length; i++) {
        tempVal += '<option value=">' + repoList[i] + '">' + repoList[i] + '</option>';
    };
    tempHtml = '<p>Choose a Repositories: <select id="repoSelector">' + tempVal + '</select><button onClick="makeUrl();inter();">Draw</button></p><p>Enter Repository Details: <input type="text" id="customRepo" placeholder="username/reponame"><button onClick="makeUrlCus();inter();">Draw</button>';
    $("#repoDiv").html(tempHtml);
}

function makeUrlCus(){
	userAndrepo = $("#customRepo").val();
	callUrl = "https://api.github.com/repos/" + userAndrepo + "/commits?per_page=100&last_sha=" + last_sha + "&access_token=" + accessToken;
	getCommitHistory(callUrl);
}

function makeUrl(){
	userAndrepo = loggedUser + "/" + $("#repoSelector option:selected").text();
	callUrl = "https://api.github.com/repos/" + userAndrepo + "/commits?per_page=100&last_sha=" + last_sha + "&access_token=" + accessToken;
	getCommitHistory(callUrl);
}
function getCommitHistory(callUrl){
	gitData = [];
	var tempVar = [];
	last_sha = "";
	shaList = [];
	dateList = [];
	while(true){
	$.ajax({
		url: callUrl,
		dataType: 'json',
		async: false,
		success: function(localData){
			tempVar = localData;
            		for(var i=0;i<localData.length;i++){
               		    dateList.push(localData[i].commit.author.date);
			    shaList.push(localData[i].sha);
        		    }
			}
		});
	if(tempVar.length===0)
		break;
	last_sha = tempVar[tempVar.length-1].sha;
	callUrl = "https://api.github.com/repos/" + userAndrepo + "/commits?per_page=100&last_sha=" + last_sha + "&access_token=" + accessToken;
	}
	dataDict = {};
	makeData();
	makeSha();
	last_sha = "";
}

function loadGITdata(callUrl){
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
    else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            gitData = xmlhttp.responseText;
            mainData = JSON.parse(gitData);
            dateList = [];
	    shaList = [];
            for(var i=0;i<mainData.length;i++){
               dateList.push(mainData[i].commit.author.date);
		shaList.push(mainData[i].sha);
                }
            makeData();
	    makeSha();
            }
        }
        xmlhttp.open("GET", callUrl ,true);
        xmlhttp.send();
}

//GENERATES X-AXIS DATA FOR
function makeData (){
        var currDate = dateList[dateList.length-1];
        xlist = [];
        ylist= [];
        while(Date.parse(dateList[0])-Date.parse(currDate) > 0){
            var currmonth = parseInt(currDate.slice(5,7));
            var currYear =  parseInt(currDate.slice(0,4));
            xlist.push("W 1, " + monthList[currmonth-1] + " " + currYear);
            ylist.push(0);
            xlist.push("W 2, " + monthList[currmonth-1] + " " + currYear);
            ylist.push(0);
            xlist.push("W 3, " + monthList[currmonth-1] + " " + currYear);
            ylist.push(0);
            xlist.push("W 4, " + monthList[currmonth-1] + " " + currYear);
            ylist.push(0);
            if (currmonth ===12){
                currDate = String(currYear + 1) +  "-01-" +  "01T00:00:00Z";
            }
            else if(currmonth <9){
                currDate = String(currYear) +  "-0" + String(currmonth+1) + "-" +  "01T00:00:00Z";
            }
            else{
                currDate = String(currYear) + "-" + String(currmonth+1) + "-" + "01T00:00:00Z";
            }
            

        }
    make_ylist();

}
//GENERATES Y-AXIS DATA FOR
function make_ylist() {
    for (var i = dateList.length - 1; i >= 0; i--) {
        tempDate = dateList[i].slice(8,10);
        tempMonth = dateList[i].slice(5,7);
        tempYear =  dateList[i].slice(0,4);
        if(parseInt(tempDate) > 28)
            tempDate = 27;
        var xelement = "W " + String(Math.ceil(parseInt(tempDate)/7)) + ", " + String(monthList[parseInt(tempMonth)-1]) + " " + tempYear;
        var index = xlist.indexOf(xelement);
        ylist[index] += 1;
    };
    $(function() { makeChart(); });
}

//CODE FOR HIGHCHARTS JS
function makeChart() {

    $('#container').highcharts({
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: 'Github Commit History'
        },
        subtitle: {
            text: 'Source: github.com'
        },
        credits: {
            enabled: true,
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5
            },
            href: "http://www.accelerator2.cloudapp.net",
            text: "Project Borg"
        },
        xAxis: {
            categories: xlist,
           
        },
        scrollbar: {
            enabled: true
        },

        yAxis: {
           
            title: {
                text: 'No. of Commits'
            }
        },
        legend: {
            shadow: true
        },
        tooltip: {
                valueSuffix: ' commits'
            },
        plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
        series: [{
            name: userAndrepo,
            data: ylist}],
	        
            scrollbar: {
                enabled: true,
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonArrowColor: 'white',
                buttonBorderRadius: 7,
                rifleColor: 'white',
                trackBackgroundColor: 'white',
                trackBorderWidth: 1,
                trackBorderColor: 'silver',
                trackBorderRadius: 7
            }
        });
   
}
//CODE FOR HIGH CHARTS END

function inter(){
	$("#loaderImg").show();
	setInter = setInterval(printData, 1000);
}
function printData(){
	if(Object.keys(dataDict).length=== dateList.length){
		$("#comiCon").html("");
		for(var i=1; i<= Object.keys(dataDict).length; i++){
			commitRecord = "<p>" + dataDict[i][0] + ". Commit on: " + dataDict[i][1] + ", commit message: " + dataDict[i][2] + "</br><font style='background-color:#D8D8D8'>" + dataDict[i][3]  + " Additions, " + dataDict[i][4] + " Deletions in "+  dataDict[i][5] + " days since last commit</font></p>";
			$("#comiCon").append(commitRecord);
	
		}
		$("#loaderImg").hide();
		window.clearInterval(setInter);
	}
	else{
		$("#percent").html(Object.keys(dataDict).length + "/" + dateList.length);
	}
}

function makeSha(){
        for(var i=shaList.length-1;i>=0;i--){
		shacallUrl = "https://api.github.com/repos/" + userAndrepo + "/commits/" + shaList[i] + "?access_token=" + accessToken;
		getshaData1(shacallUrl,dateList[i+1],shaList.length-i);
	}
	return "success";
}   
function getshaData1(shaUrl, dater, no){
	$.ajax({
		url: shaUrl,
		dataType: 'json',
		success: function(data){
			nowDate = data.commit.author.date;
			if(typeof dater =='undefined')
				dater = nowDate;
			var d = parseInt(Date.parse(nowDate)) -parseInt(Date.parse(dater));
			var days=1000*60*60*24;
			var comiDay=Math.round(d/days);		
			dataDict[no] = [no, data.commit.author.date, data.commit.message, data.stats.additions, data.stats.deletions, comiDay];
		}
	});
}
