/**
 * Project : 도시방재
 * File Name : createChart.js
 * 작성 : 손화영
 * 날짜 : 2019.08.02
 */


function createRainChart(insert_dt, rain_val, cumul_rainfall){

	fn_switch(insert_dt.length);

	Highcharts.chart('rain-chart', {
	    chart: {

	    },
	    title: {
	        text: ''
	    },
	    xAxis: [{
	        //categories:insert_dt,
	        tickInterval: tickInterval*60*1000,
	        opposite: true,
			type: 'datetime',
	        dateTimeLabelFormats: {
	            second: '%Y-%m-%d<br/>%H:%M:%S',
	            minute: '%Y-%m-%d<br/>%H:%M:%S',
	            hour: '%Y-%m-%d<br/>%H:%M:%S',
	            day: '%Y-%m-%d<br/>%H:%M:%S',

	        }
	    }],
	    yAxis: [
	    	{ // Secondary yAxis
	        title: {

		            text: '누적 강우량(mm)',
		            style: {
		                color: '#00468b'
		            },
		            align: 'middle',
		            offset:25,
		            x: -10,
		            rotation: 270,
		            y: 0
	        },
	        labels: {
	            style: {
	                color: '#00468b'
	            }
	        },
	    },{
	        title: {
	            text: '강우량(mm/min)',
	            style: {
	                color: '#00aeef'
	            },
	            align: 'middle',
	            offset: 25,
	            x:15,
	            rotation: 270,
	            y: 0
        },
        labels: {
            style: {
                color: '#00aeef'
            }
        },
        opposite: true,
        reversed: true
    }],
	    tooltip: {
	        shared: true,
	        pointFormat: '{series.name}: <b>{point.y:.2f}</b><br/>'
	    },
	    legend: {
	    	  align: 'center',
	          verticalAlign: 'top',
	          layout: 'horizontal',
	          x: 0,
	          y: 0
	    },
	    credits: {
            enabled: false
        },
	    exporting: { enabled: false },
	    series: [{
	        name: '강우량(mm)',
	        type: 'column',
	        opposite: true,
	        data: rain_val,
	        yAxis:1,
	        tooltip: {
	            valueSuffix: ' mm'
	        },
	        color: '#00aeef'

	    }, {
	        name: '누적강우량(mm)',
	        type: 'spline',
	        yAxis:0,
	        data: cumul_rainfall,
	        color: '#00468b',
	        tooltip: {
	            valueSuffix: ' mm'
	        }
	    }]
	});

}

function createFlowChart(dataSeries, len){

	//var mindt = fn_formatDateTime(minDate);

    (function (H) {  // 체크 박스의 위치를 잡기 위함
        H.wrap(H.Legend.prototype, 'positionCheckboxes', function (p, scrollOffset) {
            var alignAttr = this.group.alignAttr,
                translateY,
                clipHeight = this.clipHeight || this.legendHeight;

            if (alignAttr) {
                translateY = alignAttr.translateY;
                H.each(this.allItems, function (item) {
                    var checkbox = item.checkbox,
                       // bBox = item.legendItem.getBBox(true),
                        top;

                    if (checkbox) {
                        top = (translateY + checkbox.y + (scrollOffset || 0) + 3);
                        H.css(checkbox, {
                            left: (alignAttr.translateX + item.checkboxOffset + checkbox.x -200 ) + 'px',
                            top: top + 'px',
                            display: top > translateY - 6 && top < translateY + clipHeight - 6 ? '' : 'none'
                        });
                    }
                });
            }
        });
    })(Highcharts);


	Highcharts.chart('flow-chart', {
	    chart: {
	        type: 'spline',
	        zoomType: "x"
	    },
	    title: {
	        text: ''
	    },
	    legend: {
	    	  align: 'right',
	          verticalAlign: 'top',
	          layout: 'horizontal',
	          x: 0,
	          y: -10,
	          width :360,
	          itemStyle: {'fontWeight': 'normal'},
	          itemWidth:180
	    },
		xAxis: {
			tickInterval: len * 60 * 1000,
//			min: Date.parse('2020-08-06 14:23:00'),
			startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            align: "left",
			type: 'datetime',
	        dateTimeLabelFormats: {
	            second: '%Y-%m-%d<br/>%H:%M:%S',
	            minute: '%Y-%m-%d<br/>%H:%M:%S',
	            hour: '%Y-%m-%d<br/>%H:%M:%S',
	            day: '%Y-%m-%d<br/>%H:%M:%S',

	        },
			labels: {
				style: {
					fontSize: '9px'
				},
			}
		},
	    yAxis: {
	        lineWidth: 1,
	        tickWidth: 1,
	        title: {
	            align: 'high',
	            offset: 0,
	            text: '유출량<br>(㎥)',
	            rotation: 0,
	            y: -30,
	        },
	        max:3
	    },
	    tooltip: {  // 툴팁 name을  사용자 정의로 변경한 함수 -> legend 'name'과  tooltip 'name'을 분리해서 사용하기 위함.
	    	formatter:function(){
	    		var str = '';
	    		var dt = '';

	    		$.each(this.points, function(i, point) {

	    		var tooltip = point.series.userOptions.tooltip;
	    		dt ='<b>'+(fn_formatDateTime(point.x))+'</b><br/>';
	    		str += '<span style="color:'+point.series.color+'><b>' +(tooltip)+'</b></span>: '+(point.y).toFixed(3)+' ㎥<br/>';

	    		});

	    		return dt+str;
	    		},
	        shared: true,
	    },
	    credits: {
	        enabled: false
	    },
	    plotOptions: {
	        areaspline: {
	            fillOpacity: 0.5
	        },
	        series: {
	            showCheckbox: true,
	            events: {
	                legendItemClick: function(e) {
	                    e.preventDefault();
	                }
	            }
	        }
	    },

	    exporting: { enabled: false },
	    series: dataSeries,

	}, function (chart) {
	    Highcharts.each(chart.legend.allItems, function (p, i) { //체크 박스에 따라 지점 별 다중 선택되어 데이터 표출되는 함수

	        $(p.checkbox).change(
	          function () {
	            if (this.checked) {
	              chart.legend.allItems[i].show();
	            } else {
	              chart.legend.allItems[i].hide();
	            }
	          });



	      });



	    });
}
function createEachChart(seriesArr, insert_dt, lMax, vMax){

	fn_switch(insert_dt.length);

	Highcharts.chart('each-chart', {
		chart: {
	         type: 'spline',
	         zoomType: "x"
	     },
	    title: {
	        text: ''
	    },
	    xAxis: {
//	        categories: insert_dt,

			type: 'datetime',
	        dateTimeLabelFormats: {
	            second: '%Y-%m-%d<br/>%H:%M:%S',
	            minute: '%Y-%m-%d<br/>%H:%M:%S',
	            hour: '%Y-%m-%d<br/>%H:%M:%S',
	            day: '%Y-%m-%d<br/>%H:%M:%S',
	        },
	        tickInterval: tickInterval * 60 * 1000
	    },
	    tooltip: {
	        shared: true,
	        pointFormat: '{series.name}: <b>{point.y:.3f}</b><br/>'
	    },
	    yAxis: [{
	        labels: {
	            format: '{value}',
	            style: {
	            	color: '#00468b'
	            }
	        },
	        title: {
	            text: '유출량<br>(㎥/s)',
	            style: {
	                color: '#00468b'
	            },
	            align: 'high',
	            offset: 0,
	            x: -8,
	            rotation: 0,
	            y: -30
	        },
	        max:3
	    },
	    {
	        labels: {
	            format: '{value}',
	            style: {
	                color: '#00a79b'
	            }
	        },
	        title: {
	            text: '수심<br>(mm)',
	            style: {
	            	color: '#00a79b'
	            },
	            align: 'high',
	            offset: 0,
	            rotation: 0,
	            x: 3,
	            y: -30,
	            margin:5
	        },
	        max:lMax,
	        opposite: true
	    },
	    {
	        labels: {
	            format: '{value}',
	            style: {
	                color: '#f47920'
	            }
	        },
	        title: {
	            text: '유속<br>(m/s)',
	            style: {
	            	color: '#f47920'
	            },
	            align: 'high',
	            offset: 0,
	            rotation: 0,
	            x: 6,
	            y: -30,
	            margin:5
	        },
	        max:vMax,
	        opposite: true

	    }
	    ],
	    legend: {
	    	  align: 'center',
	          verticalAlign: 'top',
	          layout: 'horizontal',
	          x: 0,
	          y: -10
	    },

	    series: seriesArr,
	    credits: {
            enabled: false
        },
	    exporting: { enabled: false }

	});
}



function fn_formatDateTime(dt) {
    var currentDate = new Date(dt - (9*3600*1000) );     // 날짜 포맷시 9시간 차이남
    var yyyy = currentDate.getFullYear();
    var mmdd = fn_addZeros((currentDate.getMonth()+1), 2) + "-" + fn_addZeros(currentDate.getDate(), 2);
    var currentHours = fn_addZeros(currentDate.getHours(),2);
    var currentMinute = fn_addZeros(currentDate.getMinutes() ,2);
    var currentSeconds =  fn_addZeros(currentDate.getSeconds(),2);

    return yyyy+"-"+mmdd+" "+ currentHours+ ":"+ currentMinute+ ":"+ currentSeconds;
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


