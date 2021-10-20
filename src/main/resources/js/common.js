/**
 * Project : 도시방재
 * File Name : common.js
 * 작성 : 손화영
 * 날짜 : 2019.08.02
 */

//지도 변수

var map;
var mapContainer;

var isPause = false; 	// 최신값 데이터 갱신 사용유무
var timer;				// 1분마다 최신값 데이터 갱신 interval

var MARKER_WIDTH = 24, // 기본, 클릭 마커의 너비
MARKER_HEIGHT = 36, // 기본, 클릭 마커의 높이
OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
OVER_MARKER_WIDTH = 28, // 오버 마커의 너비
OVER_MARKER_HEIGHT = 42, // 오버 마커의 높이
OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
SPRITE_MARKER_URL = '/resources/images/color.png', // 스프라이트 마커 이미지 URL
SPRITE_WIDTH = 76, // 스프라이트 이미지 너비
SPRITE_HEIGHT = 336; // 스프라이트 이미지 높이
//SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
    markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
    overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
    overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
    spriteImageSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기

var positions = []; // 마커의 위치
var positionObjects=[];
var currentPosition;

var overlays =[];
var currentOverlay;
var selectedMarker = null; // 클릭한 마커를 담을 변수

var polygons = [];
//var polygonColors = [ '#FF7B04','#a57f94','#d1cf95','#7fa384','#bda6df','#ffb16b','#7d96c9','#e8a2e8'];
var polygonColors =['#00aeef','#ff5290','#f9c606','#39b54a','#8A3FFC', '#FF7B04', '#043FB8','#F14DF1' ];

var normalImages =[], overImages =[], clickImages =[], markers =[];
var fontColors =['font-c-blue', 'font-c-red', 'font-c-yellow', 'font-c-green', 'font-c-purple' , 'font-c-orange', 'font-c-navy', 'font-c-pink'];
var bgColors =['back-c-blue', 'back-c-red', 'back-c-yellow', 'back-c-green', 'back-c-purple' , 'back-c-orange', 'back-c-navy', 'back-c-pink'];
var colors =['#00aeef','#ff5290','#f9c606','#39b54a','#8A3FFC', '#FF7B04', '#043FB8','#F14DF1' ];

// 차트 시작 시간과 종료 시간 default값
var startTime = '12H';
var endTime = 'now';

// 지점 위치와 코드 배열
//var sites = ['지점1.눌재로 6', '지점2.눌재로 11', '지점3.남산로 94', '지점4.남산로 106', '지점5.무거동 1268-17', '지점6.남산로 150', '지점7.무거동 1314-1',  '지점8.무거동 1268-2' ];
var sites = ['지점1', '지점2', '지점3', '지점4', '지점5', '지점6', '지점7',  '지점8' ];
var site_codes =['01220547764', '01220545965', '01220891520', '01220546731', '01232969512', '01232969514' , '01232969510' , '01232969511'];
var currentSensorCode = site_codes[6]; //현재 센서코드 default 값
var tickInterval = 200; //차트 x축 간격 default 값

//달력
jQuery.datetimepicker.setLocale('ko');
var maxTime, minTime;

//시계
function fn_printClock() {
	var clock = document.getElementById("clock");


    var currentDate = new Date();
    var yyyy = currentDate.getFullYear();
    var mmdd = fn_addZeros((currentDate.getMonth()+1), 2) + "/" + fn_addZeros(currentDate.getDate(), 2);
    var amPm = 'AM'; // 초기값 AM
    var currentHours = fn_addZeros(currentDate.getHours(),2);
    var currentMinute = fn_addZeros(currentDate.getMinutes() ,2);
    var currentSeconds =  fn_addZeros(currentDate.getSeconds(),2);

    if(currentHours >= 12){ // 시간이 12보다 클 때 PM으로 세팅, 12를 빼줌
    	amPm = 'PM';
    	currentHours = fn_addZeros(currentHours - 12,2);
    }

    if(currentSeconds >= 55){// 50초 이상일 때 색을 변환해 준다.
       currentSeconds = '<span class="font-c-red">'+currentSeconds+'</span>'
    }

    $('#yyyy').text(yyyy);
    $('#mmdd').text(mmdd);

    clock.innerHTML = '<span class="ampm font-s30 font-c-blue">'+amPm+'</span><span class="current font-s50">'+currentHours+":"+currentMinute+":"+currentSeconds+'</span>';

    setTimeout("fn_printClock()",1000);         // 1초마다 printClock() 함수 호출
}



// 자릿수에 따라 앞에 '0' 붙이기
function fn_addZeros(num, digit) { // 자릿수 맞춰주기
	  var zero = '';
	  num = num.toString();
	  if (num.length < digit) {
	    for (i = 0; i < digit - num.length; i++) {
	      zero += '0';
	    }
	  }
	  return zero + num;
}


//기상정보 보여주기
function rTime_wth(){
	getRealtimeData().done(function(data) {
		var dt, temp, humi, pres;
		$.each(data, function(index, list){
			dt= list.measure_dt;
			temp= list.temp_val;
			humi= list.humi_val;
			pres= list.pres_val;

		});
		$('.realtime').text(dt.substring(0,16));
		$('#temp').text(temp);
		$('#humi').text(humi);
		$('#pres').text(pres);
	})
}



//강우량 차트 불러오기
function fn_rainChartData(startTime, endTime){
	var cumulative_rainfall = 0;

	getRainChartData(startTime, endTime).done(function(data) {
		var insert_dt  = new Array();
		var rain_val = new Array();

		var arr_cumul_rainfall = new Array(); // 누적 강우량 담을 배열

		var pre_rainVal =0;
		var now_rainVal_differ =0;
		$.each(data, function(index, list){

			   var date = (list.insert_dt.split(' ')[0]).split('-');
			   var time = (list.insert_dt.split(' ')[1]).split(':');
			   var x = Date.UTC(date[0], date[1]-1, date[2], time[0], time[1]);

			   insert_dt.push(list.insert_dt);

			   rain_val.push([x, list.rain_val]);

			   if(index == 1){
				   cumulative_rainfall += list.rain_val;//해당의 시작이기에 첫 데이터를 넣는다.
			   }else{
				   cumulative_rainfall += pre_rainVal;
			   }

			   arr_cumul_rainfall.push([x, cumulative_rainfall]);

			   pre_rainVal = list.rain_val;//누적강우량
		});
		createRainChart(insert_dt, rain_val, arr_cumul_rainfall);

	})

}


//유출량 차트 불러오기

function fn_flowChartData(startTime, endTime){
	//$('.flow-sum').remove();
	//$('.flow-sum-b').remove();
	var dataSeries =[];
	var t =[];
	var flowSum =[];
	var minDate = '';
	for(var i=0; i < sites.length; i++){
		t[sites[i]]=  new Array();
		flowSum[sites[i]] =0;

	}
	getFlowChartData(startTime, endTime).done(function(data) {

		$.each(data, function(index, list){

			for(var i=0; i < site_codes.length; i++){
				if(list.sensor_cd == site_codes[i]){
					var date = (list.insert_dt.split(' ')[0]).split('-');
					var time = (list.insert_dt.split(' ')[1]).split(':');
					var flow = list.flow; //20200205 보정전

					var xy = [Date.UTC(date[0], date[1]-1, date[2], time[0], time[1]), flow];
					t[sites[i]].push(xy);
					flowSum[sites[i]] = flowSum[sites[i]]+flow;

				}
			}
		});
         var len = 0;

			for(var i=0; i < sites.length; i++){
				len = t[sites[0]].length;
				minDate = t[sites[0]][0][0];
				//console.log(minDate);

				var selected = false, visible =false;
				if(i == 3 || i==6){
					selected = true;
					visible = true;
				}

				dataSeries[i] = {
						name:sites[i]+" : "+(flowSum[sites[i]]*60).toFixed(2)+"㎥"
						,tooltip:sites[i]
						,data:t[sites[i]]
						,color:colors[i]
						,selected: selected
						,visible: visible
				 		};

			}

/*			var html = '<div class="flow-sum font-normal back-c-white">';
			var html2 = '<div class="flow-sum-b font-normal back-c-white">';
			for(var i=0; i < sites.length; i++){
				if(i<4){
					html+= '	<p class="font-s13 '+fontColors[i]+'">─지점'+(i+1)+ '총유출량:&nbsp;<span class="font-c-black">'+(flowSum[sites[i]]*60).toFixed(2)+'㎥/s</span></p>';
				}else{
					html2+= '	<p class="font-s13 '+fontColors[i]+'">─지점'+(i+1)+ '총유출량:&nbsp;<span class="font-c-black">'+(flowSum[sites[i]]*60).toFixed(2)+'㎥/s</span></p>';
				}
			}

			html+= '</div>';
			html2+= '</div>';*/

			createFlowChart(dataSeries, Math.round(len/7.2), minDate);
		//$('.bottom-left-body-wrap .sub-title-wrap .sub-title').after(html);
		//$('.bottom-left-body-wrap .sub-title-wrap .sub-title').after(html2);
	})


}


//지점별 차트 불러오기
var lMax =[600,600,1200,1200,1200,1200,1200,1200], vMax=[5,3,3,3,3,3,3,3];
function fn_eachChartData(startTime, endTime, sensorCode){

	getEachChartData(startTime, endTime, sensorCode).done(function(data) {
		 var level = new Array();
		 var velocity = new Array();
		 var flow = new Array();
		 var insert_dt = new Array();
		 var flow_o = new Array();  		// 유량_기존 데이터 _ DB 원 데이터 값
		 var velocity_o = new Array();  	// 유속_기존 데이터 _ DB 원 데이터 값
		 var seriesArr = new Array();		// 차트 series 배열



		$.each(data, function(index, list){
			var date = (list.insert_dt.split(' ')[0]).split('-');
			var time = (list.insert_dt.split(' ')[1]).split(':');
			var x = Date.UTC(date[0], date[1]-1, date[2], time[0], time[1]);

			flow_o.push([x,list.flow]);
//			flow.push([x,list.calc_flow]);	//201028 다른 보정식으로 수정
			if(list.calib_flow == 0) {
				flow.push([x,null]);
			}else {
				flow.push([x,list.calib_flow]);
			}
			velocity_o.push([x,list.velocity]);

			insert_dt.push(list.insert_dt);

//			velocity.push([x,list.calc_velocity2]);	//201028 다른 보정식으로 수정
			if(list.calib_velocity == 0) {
				velocity.push([x,null]);
			}else {
				velocity.push([x,list.calib_velocity]);
			}
			level.push([x,list.level]);


			for(var i=0; i <lMax.length; i++){
				if(list.sensor_cd == site_codes[i]){ // 센서코드와 일치시 수심, 유속의  y축 값 넣기
					lM = lMax[i];
					vM = vMax[i];
				}
			}


		});




		var objFlow = {
		        name: '유출량(㎥/s)',
		        data: flow_o,
		        yAxis:0,
		        color: '#00468b'
		       };

		var objLevel = {
			        name: '수심(mm)',
			        data: level,
			        yAxis:1,
			        color: '#00a79b'
			       };

		var objVelocity = {
			        name: '유속(m/s)',
			        yAxis:2,
			        data: velocity_o,
			        color: '#f47920'
			       };
		var objVelocity_after = {
		        name: '유속-보정 후 데이터',
		        yAxis:2,
		        data: velocity,
		        color: '#b542eb'
		       };

		var objFlow_after = {
			        name: '유출량-보정 후 데이터',
			        data: flow,
			        yAxis:0,
			        color: '#b6f542'
			       };
		seriesArr.push(objFlow);
		seriesArr.push(objLevel);
		seriesArr.push(objVelocity);
		seriesArr.push(objVelocity_after);
		seriesArr.push(objFlow_after);
		if(client == 'researcher'){ // 메인차트
			createEachChart(seriesArr, insert_dt, lM, vM);
		}else{// 차트 series 배열  - iot 차트 (보정 후 데이터 표출)
			seriesArr.push(objVelocity_after);
			seriesArr.push(objFlow_after);
			createEachChart(seriesArr, insert_dt, lM, vM);
		}
	})
	currentSensorCode = sensorCode;
}

// 지점별 라디오 버튼 클릭시
function fn_radioBtn(sensorCode){
	var sdt =$('#hideStartDT').val();
	var edt =$('#hideEndDT').val();

	fn_rainChartData(sdt,edt);
	fn_flowChartData(sdt,edt);
	fn_eachChartData(sdt,edt, sensorCode);

	for(var i =0; i<markers.length; i++){
		markers[i].setImage(normalImages[i]);
		overlays[i].setMap(null);
			if(site_codes[i] == sensorCode ){
				markers[i].setImage(clickImages[i]);

				selectedMarker = markers[i];

				overlays[i].setMap(map);
				currentOverlay = overlays[i];


		        currentPosition = positions[i];
		        map.setCenter(currentPosition);
			}
	}

	stopTimer();

}

// 시간 버튼 클릭시
function fn_timeBtn(time){
		 // 달력 검색 초기화
		 maxTime ='';
		 minTime ='';
		 $('#startDatetime').val('');
		 $('#endDatetime').val('');

	endTime = 'now';

	fn_rainChartData(time, endTime);
	fn_flowChartData(time, endTime);
	fn_eachChartData(time, endTime, currentSensorCode)

	$('#hideStartDT').val(time);
	$('#hideEndDT').val(endTime);
	switch (time){
    case "1H" :
    	 $('.btn-on').removeClass('btn-on');
    	 $('.h1').addClass('btn-on');
        break;
    case "2H" :
    	 $('.btn-on').removeClass('btn-on');
    	 $('.h2').addClass('btn-on');
        break;
    case "3H" :
    	 $('.btn-on').removeClass('btn-on');
    	 $('.h3').addClass('btn-on');
        break;
    case "6H" :
    	 $('.btn-on').removeClass('btn-on');
    	 $('.h6').addClass('btn-on');
        break;
    case "12H" :
    	$('.btn-on').removeClass('btn-on');
    	 $('.h12').addClass('btn-on');
        break;
    case "24H" :
    	$('.btn-on').removeClass('btn-on');
   	 	$('.h24').addClass('btn-on');
       break;
    default :
    	$('.btn-on').removeClass('btn-on');
	}
	stopTimer();

}

// 날짜 검색 후 버튼 클릭시
function fn_searchBtn(){
	startTime = $('#startDatetime').val();
	endTime = $('#endDatetime').val();

	$('#hideStartDT').val(startTime); // type:hidden에 날짜 넣어주기 //엑셀 다운로드 사용
	$('#hideEndDT').val(endTime);

	var compare = fn_compare(startTime, endTime);


	if(compare == 'start'){
	//	updateOverlay(currentSensorCode);
		fn_rainChartData(startTime, endTime);
		fn_flowChartData(startTime, endTime);
		fn_eachChartData(startTime, endTime, currentSensorCode);
		stopTimer();
	}else if (compare == 'stop'){
		alert("시작일이 종료일보다 작아야 합니다.");
	}

	 maxTime='';
	 minTime='';

	 $('.btn-on').addClass('btn-off');
	 $('.btn-on').removeClass('btn-on');


}

//초기화 버큰 클릭시
function fn_resetBtn(){
	 maxTime ='';
	 minTime ='';

	 $('#startDatetime').val('');
	 $('#endDatetime').val('');

	 $('#hideStartDT').val('12H');
	 $('#hideEndDT').val('now');

     $("input:radio[name='radio-group']").prop('checked', false); // 해제하기
     $(".radio-btn-wrap > span:NTH-OF-TYPE(7) > [type='radio']").prop('checked', true); // 선택하기 // 초기화시 라디오 버튼 체크 번호   - 현재 7번마커
	 currentSensorCode = site_codes[6]; // 초기화시 센서코드 번호  - 현재 7번마커

	 startTimer();
	 $('.btn-on').removeClass('btn-on');
	 $('.h12').addClass('btn-on');
}

//엑셀 다운로드 클릭시
function fn_dowloadBtn(){
	var start = $('#hideStartDT').val();
	var end = $('#hideEndDT').val();

	if( start.substr(start.length-1) == 'H'){
		location.href="/excelDownload?startTime="+start+"&endTime="+end+"&client="+ client;
	}else{
		var compare = fn_compare(start, end);

		if(compare == 'start'){
			location.href="/excelDownload?startTime="+start+"&endTime="+end+"&client="+ client;
		}else if (compare == 'stop'){
			alert("시작일이 종료일보다 작아야 합니다.");
		}
	}


}

function fn_compare(start, end){


	var startArr = start.split(' ');
	var startDayArr = startArr[0].split('-');
	var startTimeArr = startArr[1].split(':');

	var startDay = startDayArr[0]+startDayArr[1]+startDayArr[2];
	var startTime = startTimeArr[0]+startTimeArr[1];
	var s = startDay+startTime;



	var endArr = end.split(' ');
	var endDayArr = endArr[0].split('-');
	var endTimeArr = endArr[1].split(':');

	var endDay = endDayArr[0]+endDayArr[1]+endDayArr[2];
	var endTime = endTimeArr[0]+endTimeArr[1];
	var e = endDay+endTime;

	if( s > e ){
		return 'stop';
	} else{
		return 'start';
	}

}


// 그래프 x축 간격
function fn_switch(cLen){

	var categoriesLenth = cLen;
		tickInterval = Math.round(categoriesLenth/7.2);

}


// 날짜 기간 막기
jQuery(document).on('click','#startDatetime', function(){
	if(maxTime==''||maxTime==null) maxTime = new Date();
	 //var minYYMMDD = new Date('10/1/2019');
	jQuery('#startDatetime').datetimepicker({
		format:'Y-m-d H:i',
		onShow:function( ct ){
			if(minTime==null||minTime==''){
				this.setOptions({
			//		   minDate:minYYMMDD,
					   maxDate:maxTime
			   })
			}else{
				this.setOptions({
			//		minDate:minYYMMDD,
					maxDate:maxTime
			   })
			}
		},onChangeDateTime:function(dp,$input){
			jQuery('#endDatetime').prop("readonly",false);
			var d = (jQuery('#startDatetime').val()).split(" ");
			var e = new Date(d[0]);
			minTime = jQuery('#startDatetime').val();
			maxTime = e.setDate(e.getDate()+4);
			startTime = minTime = jQuery('#startDatetime').val();

			$('#hideStartDT').val(startTime);
		}
	});
	jQuery('#endDatetime').datetimepicker({
		format:'Y-m-d H:i',
		onShow:function( ct ){
			   this.setOptions({
				minDate:minTime,
				maxDate:maxTime
			})
		},onChangeDateTime:function(dp,$input){
			if(jQuery('#endDatetime').val()){
				var d = (jQuery('#endDatetime').val()).split(" ");
				var s = new Date(d[0]);
				minTime = s.setDate(s.getDate()-1);
				maxTime = jQuery('#endDatetime').val();
				endTime = jQuery('#endDatetime').val();
			}

			$('#hideEndDT').val(endTime);
		}
	});
})


// 보정 값 표출 팝업창
function popupOpen(){
	calibList();
	setSiteList();
	$("#myModal").show();
	/*var url= "calib_table";    //팝업창에 출력될 페이지 URL
	var winWidth = 700;
    var winHeight = 700;
    var popupOption= "width="+winWidth+", height="+winHeight;    //팝업창 옵션(optoin)
    var myWindow = window.open(url,"TestName",popupOption);*/

}
// 보정 값 표출 팝업창
function popupClose(){
	$("#myModal").hide();
}


function popupOpen2(){

	var url= "site_table";    //팝업창에 출력될 페이지 URL
	var winWidth = 1200;
    var winHeight = 420;
    var popupOption= "width="+winWidth+", height="+winHeight;    //팝업창 옵션(optoin)
    var myWindow = window.open(url,"TestName",popupOption);

}

