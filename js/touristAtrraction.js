const MY_KEY = `Mr%2FoLDV0QvesS1eTgQhWGB5QVE8m0cS4exeRvZdGXTV9HktCkhWBrEhPAMt2RYHN%2B2kvhbKkMka%2BK%2BgLlESbsA%3D%3D`;
const AREA_CODE_URL = `http://apis.data.go.kr/B551011/KorService1/areaCode1`; // 3번 지역코드 조회
const SERVICE_CATEGORY_URL = `http://apis.data.go.kr/B551011/KorService1/categoryCode1`; // 4번 서비스분류코드 조회
const AREA_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/areaBasedList1`; // 5번 지역기반 관광정보 조회
const KEYWORD_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/searchKeyword1`; // 7번 키워드 검색 조회
const REQUIRED_PARMAS = `?MobileOS=ETC&MobileApp=AppTest&serviceKey=${MY_KEY}&_type=json`;
const DETAIL_PAGE_URL = `touristAttractionDetail.html`;

$(function () {
  getInitData();
  getServiceCat1Data();
  getAreaCat1Data();
  $("#searchBtn").click(search);
  $(".searchCancel-Btn").click(canselSearch);
});

$(document).on("change", "#serviceCat1", function () {
  $(".serviceCat2").remove();
  $(".serviceCat3").remove();
  if ($(this).selectedIndex != 0) {
    getServiceCat2Data($(this).val());
  }
});
$(document).on("change", "#serviceCat2", function () {
  $(".serviceCat3").remove();
  if ($(this).selectedIndex != 0) {
    getServiceCat3Data($(this).val());
  }
});
$(document).on("change", "#areaCat1", function () {
  $(".areaCat2").remove();
  if ($(this).selectedIndex != 0) {
    getAreaCat2Data($(this).val());
  }
});

function search() {
  $("#card").children().remove();
  let serviceCat1 = $("#serviceCat1").val();
  let serviceCat2 = $("#serviceCat2").val();
  let serviceCat3 = $("#serviceCat3").val();
  let areaCat1 = $("#areaCat1").val();
  let areaCat2 = $("#areaCat2").val();
  let searchWord = $("#searchWord").val();
  if (searchWord == "") {
    getSearchData(serviceCat1, serviceCat2, serviceCat3, areaCat1, areaCat2);
  } else {
    console.log(searchWord);
    getKeywordData(
      serviceCat1,
      serviceCat2,
      serviceCat3,
      areaCat1,
      areaCat2,
      searchWord
    );
  }
}

function canselSearch() {
  $(".serviceCat1").remove();
  $(".serviceCat2").remove();
  $(".serviceCat3").remove();
  $(".areaCat1").remove();
  $(".areaCat2").remove();
  getServiceCat1Data();
  getAreaCat1Data();
  $("#searchWord").val("");
}

function getInitData() {
  let url =
    AREA_BASE_SEARCH_URL +
    REQUIRED_PARMAS +
    `&numOfRows=20&pageNo=1&listYN=Y&arrange=Q&contentTypeId=12`;
  //   $(".loading").show();
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printTourist(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {
      //   $(".loading").hide();
    },
  });
}

function printTourist(json) {
  let output = "";
  let totalCount = json.response.body.totalCount;
  let item = json.response.body.items.item;

  $("#totalCount").html(totalCount);
  $.each(item, function (index, ele) {
    console.log(ele);
    let img = ele.firstimage;
    if (img == "") {
      img = `images/touristAttraction/no-image.jpeg`;
    }
    let title = ele.title;
    let contentid = ele.contentid;
    let area1 = ele.addr1.split(" ")[0];
    let area2 = ele.addr1.split(" ")[1];

    output += `
        <div class="col">
          <div class="card h-100">
            <a href="${DETAIL_PAGE_URL}?contentid=${contentid}"><img src="${img}" class="card-img-top" alt="${title}" /></a>
            <div class="card-body">
              <small class="text-muted">${area1} | ${area2}</small>
              <h5 class="card-title"><a href="${DETAIL_PAGE_URL}?contentid=${contentid}">${title}</a></h5>
              <span class="like"><i class="fa-regular fa-heart"></i></span>
            </div>
          </div>
        </div>`;
  });
  $("#card").append(output);
}

function getAreaName(areacode, sigungucode, callback) {
  let url =
    AREA_CODE_URL + REQUIRED_PARMAS + `&areaCode=${areacode}&numOfRows=100`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      let addrList = data.response.body.items.item;
      let area = "";
      $.each(addrList, function (index, ele) {
        if (ele.code == sigungucode) {
          area = ele.name;
        }
      });
      callback(area);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function getServiceCat1Data() {
  let url = SERVICE_CATEGORY_URL + REQUIRED_PARMAS + `&contentTypeId=12`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printServiceCat1(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function getServiceCat2Data(code) {
  let url =
    SERVICE_CATEGORY_URL + REQUIRED_PARMAS + `&contentTypeId=12&cat1=${code}`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printServiceCat2(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function getServiceCat3Data(code) {
  let url =
    SERVICE_CATEGORY_URL +
    REQUIRED_PARMAS +
    `&contentTypeId=12&cat1=${$("#serviceCat1").val()}&cat2=${code}`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printServiceCat3(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function printServiceCat1(json) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    let name = ele.name;
    let code = ele.code;
    output += `<option class="serviceCat1" value="${code}">${name}</option>`;
  });
  $("#serviceCat1").append(output);
}

function printServiceCat2(json) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    let name = ele.name;
    let code = ele.code;
    output += `<option class="serviceCat2" value="${code}">${name}</option>`;
  });
  $("#serviceCat2").append(output);
}

function printServiceCat3(json) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    let name = ele.name;
    let code = ele.code;
    output += `<option class="serviceCat3" value="${code}">${name}</option>`;
  });
  $("#serviceCat3").append(output);
}

function getAreaCat1Data() {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&numOfRows=50`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printAreaCat1(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function getAreaCat2Data(code) {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&areaCode=${code}&numOfRows=100`;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printAreaCat2(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {},
  });
}

function printAreaCat1(json) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    let name = ele.name;
    let code = ele.code;
    output += `<option class="areaCat1" value="${code}">${name}</option>`;
  });
  $("#areaCat1").append(output);
}

function printAreaCat2(json) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    let name = ele.name;
    let code = ele.code;
    output += `<option class="areaCat2" value="${code}">${name}</option>`;
  });
  $("#areaCat2").append(output);
}

function getKeywordData(
  serviceCat1,
  serviceCat2,
  serviceCat3,
  areaCat1,
  areaCat2,
  searchWord
) {
  let url =
    KEYWORD_BASE_SEARCH_URL +
    REQUIRED_PARMAS +
    `&numOfRows=20&pageNo=1&listYN=Y&arrange=Q&contentTypeId=12&`;
  if (areaCat1 != "noValue") url += `&areaCode=${areaCat1}`;
  if (areaCat2 != "noValue") url += `&sigunguCode=${areaCat2}`;
  if (serviceCat1 != "noValue") url += `&cat1=${serviceCat1}`;
  if (serviceCat2 != "noValue") url += `&cat2=${serviceCat2}`;
  if (serviceCat3 != "noValue") url += `&cat3=${serviceCat3}`;
  url += `&keyword=${searchWord}`;
  if (searchWord != "") {
    url += `&keyword=${encodeURIComponent(searchWord)}`;
  }
  //   $(".loading").show();
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      printTourist(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {
      //   $(".loading").hide();
    },
  });
}

function getSearchData(
  serviceCat1,
  serviceCat2,
  serviceCat3,
  areaCat1,
  areaCat2
) {
  let url =
    AREA_BASE_SEARCH_URL +
    REQUIRED_PARMAS +
    `&numOfRows=20&pageNo=1&listYN=Y&arrange=Q&contentTypeId=12`;
  if (areaCat1 != "noValue") url += `&areaCode=${areaCat1}`;
  if (areaCat2 != "noValue") url += `&sigunguCode=${areaCat2}`;
  if (serviceCat1 != "noValue") url += `&cat1=${serviceCat1}`;
  if (serviceCat2 != "noValue") url += `&cat2=${serviceCat2}`;
  if (serviceCat3 != "noValue") url += `&cat3=${serviceCat3}`;
  //   $(".loading").show();
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      printTourist(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {
      //   $(".loading").hide();
    },
  });
}
