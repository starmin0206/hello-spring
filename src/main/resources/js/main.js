/**
 * Project : 도시방재
 * File Name : main.js
 * 작성 : 손화영
 * 날짜 : 2019.08.02
 */




$(document).ready(function() {

	fn_printClock();  //시계 만들기

	startTimer(); 	  // 지도 생성 및 차트 갱신
})


function startTimer(){
    isPause = false;
    reloadLastData();
    timer = setInterval(
    		"reloadLastData()"
    ,60000);
}

function stopTimer(){
    clearInterval(timer);
    isPause = true;
}



function reloadLastData(){
	$('.overlay').remove();
	if(!isPause){
	createMap()// 지도 생성
	createPosition(); //마커 위치
	rTime_wth(); //기상정보
	fn_rainChartData('12H', 'now'); //강우량 차트
	fn_flowChartData('12H', 'now'); //유출량 차트
	fn_eachChartData('12H', 'now', currentSensorCode);	//지점별 차트
	}
}

function setPolygon() {	//기본 레이어
	$.getJSON("/resources/json/samho.json", function(geo) {
		var data = geo.features;
		$.each(data, function(idx, val) {
			var coordinates = val.geometry.coordinates;

			var path=[];
			var points =[];
			$.each(coordinates[0], function(idx, coords) {
				var point = new Object();
				point.x = coords[1];
				point.y = coords[0];
				points.push(point);
				path.push(new kakao.maps.LatLng(coords[1], coords[0]));
			})
			var polygon = new kakao.maps.Polygon({
				map : map,
				path : path,
				strokeWeight: 3,
				strokeColor: '#0b85ff',
				strokeOpacity: 1,
				fillColor: '#0b85ff',
				fillOpacity: 0.1
			});

		})
	})
}

function createMap(){
	map =null;
	mapContainer = document.getElementById('map'), // 지도를 표시할 div

    mapOption = {
        center: new kakao.maps.LatLng(35.549527, 129.279091), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };

	map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성

	var cont = '<div class="balloon test_1"></div>';

	// 커스텀 오버레이가 표시될 위치입니다
	var pos = new kakao.maps.LatLng(35.549942, 129.278211);

	// 커스텀 오버레이를 생성합니다
	var customO = new kakao.maps.CustomOverlay({
	    position: pos,
	    content: cont
	});

	customO.setMap(map);
	setPolygon();
};


function createPosition(){
	console.log("start")
	console.time("createPosition");
	positions = [];
	positionObjects= [];
	overlays =[], normalImages =[], overImages =[], clickImages =[], markers =[];
	selectedMarker=null, marker=null;

	console.time("getSitesLastInfo");
	getSitesLastInfo().done(function(data) {
		console.log(data)
		console.timeEnd("getSitesLastInfo");
		$.each(data, function(index, list){

			var contentInfo = new Object();

			contentInfo.name = list.sensor_nm;
			contentInfo.addr = list.sensor_addr;
			contentInfo.flow = list.calc_flow; //list.flow;
			contentInfo.level = list.level;
			contentInfo.velocity = list.calc_velocity2;
			contentInfo.insert_dt = list.insert_dt;


			if(list.insert_dt == null){
				contentInfo.insert_dt="-";
			}

		    positions.push(new kakao.maps.LatLng(list.lat, list.lon));
		    positionObjects.push(contentInfo);

		});
		createMImg(positions, positionObjects);
	})

    console.timeEnd("createPosition");

}
// last 값 수식 변경


// 지도 위에 마커를 표시합니다
function createMImg(positions, positionObjects){
	for (var i = 0, len = positions.length; i < len; i++) {

	    var gapX = (MARKER_WIDTH), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
	        originY = (MARKER_HEIGHT) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
	        overOriginY = (OVER_MARKER_HEIGHT) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
	        normalOrigin = new kakao.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
	        clickOrigin = new kakao.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
	        overOrigin = new kakao.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
	   // alert(gapX+", "+originY+", "+overOriginY);
	    // 마커를 생성하고 지도위에 표시합니다
	    addMarker(positions[i], normalOrigin, overOrigin, clickOrigin, site_codes[i], (i+1), positionObjects[i], bgColors[i], fontColors[i], colors[i]);
	}
}

// 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
function addMarker(position, normalOrigin, overOrigin, clickOrigin, sensor_cd, num, positionObject, bgColor, fontColor, color) {

    // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
    var normalImage = createMarkerImage(markerSize, markerOffset, normalOrigin),
        overImage = createMarkerImage(overMarkerSize, overMarkerOffset, overOrigin),
        clickImage = createMarkerImage(markerSize, markerOffset, clickOrigin);
    	normalImages.push(normalImage);
    	overImages.push(overImage);
    	clickImages.push(clickImage);

    // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: position,
        image: normalImage,
        clickable: true
    });
    markers.push(marker);

    // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
    //marker.normalImage = normalImage;

    createOverlays(position, marker,  positionObject, bgColor, fontColor, color, num-1);

    if(num == 7){
    	markers[6].setImage(clickImage);
    	overlays[6].setMap(map); //오버레이 초기화
    	currentOverlay = overlays[6];
    }else if(num == 8){
    	overlays[6].setMap(map); //오버레이 초기화
    	currentOverlay = overlays[6];
    }else{
    	markers[0].setImage(clickImage);
    	overlays[0].setMap(map); //오버레이 초기화
    	currentOverlay = overlays[0];
    }




    // 마커에 mouseover 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function() {

        // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 오버 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(overImage);
        }
    });

    // 마커에 mouseout 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseout', function() {

        // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 기본 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
        }
    });

    // 마커에 click 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {

    	currentOverlay.setMap(null);

    	createPolygon(num);//마커 클릭시 각 지점 유역 폴리곤 레이어 생성

        // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면 마커의 이미지를 클릭 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {

            // 클릭된 마커 객체가 null이 아니면  클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(clickImage);

        }
        fn_radioBtn(sensor_cd);

        for(var i =0; i<site_codes.length; i++){

    			if(site_codes[i] == sensor_cd ){
    				overlays[i].setMap(map);
    				currentOverlay = overlays[i];
    			}
    	}



        currentPosition = position;
        // 지도 중심을 이동 시킵니다
        map.setCenter(currentPosition);


        $("input:radio[name='radio-group']").prop('checked', false); // 해제하기

        $(".radio-btn-wrap > span:NTH-OF-TYPE("+num+") > [type='radio']").prop('checked', true); // 선택하기
        // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
        selectedMarker = marker;
    });
}

// MakrerImage 객체를 생성하여 반환하는 함수입니다
function createMarkerImage(markerSize, offset, spriteOrigin) {
    var markerImage = new kakao.maps.MarkerImage(
        SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
        markerSize, // 마커의 크기
        {
            offset: offset, // 마커 이미지에서의 기준 좌표
            spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
            spriteSize: spriteImageSize // 스프라이트 이미지의 크기
        }
    );

    return markerImage;
}





function createContent(position, marker, positionObject, bgColor, fontColor, color){


 var content = '<div class="overlay '+fontColor+'">'
		+'	<div class="overlay-content-wrap back-c-black">'
		+'		<span class="font-s14 font-c-white">'+positionObject.name+'&nbsp;'+positionObject.addr+'</span><span class="close-btn" onclick="closeOverlay()" title="닫기">x</span>'
		+'	</div>'
		+'	<div class="overlay-content-wrap">'
		+'		<div class="overlay-content" style="border-bottom: 1px solid '+color+';">'
		+'			<div class="bar '+bgColor+'"></div>'
		+'			<span class="con-val-type">유량</span>'
		+'			<span class="con-value font-c-white">'+positionObject.flow.toFixed(2)+'&nbsp;㎥/s</span>'
		+'		</div>'
		+'	</div>'
		+'	<div class="overlay-content-wrap">'
		+'		<div class="overlay-content" style="border-bottom: 1px solid '+color+';">'
		+'			<div class="bar '+bgColor+'"></div>'
		+'			<span class="con-val-type">수심</span>'
		+'			<span class="con-value font-c-white">'+positionObject.level.toFixed(2)+'&nbsp;mm</span>'
		+'		</div>'
		+'	</div>'
		+'	<div class="overlay-content-wrap">'
		+'		<div class="overlay-content" style="border-bottom: 1px solid '+color+';">'
		+'			<div class="bar '+bgColor+'"></div>'
		+'			<span class="con-val-type">유속</span>'
		+'			<span class="con-value font-c-white">'+positionObject.velocity.toFixed(2)+'&nbsp;m/s</span>'
		+'		</div>'
		+'	</div>'
		+'	<span class="last-time font-c-white font-s11">현재관측시각 : '+fn_observetime(positionObject.insert_dt)+'</span>'
		+'</div>';

return content;

}

//관측시각 형태 변경
function fn_observetime(t) {
	if(t=="-"){
		return "관측불가";
	}else{
	var tArr = t.split(' ');
	var day = tArr[0].substr(2,8);
	dayArr = day.split('-');

	var time = tArr[1].substr(0,8);
	return dayArr[0]+'/'+dayArr[1]+'/'+dayArr[2]+' '+time;
	}

}

function createPolygon(i) {
	if(polygons.length > 0) {
    	for (var j = 0; j < polygons.length; j++) {
    			polygons[j].setMap(null);
		}
    }
	$.getJSON("/resources/json/site"+i+".json", function(geo) {
		var data = geo.features;
		$.each(data, function(idx, val) {
			var coordinates = val.geometry.coordinates;

			var path=[];
			var points =[];
			$.each(coordinates[0], function(idx, coords) {
				var point = new Object();
				point.x = coords[1];
				point.y = coords[0];
				points.push(point);
				path.push(new kakao.maps.LatLng(coords[1], coords[0]));
			})
			var polygon = new kakao.maps.Polygon({
				map : map,
				path : path,
				strokeWeight: 2,
				strokeColor: polygonColors[i-1],
				strokeOpacity: 1,
				fillColor: polygonColors[i-1],
				fillOpacity: 0.1,
			});

			polygons.push(polygon);


		})
	})
}

function createOverlays(position, marker, positionObject, bgColor, fontColor, color, i){

	var overlay = new kakao.maps.CustomOverlay({
	    map: map,
	    position: position,
	    content: createContent(position, marker, positionObject, bgColor, fontColor, color),
	    xAnchor: -0.2,
	    yAnchor: 0.8
	});

	overlays[i] = overlay;

    for(var i =0; i<overlays.length; i++){
		overlays[i].setMap(null);
    }

}



// 오버레이 재갱신
function updateOverlay(curSensorCode){

	getSitesLastInfo().done(function(data) {
		$.each(data, function(index, list){


			var contentInfo = new Object();

			contentInfo.name = list.sensor_nm;
			contentInfo.addr = list.sensor_addr;
			contentInfo.flow = list.flow;

			contentInfo.level = list.level;
			contentInfo.velocity = list.velocity;
			contentInfo.insert_dt = list.insert_dt;

			createOverlays(positions[index], markers[index], contentInfo, bgColors[index], fontColors[index], colors[index], index);

		});

	    for(var i =0; i<site_codes.length; i++){

			if(site_codes[i] == curSensorCode ){
				overlays[i].setMap(map);
				currentOverlay = overlays[i];

			}
		}

	})

}



//커스텀 오버레이를 닫기 위해 호출되는 함수입니다
function closeOverlay() {

    for(var i=0; i < overlays.length; i++){
    	overlays[i].setMap(null);
    }
    var moveLatLon = new kakao.maps.LatLng(35.549380, 129.279463);

    map.setCenter(moveLatLon);

}



/*function fn_eachPopupData(startTime, endTime, sensorCode){

	getEachChartData(startTime, endTime, sensorCode).done(function(data) {
		 var tr = "";
		$.each(data, function(index, list){
		    tr +=	      "<tr>";
		    tr +=	        "<td>"+list.insert_dt+"</td><td>"+list.level+"</td><td>"+list.calc_velocity2+"</td><td>"+list.calc_flow+"</td><td>"+list.calc_flow+"</td>";
		    tr +=			"<td>"+0+"</td>";
		    tr +=	      "</tr>";
		    $('#tbl-clib-data').append(tr);

		});
	})

}
*/
