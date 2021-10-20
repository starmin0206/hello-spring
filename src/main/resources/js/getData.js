/**
 * Project : 도시방재
 * File Name : getData.js
 * 작성 : 손화영
 * 날짜 : 2019.08.02
 */


//위치 정보 가져오기
function getSitesInfo() {
	return $.ajax({
		type : 'POST',
		url : '/sitesInfo',
		dataType : 'json',
		error : function(request, status, error) {
			console.log(error)
		}
	})
}

//강우량 차트 데이터 가져오기
function getRainChartData(startTime, endTime){
	return $.ajax({
		type : 'POST',
		url : '/rainChartData',
		dataType : 'json',
		data : {startTime : startTime, endTime: endTime},
		error : function(request, status, error) {
			console.log(error)
		}
	})
}

//실시간 기상정보 가져오기

function getRealtimeData(){
	return $.ajax({
		type : 'POST',
		url : '/realTimeData',
		dataType : 'json',
		error : function(request, status, error) {
			console.log(error)
		}
	})
}

//유출량 차트 데이터 가져오기
/*function getFlowChartData(startTime, endTime){
	return $.ajax({
		type : 'POST',
		url : '/flowChartData',
		dataType : 'json',
		data : {startTime : startTime, endTime: endTime},
		error : function(request, status, error) {
			console.log(error)
		}
	})
}*/
//유출량 차트 데이터 가져오기
function getFlowChartData(startTime, endTime){
	return $.ajax({
		type : 'POST',
		url : '/getFlowChartData',
		dataType : 'json',
		data : {startTime : startTime, endTime: endTime},
		error : function(request, status, error) {
			console.log(error)
		}
	})
}


//지점별 차트 데이터 가져오기
function getEachChartData(startTime, endTime, sensor_cd){
	return $.ajax({
		type : 'POST',
		url : '/eachChartData',
		dataType : 'json',
		data : {startTime : startTime, endTime: endTime, sensor_cd : sensor_cd},
		error : function(request, status, error) {
			console.log(error)
		}
	})
}
//지점별 보정식 가져오기
function getEachCalibData(){
	return $.ajax({
		type : 'POST',
		url : '/eachCalibData',
		dataType : 'json',
		error : function(request, status, error) {
			console.log(error)
		}
	})
}

//지점별 최신 데이터 가져오기
function getSitesLastInfo(){
	return $.ajax({
		type : 'POST',
		url : '/sitesLastInfo',
		dataType : 'json',
		error : function(request, status, error) {
			console.log(error)
		}
	})
}


//지점별 정보 가져오기
function getEachSiteInfoData(startTime, endTime){
	return $.ajax({
		type : 'POST',
		url : '/eachSiteInfoData',
		dataType : 'json',
		error : function(request, status, error) {
			console.log(error)
		}
	})
}

//지점별 보정식 적용 조건 가져오기
function getCalibCondition(sensor_cd){
	console.log("sensor_cd : " + sensor_cd)
	return $.ajax({
		type : 'POST',
		url : '/getCalibCondition',
		dataType : 'json',
		data : {sensor_cd : sensor_cd},
		error : function(request, status, error) {
			console.log(error)
		}
	})
}
