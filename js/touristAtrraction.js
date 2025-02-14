const MY_KEY = `Mr%2FoLDV0QvesS1eTgQhWGB5QVE8m0cS4exeRvZdGXTV9HktCkhWBrEhPAMt2RYHN%2B2kvhbKkMka%2BK%2BgLlESbsA%3D%3D`;
const AREA_CODE_URL = `http://apis.data.go.kr/B551011/KorService1/areaCode1`; // 3번 지역코드 조회
const SERVICE_CATEGORY_URL = `http://apis.data.go.kr/B551011/KorService1/categoryCode1`; // 4번 서비스분류코드 조회
const AREA_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/areaBasedList1`; // 5번 지역기반 관광정보 조회
const KEYWORD_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/searchKeyword1`; // 7번 키워드 검색 조회
const REQUIRED_PARMAS = `?MobileOS=ETC&MobileApp=AppTest&serviceKey=${MY_KEY}&_type=json`;
const DETAIL_PAGE_URL = `touristAttractionDetail.html`;

// ajax 요청 공통 함수
function getData(url, callback) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (data) {
      callback(data);
    },
    error: function (data) {
      console.log(data.responseText);
    },
    complete: function () {
    },
  });
}

$(function () {
  getInitCards(); // 페이지 로딩 시 전체 카드목록 조회
  getServiceCat1Data(); // 서비스 분류 셀렉트 박스 중 대분류 항목 조회 
  getAreaCat1Data();  // 지역 셀렉트 박스 중 광역시/도 항목 조회
  $("#searchBtn").click(search);  // 검색 버튼 클릭 이벤트 리스너
  $(".searchCancel-Btn").click(canselSearch);  // 검색초기화 버튼 클릭 이벤트 리스너
});

function getInitCards() {
  let url =
    AREA_BASE_SEARCH_URL +
    REQUIRED_PARMAS +
    `&numOfRows=20&pageNo=1&listYN=Y&arrange=Q&contentTypeId=12`;
  //   $(".loading").show();
  getData(url, printCards)
}

// ajax로 받아온 카드데이터를 출력해주는 함수
function printCards(json) {
  // $(".loading").hide();
  let output = "";
  let totalCount = json.response.body.totalCount;
  let item = json.response.body.items.item;

  $("#totalCount").html(totalCount);
  $.each(item, function (index, ele) {
    let img = (ele.firstimage != "")? ele.firstimage : `images/touristAttraction/no-image.jpeg`;
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

// 셀렉트박스 옵션 출력에 대한 공통 함수
function printSelectOptions(json, htmlSelector, className) {
  let output = "";
  let list = json.response.body.items.item;
  $.each(list, function (index, ele) {
    output += `<option class="${className}" value="${ele.code}">${ele.name}</option>`;
  });
  $(htmlSelector).append(output);
}

// 서비스 분류 셀렉트박스 데이터 조회
function getServiceCat1Data() {
  let url = SERVICE_CATEGORY_URL + REQUIRED_PARMAS + `&contentTypeId=12`;
  getData(url, function(data){
    printSelectOptions(data, "#serviceCat1", "serviceCat1")
  })
}
function getServiceCat2Data(code) {
  let url =
    SERVICE_CATEGORY_URL + REQUIRED_PARMAS + `&contentTypeId=12&cat1=${code}`;
  getData(url, function(data){
    printSelectOptions(data, "#serviceCat2", "serviceCat2")
  })
}
function getServiceCat3Data(code) {
  let url =
    SERVICE_CATEGORY_URL +
    REQUIRED_PARMAS +
    `&contentTypeId=12&cat1=${$("#serviceCat1").val()}&cat2=${code}`;
  getData(url, function(data){
    printSelectOptions(data, "#serviceCat3", "serviceCat3")
  })
}

// 지역 셀렉트박스 데이터 조회
function getAreaCat1Data() {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&numOfRows=50`;
  getData(url, function(data){
    printSelectOptions(data, "#areaCat1", "areaCat1");
  })
}
function getAreaCat2Data(code) {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&areaCode=${code}&numOfRows=100`;
  getData(url, function(data){
    printSelectOptions(data, "#areaCat2", "areaCat2");
  })
}

// 셀렉트 박스 변경에 대한 이벤트리스너
$(document).on("change", "#serviceCat1", function () {
  $(".serviceCat2", ".serviceCat3").remove();
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

// 검색 실행
function search() {
  $("#card").empty();
  let params = [
    $("#areaCat1").val(),
    $("#areaCat2").val(),
    $("#serviceCat1").val(),
    $("#serviceCat2").val(),
    $("#serviceCat3").val()
  ]
  let keyword = $("#searchWord").val();
  if (keyword != "") {
    params.push(keyword);
    let url = makeSearchUrl(KEYWORD_BASE_SEARCH_URL + REQUIRED_PARMAS, params);
    getData(url, printCards);
  } else {
    let url = makeSearchUrl(AREA_BASE_SEARCH_URL + REQUIRED_PARMAS, params);
    getData(url, printCards);
  }
}

// 검색 쿼리스트링 만들어주는 함수
function makeSearchUrl(url, params){
  let paramNames = ["areaCode", "sigunguCode", "cat1", "cat2", "cat3", "keyword"]
  $.each(params, function(index, ele){
    if (ele != "noValue"){
      url += `&${paramNames[index]}=${ele}`
    }
  }) 
  return url;
}

// 검색 초기화 함수
function canselSearch() {
  $(".serviceCat1", ".serviceCat2",".serviceCat3").remove();
  $(".areaCat1", "areaCat2").remove();
  getServiceCat1Data();
  getAreaCat1Data();
  $("#searchWord").val("");
}






