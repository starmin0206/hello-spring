/**
 * Project : 도시방재
 * File Name : calib.js
 * 작성 : 정해성
 * 날짜 : 2020.10.27
 */
$(document).ready(function() {
	$(".snsr_cd").change(function() {
		getCalibCondition(this.value).done(function(data) {
			$(".calibCond").empty();
			$.each(data, function(idx, list) {
				var option = '<option value="' + list.condition + '">' + list.condition + '</option>';
				$(".calibCond").append(option);
			})
		})
	})
})

function calibList() {
	getEachCalibData().done(function(data) {
		$.each(data, function(index, list){
			$(".num_"+list.idx).find(".conditionVal").html(list.condition);
			$(".num_"+list.idx).find(".calibVal").html(list.calib_formula);
			$(".num_"+list.idx).find(".correlationVal").html(list.correlation);
			$(".num_"+list.idx).find(".periodVal").html(list.period);
		})
	})
}

function setSiteList() {
	$(".snsr_cd").empty();
	getSitesInfo().done(function(data) {
		console.log(data)
		$.each(data, function(idx, list) {
			var option = '<option value="' + list.sensor_cd + '">' + list.sensor_nm + '</option>';
			$(".snsr_cd").append(option);
		})
	})
}

function formDown(url) {
//	var url = "/resources/template/calib_template.xlsx";
	location.href=url;
}

function submitCalib() {
	var sensor_cd = $(".snsr_cd option:selected").val();
	var condition = $(".calibCond option:selected").val();
	var calib_formula = $(".calibText").val();
	var correlation = $(".rSquareVal").val();
	var period = $(".commitPeriod").val();

	if(calib_formula && correlation && period) {
		$.ajax({
			type : 'POST',
			url : '/insertNewCalib',
			dataType : 'json',
			data : {sensor_cd : sensor_cd,
				condition : condition,
				calib_formula :  calib_formula,
				correlation : correlation,
				period : period
			},
			success : function(data) {
				console.log(data.result);
				if(data.result == "SUCCESS") {
					alert("신규보정식 입력 완료.");
					calibList();
				} else {
					alert("신규보정식 입력에 실패하였습니다.");
				}
			},
			error : function(request, status, error) {
				alert("신규보정식 입력에 실패하였습니다.</br>Error Code : " + error );
				console.log(error)
			}
		});
		//insertNewCalib(snsr_cd, cond, calib_formula, correlation, period);
	} else {
		alert("필수 입력값을 작성해 주세요.");
	}
}

/****** excel upload ********/
function checkFileType(filePath) {
	var fileFormat = filePath.split(".");
	if (fileFormat.indexOf("xls")>-1 || fileFormat.indexOf("xlsx")>-1) {
		return true;
	} else {
		return false;
	}
}

function calibUpload(obj, sensorNm) {
	var file = $(obj).prev().val();
	if(file == "" || file == null) {
		alert ("파일을 선택해주세요.");
		return false;
	} else if (!checkFileType(file)) {
		alert ("엑셀 파일만 업로드 가능합니다.");
		return false;
	}
	if (confirm(sensorNm+" 업데이트 하시겠습니까?")) {
        // Get form
//        var form = $("#excelUploadForm5")[0];
        var form = $(obj).parent("form")[0];

        var data = new FormData(form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/excelUploadAjax.do",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
            	alert(sensorNm + " 데이터가 업데이트 되었습니다.");
            },
            error: function (e) {
                console.log("ERROR : ", e.message);
                alert("fail");
            }
        });


		/*var options = {
		success : function() {
			alert(sensorNm + " 데이터가 업데이트 되었습니다.");
			},
			type : "POST"
		};
		console.log($(obj).parent("form")[0])
		var form = $(obj).parent("form")[0]
		form.ajaxSubmit(options);*/
	}
}