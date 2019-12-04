const URL = 'https://cors-anywhere.herokuapp.com/https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json';
const areaList = document.querySelector('.areaList');
const pageID = document.getElementById("pageid");
const aside = document.querySelector('.aside');
const selectorCity = document.querySelector('.selectorCity');
const selectorArea = document.querySelector('.selectorArea');
var loader = document.querySelector(".loader");
let jsonData = {};

fetch(URL,{method:'GET'})
.then(response => {
  return response.json();
}).then(data  => {
    jsonData = data.XML_Head.Infos.Info;
    paginationArrayDefault(jsonData);
}).then(() => {
  loader.style.display = "none";
});

/* Pagination 分頁 */

var SelectorList= [];

function paginationArrayDefault(jsonData) {
  const jsonDataLen = jsonData.length;
  SelectorList.length = 0;
  for(let i = 0;i < jsonDataLen; i++){
      SelectorList.push(jsonData[i]);
  }
  pagination(SelectorList, 1)
};

function paginationArrayCity(e) {
  const jsonDataLen = jsonData.length;
  SelectorList.length = 0;
  for(let i = 0;i < jsonDataLen; i++){
    if(selectorCity.value == jsonData[i].Region){
      SelectorList.push(jsonData[i]);
    }
  }
  pagination(SelectorList, 1)
};

function paginationArrayArea(e) {
  const jsonDataLen = jsonData.length;
  SelectorList.length = 0;
  for(let i = 0;i < jsonDataLen; i++){
    if(selectorCity.value == jsonData[i].Region && selectorArea.value == jsonData[i].Town){
      SelectorList.push(jsonData[i]);
    }
  }
  pagination(SelectorList, 1)
};

function pagination(SelectorList,nowPage) {
  loader.style.display = "none";
  const perPage = 12;
  let currentPage = nowPage;
  const minData = currentPage * perPage - perPage + 1;
  const maxData = currentPage * perPage;
  const data = [];
  SelectorList.forEach((item, index) => {
    const num = index + 1;
    if (num >= minData && num <= maxData) {
      data.push(item);
    }
  });
  const totalPage = Math.ceil(SelectorList.length / perPage);
  if (currentPage > totalPage) {
    currentPage = totalPage;
  }
  const page = {
    totalPage,
    currentPage,
  };
  pageBtn(page);
  updateList(data);
}

/* Pagination 分頁按鈕 */

function pageBtn(page) {
  const total = page.totalPage;
  var firstStr = `<li class="page-item page-first" data-page="1">
                  <i class="fas fa-angle-double-left" data-page="1"></i></li>`;
  var preStr = `<li class="page-item page-pre" data-page="${parseInt(page.currentPage) -1}">
                <i class="fas fa-angle-left" data-page="${parseInt(page.currentPage) -1}"></i></li>`;
  var strr='';
  var str = `<li class="page-item page-active" data-page="${parseInt(page.currentPage)}">${parseInt(page.currentPage)}</li>`;
  var strrr='';
  var nextStr= `<li class="page-item" data-page="${parseInt(page.currentPage)}">
                <i class="fas fa-angle-right" data-page="${parseInt(page.currentPage)}"></i></li>`;
  var lastStr = `<li class="page-item page-last" data-page="${total}">
                 <i class="fas fa-angle-double-right" data-page="${total}"></i></li>`;
  if (parseInt(page.currentPage) < 1) {
    parseInt(page.currentPage) = 1;
  };
  if (parseInt(page.currentPage) <= total - 1) {
    nextStr = `<li class="page-item" data-page="${parseInt(page.currentPage) +1}">
               <i class="fas fa-angle-right" data-page="${parseInt(page.currentPage) +1}"></i></li>`;
  };
  for(var i=2; i>=1; i--) {
    if(parseInt(page.currentPage) - i > 1) {
        strr += `<li class="page-item" data-page="${parseInt(page.currentPage) -i}">${parseInt(page.currentPage) -i}</li>`;
    }
  }
  for(var i=1; i<=2; i++) {
    if(parseInt(page.currentPage) + i <= total) {
        strrr += `<li class="page-item" data-page="${parseInt(page.currentPage) +i}">${parseInt(page.currentPage) +i}</li>`
    }
  }
  pageID.innerHTML = firstStr+preStr+strr+str+strrr+nextStr+lastStr;
}

/* Pagination 偵測有無換頁 */

function switchPage(e) {
  e.preventDefault();
  const page = e.target.dataset.page;
  pagination(SelectorList, page);
}

pageID.addEventListener("click", switchPage);

/* 區域選單更新 */

function updateSelectorArea(e) {
  var selector = e.target.value;
  let titleStr = `<option selected="selected" disabled="disabled">- - 請選擇區域- -</option>`;
  let selectorAreaStr = '';
  const set = new Set();
  const selectorAreaArray = jsonData.filter(item => !set.has(item.Town) ? set.add(item.Town): false);
  for(let i = 0;i < selectorAreaArray.length; i++){
    if(selector == selectorAreaArray[i].Region ){
      if(selectorAreaArray[i].Town !== null){
        selectorAreaStr += `<option value="${selectorAreaArray[i].Town}">${selectorAreaArray[i].Town}</option>`;
      }
    }
  }
selectorArea.innerHTML = titleStr + selectorAreaStr;
};

/* 列表更新 */

function updateList(data) {
  let str = '';
  let emptyStr= `<li class="itemempty"></li><li class="itemempty"></li>`;
  data.forEach(item => {
    str += `<li>   
              <iframe src="https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${item.Py},${item.Px}&z=16&output=embed&t=" max-width="100%" height="155" style="border: 4px solid #FFFFFF;" allowfullscreen=""></iframe>
              <ul class="areaListBottom">
                <h5>${item.Name}<p class="area">${item.Town}</p></h5>
                <li class="openTime">
                  <img src="images/webLogo/icons_clock.png"><span > ${item.Opentime || '未公佈開放時間' } </sapn>
                </li>
                <li class="address">
                  <img src="images/webLogo/icons_pin.png"><span> ${item.Add || '未公佈地址'} </span>
                </li>
                <li class="telephone">
                  <img src="images/webLogo/icons_phone.png"><span> ${item.Tel || '未公佈業者電話'} </span>
                  <div class="freeVisit">
                    <img src="images/webLogo/icons_tag.png"><span> ${item.Ticketinfo || '未公佈收費方式'} </span>
                  </div>
                </li>
              </ul>
            </li>`;
  });
areaList.innerHTML = str + emptyStr;
};

/* 圖片更新 */

function updateImage(e) {
  var selector = e.target.value;
  let str='';
  let titleTextStr='';
  switch (selector) {
  case "桃園市" :
    str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Taoyuan.jpg);">
    </div>`
    break;
  case "臺南市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Tainan.jpg);">
      </div>`
      break;
  case "花蓮縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Hualien.jpg);">
      </div>`
      break;
  case "臺東縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Taitung.jpg);">
      </div>`
      break;
  case "澎湖縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Penghu.jpg);">
      </div>`
      break;
  case "屏東縣" :
    str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Pingtung.jpg);">
    </div>`
    break;
  case "連江縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Matsu.jpg);">
      </div>`
      break;
  case "南投縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Nantou.jpg);">
      </div>`
      break;
  case "苗栗縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Miaoli.jpg);">
      </div>`
      break;
  case "彰化縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Changhua.jpg);">
      </div>`
      break;
  case "臺中市" :
    str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Taichung.jpg);">
    </div>`
    break;
  case "新竹縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Hsinchu.jpg);">
      </div>`
      break;
  case "嘉義縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Chiayi.jpg);">
      </div>`
      break;
  case "高雄市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Kaohsiung.jpg);">
      </div>`
      break;
  case "新北市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/NewTaipei.jpg);">
      </div>`
      break;
  case "基隆市" :
    str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/keelung.jpg);">
    </div>`
    break;
  case "雲林縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Hualien.jpg);">
      </div>`
      break;
  case "宜蘭縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Ilan.jpg);">
      </div>`
      break;
  case "金門縣" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Kinmen.jpg);">
      </div>`
      break;
  case "嘉義市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Chiayi.jpg);">
      </div>`
      break;
  case "新竹市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Hsinchu.jpg);">
      </div>`
      break;
  case "臺北市" :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Taipei.jpg);">
      </div>`
      break;
  default :
      str = `<div class="asideImage bg-cover" style=" background-image: url(images/touristAttraction/Taipei.jpg);">
      </div>`
      break;
  };
  titleTextStr = `<div class="titleText"><p>${selector}</p></div>`;
  aside.innerHTML = str + titleTextStr ;
};


selectorCity.addEventListener('change',updateSelectorArea,false)
selectorCity.addEventListener('change',updateImage,false)
selectorCity.addEventListener('change',paginationArrayCity,false)
selectorArea.addEventListener('change',paginationArrayArea,false)
