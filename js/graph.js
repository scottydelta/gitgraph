
//GLOBAL VARIABLES
var repoList = [];
var accessToken="";
var loggedUser="";
var gitData;
var dateList = [];
var xlist = [];
var ylist = [];
var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var callUrl = "";

function makeRepolist(){
    var tempVal;
    var tempHtml
    $('#login').hide();
    $('#topText').hide();
    for (var i = 0; i < repoList.length; i++) {
        tempVal += '<option value=">' + repoList[i] + '">' + repoList[i] + '</option>';
    };
    tempHtml = '<p>Choose a Repositories: <select id="repoSelector" onClick="makeUrl()">' + tempVal + '</select></p><p>Enter Repository Details: <input type="text" id="customRepo" placeholder="username/reponame"><button onClick="makeUrlCus()">Draw</button>';
    $("#repoDiv").html(tempHtml);
}

function makeUrlCus(){
    
    callUrl = "https://api.github.com/repos/" + $("#customRepo").val() + "/commits?page=1&per_page=500&access_token=" + accessToken;
    loadGITdata(callUrl);
}
function makeUrl(){
    
    callUrl = "https://api.github.com/repos/" + loggedUser + "/" + $("#repoSelector option:selected").text() + "/commits?page=1&per_page=500&access_token=" + accessToken;
    loadGITdata(callUrl);
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
            for(var i=0;i<mainData.length;i++){
               dateList.push(mainData[i].commit.author.date);
                }
            makeData();
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
                marginRight: 130,
                marginBottom: 100
            },
            title: {
                text: 'Github Commit History',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: github.com',
                x: -20
            },
            xAxis: {
                categories: xlist
            },
            yAxis: {
                title: {
                    text: 'No. of Commits'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' commits'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [{
                name: $("#repoSelector option:selected").text(),
                data: ylist
            }]
        });
    }

//CODE FOR HIGH CHARTS END
