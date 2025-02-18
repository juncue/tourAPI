const AREA_CODE_URL = `http://apis.data.go.kr/B551011/KorService1/areaCode1`; // 3번 지역코드 조회
const SERVICE_CATEGORY_URL = `http://apis.data.go.kr/B551011/KorService1/categoryCode1`; // 4번 서비스분류코드 조회
const AREA_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/areaBasedList1`; // 5번 지역기반 관광정보 조회
const KEYWORD_BASE_SEARCH_URL = `http://apis.data.go.kr/B551011/KorService1/searchKeyword1`; // 7번 키워드 검색 조회

const REQUIRED_PARMAS = `?MobileOS=ETC&MobileApp=AppTest&serviceKey=${MY_KEY}&_type=json`;
const FOR_SEARCH_PARAMS = `&contentTypeId=${CONTENT_TYPE_ID}&listYN=Y&arrange=Q`;

const DETAIL_PAGE_URL = `touristAttractionDetail.html`;

let numOfRows = 20;
let PageGroupUnit = 10;

let totalCount = 0;
let totalPages = 0;
let currentPage = 1;

$(function () {
  getCards(currentPage); // 페이지 로딩 시 전체 카드목록 조회
  getServiceCat1Data(); // 서비스 분류 셀렉트 박스 중 대분류 항목 조회
  getAreaCat1Data(); // 지역 셀렉트 박스 중 광역시/도 항목 조회
  $("#searchBtn").click(function () {
    currentPage = 1;
    getCards(currentPage);
    $("html, body").animate({ scrollTop: $("#cardArea").offset().top }, 500);
  }); // 검색 버튼 클릭 이벤트 리스너
  $(".searchCancel-Btn").click(canselSearch); // 검색초기화 버튼 클릭 이벤트 리스너
});

// 카드를 가져오는 함수
function getCards(pageNo) {
  $("#card").empty();
  // 쿼리스트링을 만들기 위해 검색 조건을 확인
  let params = [
    $("#areaCat1").val(),
    $("#areaCat2").val(),
    $("#serviceCat1").val(),
    $("#serviceCat2").val(),
    $("#serviceCat3").val(),
  ];
  let keyword = $("#searchWord").val();
  if (keyword != "") {
    params.push(keyword);
    let url = makeSearchUrl(
      KEYWORD_BASE_SEARCH_URL +
        REQUIRED_PARMAS +
        FOR_SEARCH_PARAMS +
        `&numOfRows=${numOfRows}&pageNo=${pageNo}`,
      params
    );
    requestData(url, printCards);
  } else {
    let url = makeSearchUrl(
      AREA_BASE_SEARCH_URL +
        REQUIRED_PARMAS +
        FOR_SEARCH_PARAMS +
        `&numOfRows=${numOfRows}&pageNo=${pageNo}`,
      params
    );
    requestData(url, printCards);
  }
}

// 쿼리스트링 만들어주는 함수
function makeSearchUrl(url, params) {
  let paramNames = [
    "areaCode",
    "sigunguCode",
    "cat1",
    "cat2",
    "cat3",
    "keyword",
  ];
  $.each(params, function (index, ele) {
    if (ele != "noValue") {
      url += `&${paramNames[index]}=${ele}`;
    }
  });
  return url;
}

// ajax로 받아온 카드데이터를 출력해주는 함수
function printCards(json) {
  console.log(json);
  // $(".loading").hide();
  totalCount = json.response.body.totalCount;
  totalPages = Math.ceil(totalCount / numOfRows);
  $("#totalCount").html(totalCount);
  printPagination(); // 페이지 출력
  let item = json.response.body.items.item;
  let output = "";
  $.each(item, function (index, ele) {
    let img =
      ele.firstimage != ""
        ? ele.firstimage
        : `images/touristAttraction/no-image.jpeg`;
    let title = ele.title;
    let contentid = ele.contentid;
    let area1 = ele.addr1.split(" ")[0];
    let area2 = ele.addr1.split(" ")[1];
    let likeArr = readCookie(); // 좋아요 체크 카드 표시

    output += `
        <div class="col">
          <div class="card h-100">
            <a href="${DETAIL_PAGE_URL}?contentid=${contentid}"><img src="${img}" class="card-img-top" alt="${title}" /></a>
            <div class="card-body">
              <small class="text-muted">${area1} | ${area2}</small>
              <h5 class="card-title"><a href="${DETAIL_PAGE_URL}?contentid=${contentid}">${title}</a></h5>`;

    if (likeArr.indexOf(contentid) != -1) {
      output += `<span id="${contentid}" class="like" onclick="setLike(this);"><i class="fa-solid fa-heart"></i></span>`;
    } else {
      output += `<span id="${contentid}" class="like" onclick="setLike(this);"><i class="fa-regular fa-heart"></i></span>`;
    }
    output += `</div></div></div>`;
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
  let url =
    SERVICE_CATEGORY_URL +
    REQUIRED_PARMAS +
    `&contentTypeId=${CONTENT_TYPE_ID}`;
  requestData(url, function (data) {
    printSelectOptions(data, "#serviceCat1", "serviceCat1");
  });
}
function getServiceCat2Data(code) {
  let url =
    SERVICE_CATEGORY_URL +
    REQUIRED_PARMAS +
    `&contentTypeId=${CONTENT_TYPE_ID}&cat1=${code}`;
  requestData(url, function (data) {
    printSelectOptions(data, "#serviceCat2", "serviceCat2");
  });
}
function getServiceCat3Data(code) {
  let url =
    SERVICE_CATEGORY_URL +
    REQUIRED_PARMAS +
    `&contentTypeId=${CONTENT_TYPE_ID}&cat1=${$(
      "#serviceCat1"
    ).val()}&cat2=${code}`;
  requestData(url, function (data) {
    printSelectOptions(data, "#serviceCat3", "serviceCat3");
  });
}

// 지역 셀렉트박스 데이터 조회
function getAreaCat1Data() {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&numOfRows=50`;
  requestData(url, function (data) {
    printSelectOptions(data, "#areaCat1", "areaCat1");
  });
}
function getAreaCat2Data(code) {
  let url = AREA_CODE_URL + REQUIRED_PARMAS + `&areaCode=${code}&numOfRows=100`;
  requestData(url, function (data) {
    printSelectOptions(data, "#areaCat2", "areaCat2");
  });
}

// 셀렉트 박스 변경에 대한 이벤트리스너
$(document).on("change", "#serviceCat1", function () {
  $(".serviceCat2, .serviceCat3").remove();
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

// 검색 초기화 함수
function canselSearch() {
  $(".serviceCat1, .serviceCat2, .serviceCat3").remove();
  $(".areaCat1, .areaCat2").remove();
  getServiceCat1Data();
  getAreaCat1Data();
  $("#searchWord").val("");
}

// 페이지 출력 함수
function printPagination() {
  $(".pagination").empty();
  console.log(currentPage);
  console.log(totalCount);
  console.log(totalPages);

  let currentPageGroup = Math.ceil(currentPage / PageGroupUnit); // 현재 페이지 그룹
  let startPage = (currentPageGroup - 1) * PageGroupUnit + 1; // 그룹의 첫 페이지
  let endPage = Math.min(startPage + PageGroupUnit - 1, totalPages); // 그룹의 마지막 페이지
  // 이전 버튼 생성
  if (currentPageGroup > 1) {
    $(".pagination").append(`<li class="page-item" onclick="changePage(${
      startPage - 1
    })">
            <a class="page-link" href="javascript:void(0)" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>`);
  }
  // 페이지 번호 버튼 생성
  for (let i = startPage; i <= endPage; i++) {
    let activeClass = i == currentPage ? "active" : "";
    $(".pagination").append(
      `<li class="page-item ${activeClass}" onclick="changePage(${i})"><a class="page-link" href="javascript:void(0)">${i}</a></li>`
    );
  }
  // 다음 버튼 생성
  if (endPage < totalPages) {
    $(".pagination").append(`<li class="page-item" onclick="changePage(${
      endPage + 1
    })">
            <a class="page-link" href="javascript:void(0)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>`);
  }
}

function changePage(page) {
  currentPage = page;
  getCards(currentPage);
  printPagination();
  $("html, body").animate({ scrollTop: $("#cardArea").offset().top }, 500);
}

function setLike(likeIcon) {
  if (likeIcon.children[0].classList.contains("fa-regular")) {
    likeIcon.children[0].classList.remove("fa-regular");
    likeIcon.children[0].classList.add("fa-solid");
    saveCookie(`contentid${likeIcon.id}`, CONTENT_TYPE_ID, 1);
  } else {
    likeIcon.children[0].classList.add("fa-regular");
    likeIcon.children[0].classList.remove("fa-solid");
    saveCookie(`contentid${likeIcon.id}`, "", 0);
  }
}

function saveCookie(cookieName, cookieValue, expYear) {
  // expYear은 연단위
  let now = new Date();
  now.setFullYear(now.getFullYear() + expYear);

  let tmpCookie =
    cookieName + "=" + cookieValue + ";expires=" + now.toUTCString();
  document.cookie = tmpCookie;
}

function readCookie() {
  let cookArr = document.cookie.split("; ");
  let likeArr = new Array();
  $.each(cookArr, function (index, ele) {
    let cookName = ele.split("=")[0];
    if (cookName.indexOf("contentid") != -1) {
      likeArr.push(ele.split("=")[0].substring(9));
    }
  });
  return likeArr;
}
