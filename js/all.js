const URL = 'https://cors-anywhere.herokuapp.com/https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json';
var areaList = document.querySelector('.areaList');
const pageID = document.getElementById("pageid");
var aside = document.querySelector('.aside');
var selectorCity = document.querySelector('.selectorCity');
var selectorArea = document.querySelector('.selectorArea');
var loader = document.querySelector(".loader");

fetch(URL,{method:'GET'})
.then(response => {
  return response.json();
}).then(data  => {
    jsonData = data.XML_Head.Infos.Info;
    for(let i = 0; i < jsonData.length; i++){
      if(jsonData[i].Region === null || jsonData[i].Town === null){
        delete jsonData[i];
      }
    }
    jsonData = jsonData.filter(function(e){return e});
    updateSelectorCity(jsonData);
    pagination(jsonData, 1);
}).then(() => {
  loader.style.display = "none";
});;


/* Pagination 換頁 */

function pagination(jsonData, nowPage) {
  const dataTotal = jsonData.length;
  const perPage = 12;
  const totalPage = Math.ceil(dataTotal / perPage);
  let currentPage = nowPage;
  if (currentPage > totalPage) {
    currentPage = totalPage;
  }
  const minData = currentPage * perPage - perPage + 1;
  const maxData = currentPage * perPage;
  const data = [];
  jsonData.forEach((item, index) => {
    const num = index + 1;
    if (num >= minData && num <= maxData) {
      data.push(item);
    }
  });
  const page = {
    totalPage,
    currentPage,
  };
  pageBtn(page);
  updateListDefault(data);
}

function pageBtn(page) {
  var strr='';
  var strrr='';
  var str = `<li class="page-item page-active" data-page="${parseInt(page.currentPage)}">${parseInt(page.currentPage)}</li>`;
  const total = page.totalPage;
  if (parseInt(page.currentPage) < 1) {
    parseInt(page.currentPage) = 1
  };
  preStr = `<li class="page-item page-pre" data-page="${parseInt(page.currentPage) -1}">
  <i class="fas fa-caret-left" data-page="${parseInt(page.currentPage) -1}"></i>
</li>`;
  nextStr = `<li class="page-item page-next" data-page="${parseInt(page.currentPage) +1}">
  <i class="fas fa-caret-right" data-page="${parseInt(page.currentPage) +1}"></i>
</li>`;
  for(var i=3; i>=1; i--) {
    if(parseInt(page.currentPage) - i > 1) {
        strr += `<li class="page-item" data-page="${parseInt(page.currentPage) -i}">${parseInt(page.currentPage) -i}</li>`;
    }
  }
  for(var i=1; i<=3; i++) {
    if(parseInt(page.currentPage) + i < total) {
        strrr += `<li class="page-item" data-page="${parseInt(page.currentPage) +i}">${parseInt(page.currentPage) +i}</li>`
    }
  }
  pageID.innerHTML = preStr+strr+str+strrr+nextStr;
}

function switchPage(e) {
  e.preventDefault();
  const page = e.target.dataset.page;
  pagination(jsonData, page);
}

pageID.addEventListener("click", switchPage);

/* 列表更新 */

function updateListDefault(data) {
  let str = '';
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
areaList.innerHTML = str ;
};

function updateSelectorCity() {
  let titleStr = `<option selected="selected" disabled="disabled">- - 請選擇縣市- -</option>`;
  let selectorCityStr = '';
  const set = new Set();
  const selectorCityArray = jsonData.filter(item => !set.has(item.Region) ? set.add(item.Region): false);
    for(let i = 0;i < selectorCityArray.length; i++){
        selectorCityStr += `<option value="${selectorCityArray[i].Region}">${selectorCityArray[i].Region}</option>`;
    }
selectorCity.innerHTML = titleStr + selectorCityStr;  
}

function updateSelector(e) {
  pageid.style.display = "none";
  var selector = e.target.value;
  let titleStr = `<option selected="selected" disabled="disabled">- - 請選擇區域- -</option>`;
  let selectorAreaStr = '';
  let str = '';
  let emptyStr= '';
  const set = new Set();
  const selectorAreaArray = jsonData.filter(item => !set.has(item.Town) ? set.add(item.Town): false);
  for(let i = 0;i < selectorAreaArray.length; i++){
    if(selector == selectorAreaArray[i].Region ){
      selectorAreaStr += `<option value="${selectorAreaArray[i].Town}">${selectorAreaArray[i].Town}</option>`;
    }
  }
selectorArea.innerHTML = titleStr + selectorAreaStr;
};

function updateList(e) {
  var selector = e.target.value;
  const jsonDataLen = jsonData.length;
  let str = '';
  let emptyStr= '';
  for(let i = 0;i < jsonDataLen; i++){
    if(selector == jsonData[i].Town){
        str += `<li>
        <iframe src="https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${jsonData[i].Py},${jsonData[i].Px}&z=16&output=embed&t=" max-width="100%" height="155" style="border: 4px solid #FFFFFF;" allowfullscreen=""></iframe>
        <ul class="areaListBottom">
          <h5>${jsonData[i].Name}<p class="area">${jsonData[i].Town}</p></h5>
          <li class="openTime">
            <img src="images/webLogo/icons_clock.png"><span > ${jsonData[i].Opentime || '未公佈開放時間' } </sapn>
          </li>
          <li class="address">
            <img src="images/webLogo/icons_pin.png"><span> ${jsonData[i].Add || '未公佈地址'} </span>
          </li>
          <li class="telephone">
            <img src="images/webLogo/icons_phone.png"><span> ${jsonData[i].Tel || '未公佈業者電話'} </span>
            <div class="freeVisit">
              <img src="images/webLogo/icons_tag.png"><span> ${jsonData[i].Ticketinfo || '未公佈收費方式'} </span>
            </div>
          </li>
        </ul>
        </li>`;
      if ( 1==1){
        emptyStr = `<li class="itemempty"></li><li class="itemempty"></li><li class="itemempty"></li>`;
      }
    }
  }
areaList.innerHTML = str + emptyStr;
};

function updateImage(e) {
  var selector = e.target.value;
  let str='';
  let titleTextStr='';
  console.log(e)
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
  for(let i = 0; i < jsonData.length; i++) {
    if (selector == jsonData[i].Region) {
      titleTextStr = `<div class="titleText"><p>${jsonData[i].Region}</p></div>`;
    }
  }
  aside.innerHTML = str + titleTextStr ;
};


selectorCity.addEventListener('change',updateSelector,false)
selectorCity.addEventListener('change',updateImage,false)
selectorArea.addEventListener('change',updateList,false)