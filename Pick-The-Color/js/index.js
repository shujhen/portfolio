// body
const body = document.querySelector('body');
// 頁面
const startPage = document.querySelector('.startPage');
const playPage = document.querySelector('.playPage');
const pausePage = document.querySelector('.pausePage');
const endPage = document.querySelector('.endPage');
// 按鈕
const startBtn = document.querySelector('.startBtn');
const pauseBtn = document.querySelector('.pauseBtn');
const restartBtn = document.querySelector('.restartBtn');
const againBtn = document.querySelector('.againBtn');
// 遊戲區
const playground = document.querySelector('.playground');
// 關卡數字顯示
const gateNum = document.querySelector('#gate');
// 秒數倒數
const countdown = document.querySelector('#countdown');
// 暫停頁會顯示剩餘秒數
const pauseCountdown = document.querySelector('#pauseCountdown');
// 遊戲結束結語
const epilogue = document.querySelector('#epilogue');

// 關卡等級
let level = 1;
let timer = null;
let seconds = 0;
let isPaused = false;

startBtn.addEventListener('click', startPlay);
againBtn.addEventListener('click', startPlay);

pauseBtn.addEventListener('click', function () {
  isPaused = true;
  // 顯示剩餘秒數
  pauseCountdown.innerHTML = seconds;
  // 換背景顏色
  body.classList.add('pause');
  // 換頁
  showPages(pausePage);
});
restartBtn.addEventListener('click', function () {
  isPaused = false;
  // 換背景顏色
  body.classList.remove('pause');
  // 換頁
  showPages(playPage);
});

// 顯示指定頁面
function showPages(targetPage) {
  let pages = document.querySelectorAll('.page');

  pages.forEach(function (page, index) {
    page.style.display = 'none';
  });

  targetPage.style.display = 'block';
}

// 重新開始新的遊戲
function startPlay() {
  // 重置關卡 & 難度
  level = 1;
  // 關卡數變更
  gateNum.innerHTML = level;
  // 初始 box 數量為 2 * 2 = 4
  refreshBoxes(2);
  // 換背景顏色
  body.classList.remove('pause');
  // 換頁
  showPages(playPage);
  // 開始倒數
  startCountDown();
}

// 倒數秒數
function startCountDown() {
  // 重置秒數
  clearInterval(timer);
  seconds = 30;
  isPaused = false;
  // 先給畫面初始秒數
  countdown.innerHTML = seconds;
  // 重新倒數
  timer = setInterval(function () {
    if (seconds > 0 && isPaused == false) {
      seconds--;
      countdown.innerHTML = seconds;
    }
    // 結束倒數->跳換到結束頁
    else if (seconds <= 0) {
      clearInterval(timer);
      // 判斷玩家強弱
      let lv = level - 1;
      if (lv < 1) {
        epilogue.innerHTML = `你是<br /><span>LV ${lv} 弱雞</span><br />是不是在發呆呀？<br />再玩一次試試？`;
      } else if (lv < 5) {
        epilogue.innerHTML = `你是<br /><span>LV ${lv} 小嫩雞</span><br />太弱啦～再玩一次試試？`;
      } else if (lv < 10) {
        epilogue.innerHTML = `你是<br /><span>LV ${lv} 小菜雞</span><br />繼續加油！再玩一次試試？`;
      } else if (lv < 20) {
        epilogue.innerHTML = `你是<br /><span>LV ${lv} 正常肉雞</span><br />很不錯唷～再玩一次吧？`;
      } else {
        epilogue.innerHTML = `天啊！強者！<br /><span>LV ${lv} 超級戰鬥雞</span><br />你太厲害啦～再玩一次嗎？`;
      }
      // 換背景顏色
      body.classList.add('pause');
      // 換頁
      showPages(endPage);
    }
  }, 1000);
}

// 刷新 box 數量
function refreshBoxes(degree) {
  // 取得亂數 RGB 0 ~ 255
  // 255 太高了顏色太淺看不出來，改範圍到 0 ~ 200
  let R = Math.floor(Math.random() * 201);
  let G = Math.floor(Math.random() * 201);
  let B = Math.floor(Math.random() * 201);

  // box 的顏色&大小
  let boxBackgroundColor = `rgb(${R},${G},${B})`;
  let boxWidth = `calc(100% / ${degree})`;
  let boxHeight = `calc(100% / ${degree})`;

  let boxStr = '';
  for (let i = 0; i < degree ** 2; i++) {
    boxStr += `<div class="box" style="background-color:${boxBackgroundColor};width:${boxWidth};height:${boxHeight};"></div>`;
  }
  // 將 box 填充到 playground
  playground.innerHTML = boxStr;

  // 取得畫面上所有 box
  const boxList = document.querySelectorAll('.box');
  // 取得一個隨機 box 的 index
  let weakColorBoxIndex = Math.floor(Math.random() * boxList.length);
  // 將隨機 box 套上 weak class
  boxList[weakColorBoxIndex].classList.add('weak');

  // 取得 weak 的 box
  const weakColorBox = document.querySelector('.box.weak');

  // weak 的 box 被點擊時換下一關
  weakColorBox.addEventListener('click', function () {
    level++;
    // 前三關每個關卡都加難度，之後每三關才會加一級難度
    if (level <= 3 || level % 3 == 0) {
      degree++;
    }
    // 關卡數變更
    gateNum.innerHTML = level;
    // 重新生成 box
    refreshBoxes(degree);
  });
}
