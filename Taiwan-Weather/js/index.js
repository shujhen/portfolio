// API 網址
const url =
  'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-5E5AD224-B407-4A22-8ABD-BD9609C07782&format=JSON';

// 二維陣列應用
const cities = [
  '基隆市',
  '新北市',
  '臺北市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '臺中市',
  '南投縣',
  '彰化縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '臺南市',
  '高雄市',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '臺東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
];
let area = [];
area['north'] = [
  '基隆市',
  '新北市',
  '臺北市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
];
area['east'] = ['宜蘭縣', '花蓮縣', '臺東縣'];
area['south'] = ['臺南市', '高雄市', '屏東縣'];
area['middle'] = ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'];
area['island'] = ['澎湖縣', '金門縣', '連江縣'];
// 卡片區
const content = document.querySelector('.content');
// 所有卡片
let cards;
// 選擇的城市
let selectedCity;

// 統整好的城市天氣資料
let citiesData = [];
// 排序後的城市天氣資料
let sortedCities = [];

// call API
fetch_data();

// 取得 API 資料
function fetch_data() {
  // 非同步處理
  fetch(url)
    // response 會是一個 Response資料組
    .then(function (response) {
      // json() 會將資料轉換成可供 javascript 使用的JSON
      return response.json();
    })
    .then(function (data) {
      process(data);
    });
}
// 處理資料
function process(data) {
  let locations = data.records.location;
  console.log(locations);
  // 箭頭函式表示法
  locations.forEach((location) => {
    // 城市名稱
    let locationName = location.locationName;
    // 天氣因子
    let weatherElement = location.weatherElement;

    let weatherRecord = [];
    // 三個時段，應有三筆氣象資料
    for (let i = 0; i < 3; i++) {
      weatherRecord[i] = [];
      weatherElement.forEach((element, index) => {
        weatherRecord[i][element.elementName] =
          element.time[i].parameter.parameterName;
        // 將天氣情況的分類代碼存起來
        if (element.elementName == 'Wx') {
          weatherRecord[i]['WxCode'] = element.time[i].parameter.parameterValue;
        }
      });
      weatherRecord[i]['startTime'] = weatherElement[0].time[i].startTime
        .substr(0, 16)
        .replaceAll('-', '/');
      weatherRecord[i]['endTime'] = weatherElement[0].time[i].endTime
        .substr(0, 16)
        .replaceAll('-', '/');
    }
    citiesData[locationName] = weatherRecord;
  });
  sortCities();
}

// 排序 & 秀出資料
function sortCities() {
  cities.forEach((cityName) => {
    sortedCities[cityName] = citiesData[cityName];
    showCardData(cityName);
  });
  // 取得所有卡片
  cards = document.querySelectorAll('.card');
}

// 印出卡片資料
function showCardData(cityName) {
  // 0: Wx 天氣現象
  // 1: PoP 降雨機率12小時分段
  // 2: MinT 最低溫度
  // 3: CI 舒適度
  // 4: MaxT 最高溫度

  // 預備加入 card 中的 html 字串
  let card = `<div class="card">
            <div class="cityName">${cityName}</div>
            <div class="weather">`;

  // 三個時段，應有三筆氣象資料
  for (let i = 0; i < 3; i++) {
    card += `
            <div class="time time${i}">
              <div class="wx-${sortedCities[cityName][i].WxCode}"></div>
              <p class="wx">${sortedCities[cityName][i].Wx}</p>
              <p class="temperature">${sortedCities[cityName][i].MinT} - ${sortedCities[cityName][i].MaxT} °C</p>
              <p>${sortedCities[cityName][i].startTime}</p>
              <p>${sortedCities[cityName][i].endTime}</p>
            </div>`;
  }
  card += '</div></div>';
  content.innerHTML += card;
}
// 全部地區顯示
const showCardsBtn = document.querySelector('.map .showCardsBtn');
// 預設為focus
showCardsBtn.focus();

showCardsBtn.addEventListener('click', function () {
  cards.forEach((card) => {
    card.classList.remove('none');
  });
});
// 地圖城市 click
const cityMap = document.querySelectorAll('.map svg a');
cityMap.forEach((city) => {
  city.addEventListener('click', function () {
    let clickedCity = city.querySelector('desc').innerHTML;
    cards.forEach((card) => {
      if (card.querySelector('.cityName').innerHTML == clickedCity) {
        card.classList.remove('none');
        return;
      }
      card.classList.add('none');
    });
  });
});
