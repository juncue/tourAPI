const MY_KEY = `Mr%2FoLDV0QvesS1eTgQhWGB5QVE8m0cS4exeRvZdGXTV9HktCkhWBrEhPAMt2RYHN%2B2kvhbKkMka%2BK%2BgLlESbsA%3D%3D`;
const CONTENT_TYPE_ID = 12;

// ajax 요청 공통 함수
function requestData(url, callback) {
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
    complete: function () {},
  });
}
