
var Database = {};
var tmpdata;
var tmpcr="";
function openjson() {
  let url_id = document.getElementById("sheet_id").value;
  let request = new XMLHttpRequest();
  request.open('GET', "https://lhrpg.com/lhz/api/"+url_id+".json?timestamp="+new Date().getTime());
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    let data = request.response;
    tmpdata = JSON.parse(JSON.stringify(data));
    datafill(tmpdata);
    document.getElementById("view_char").value = "";
    document.getElementById("tmp_char").label = "ID:"+document.getElementById("sheet_id").value;
    tmpcr="";
    select_char();
  }
}

function openjson_local(e) {
  let reader = new FileReader();
  reader.readAsText(e.files[0], "UTF-8");
  reader.onload = function () {
    Database = JSON.parse(reader.result);
    update_list();
  }
}

function savejson() {
  let key= document.getElementById("save_char").value;
  if (!(key in Database)) {
    Database[key]={};
  }
  if(tmpdata) {
    tmpcr="CR:"+tmpdata["character_rank"]
    Database[key][tmpcr]=tmpdata;
    update_list();
    document.getElementById("view_char").value=key;
    select_char();
  }
}

function writejson(){
  let str = JSON.stringify(Database); // 出力文字列
  let ary = str.split(''); // 配列形式に変換（後述のBlobで全要素出力）
  let blob = new Blob(ary,{type:"text/json"}); // テキスト形式でBlob定義
  let link = document.createElement('a'); // HTMLのaタグを作成
  link.href = URL.createObjectURL(blob); // aタグのhref属性を作成
  link.download = 'LHViewer.lhdb'; // aタグのdownload属性を作成
  link.click(); // 定義したaタグをクリック（実行）
}

function select_char(){
  let key= document.getElementById("view_char").value;
  let str_list = '<option value="" label="CR:--"></option>\n'
  if(key != "") {
    Object.keys(Database[key]).map(key2 => {
      str_list += '<option value="'+key2+'" label="'+key2+'"></option>\n'
    });
  }
  document.getElementById("cr_list").innerHTML= str_list;
  document.getElementById("cr_list").value=tmpcr;
  select_cr();
}

function select_cr(){
  let key= document.getElementById("view_char").value;
  let key2= document.getElementById("cr_list").value;
  if((key != "") & (key2 != "")) {
    datafill(Database[key][key2])
  }
}

function update_list(){
  let str_view = '<option id="tmp_char" value="" label="表示キャラ"></option>\n'
  let str_list = ''
  Object.keys(Database).map(key => {
    str_view += '<option value="'+key+'" label="'+key+'"></option>\n'
    str_list += '<option value="'+key+'"></option>\n'
  });
  document.getElementById("view_char").innerHTML= str_view;
  document.getElementById("save_list").innerHTML= str_list;

}

window.addEventListener('beforeunload', function (e) {
  // イベントをキャンセルする
  e.preventDefault();
  // Chrome では returnValue を設定する必要がある
  e.returnValue = '';
});

function makesheet(chardata) {
  var obj = window.open();
  let code='';
  obj.document.open();
  obj.document.write(code);
  obj.document.close();
}
function datafill(chardata) {
  // JSONデータを出力したいHTML要素を指定
  keys=["name","character_rank","main_job","sub_job","race",
        "max_hitpoint","effect","action","move","range","heal_power",
        "physical_attack","magic_attack","physical_defense","magic_defense",
        "str_value","dex_value","pow_value","int_value",
        "abl_motion","abl_durability","abl_dismantle","abl_operate",
        "abl_sense","abl_negotiate","abl_knowledge","abl_analyze",
        "abl_avoid","abl_resist","abl_hit"];
  keys.forEach(key => {
    document.getElementById(key).innerHTML= chardata[key];
  });
  keys=["str_basic_value","dex_basic_value","pow_basic_value","int_basic_value"];
  keys.forEach(key => {
    document.getElementById(key).innerHTML= "("+("\u00A0"+chardata[key]).slice(-2)+")";
  });
  keys=["hand1","hand2","armor","support_item1","support_item2","support_item3","bag"];
  keys.forEach(key => {
    if(chardata[key]) {
      if (!chardata[key]["alias"]) {
        document.getElementById(key).innerHTML= chardata[key]["name"]+write_item(chardata[key]);
      } else {
        document.getElementById(key).innerHTML= chardata[key]["alias"]+write_item(chardata[key]);
      }
    } else {
      document.getElementById(key).innerHTML= "\u00A0";
    }
  });
  //所持品書き込み
  document.getElementById("items").innerHTML="<th>所持</th>";
  var i=0, emp=0;
  chardata["items"].forEach(item => {
    if (item) {
      document.getElementById("items").insertAdjacentHTML('beforeend','<td class="item strings" id="item_'+i+'">'+item["alias"]+write_item(item)+'</td>');
    } else {
      emp++;
    }
    i++;
  });
  document.getElementById("items").insertAdjacentHTML('beforeend','<td class="strings" id="item_emp">空きスロット:'+("\u00A0"+emp).slice(-2)+'</td>');
  document.getElementById("items_num").setAttribute('span',i+1);
  //スキル書き込み
  document.getElementById("skill_block").innerHTML="";
  var i=0, emp=0;
  chardata["skills"].forEach(skill => {
    if(skill) {
      let line = '<tr class="skill_tr" id="skill_'+i+'"><td class="strings">'+skill["name"]+write_skill(skill)+'</td> <td class="enum">'+skill["timing"]
                +'</td> <td class="nump">'+skill["skill_rank"]+'/'+skill["skill_max_rank"]+'</td></tr> '
      document.getElementById("skill_block").insertAdjacentHTML('beforeend',line);
    } else {
      emp++;
    }
    i++;
  });
  if (emp > 0) {
    document.getElementById("skill_block").insertAdjacentHTML('beforeend','<tr><td>空きスロット:'+emp+'</td></tr>');
  }
}

function write_item(data) {
  let code= '<div class="itemWrap"><div class="skillWrap"><h3 class="skillTitle">'+data["name"]+' <span class="itemRank">ランク '+
            data["item_rank"]+'</span></h3><ul class="skillTags"><li class="skillType">'+data["type"]+'</li> ';
  data["tags"].forEach(tag => {
    code+= '<li class="skillTag">'+tag+'</li>';
  });
  switch (data["type"]){
    case "武器":
      code+= '</ul><div class="skillTh2 clear">攻撃力</div><div class="skillTd2">'+data["physical_attack"]+'</div> '+
            '<div class="skillTh2">魔力</div><div class="skillTd2">'+data["magic_attack"]+'</div>'+
            '<div class="skillTh2 clear">命中</div><div class="skillTd2">'+data["timing"]+'</div> '+
            '<div class="skillTh2">行動</div><div class="skillTd2">'+data["action"]+'</div>'+
            '<div class="skillTh2 clear">射程</div><div class="skillTd2">'+data["range"]+'</div> ';
      break;
    case "防具":
    case "盾":
      code+= '</ul><div class="skillTh2 clear">物理防御力</div><div class="skillTd2">'+data["physical_defense"]+'</div> '+
            '<div class="skillTh2">魔法防御力</div><div class="skillTd2">'+data["magic_defense"]+'</div>'+
            '<div class="skillTh2 clear">行動</div><div class="skillTd2">'+data["timing"]+'</div> ';
      break;
    case "補助":
      code+= '</ul><div class="skillTh2 clear">魔力</div><div class="skillTd2" style="width:235px;">'+data["magic_attack"]+'</div>'+
            '</ul><div class="skillTh2 clear">物理防御力</div><div class="skillTd2">'+data["physical_defense"]+'</div> '+
            '<div class="skillTh2">魔法防御力</div><div class="skillTd2">'+data["magic_defense"]+'</div>'+
            '<div class="skillTh2 clear">行動</div><div class="skillTd2">'+data["timing"]+'</div> ';
      break;
    case "収納":
      let slot= 0;
      let lim= "";
      let myre=/([0-9]+)/giu;
      let tmp;
      while ((tmp = myre.exec(data["function"])) !== null) {
        slot+= parseInt(tmp[0]);
      }
      myre=/(［.*］+)専用の所持品スロットを([0-9]+)/giu;
      while ((tmp = myre.exec(data["function"])) !== null) {
        lim+= tmp[1].replace(/[［］]/giu, ' ')+" ("+tmp[2]+") ";
      }
      if (! lim) lim="\u00A0";
      code+= '</ul><div class="skillTh2 clear">収納制限</div><div class="skillTd2" style="width:235px;">'+lim+'</div>'+
            '</ul><div class="skillTh2 clear">スロット数</div><div class="skillTd2">'+slot+'</div> ';
      break;
    default:
      code+= '</ul><div class="skillTh2 clear">タイミング</div><div class="skillTd2" style="width:235px;">'+data["timing"]+'</div> '+
            '<div class="skillTh2 clear">判定</div><div class="skillTd2" style="width:235px;">'+data["roll"]+'</div>'+
            '<div class="skillTh2 clear">対象</div><div class="skillTd2" style="width:235px;">'+data["target"]+'</div> '+
            '<div class="skillTh2 clear">射程</div><div class="skillTd2">'+data["range"]+'</div> ';
      break;
    
  }
  code+=  '<div class="skillTh2">価格</div><div class="skillTd2">'+data["price"]+'</div>';
  if (data["recipe"]) {
    code+= '<p class="skillFunction"><b>レシピ：</b>'+data["recipe"]+'</p><hr class="skillHr">\n\n';
  }
  code+= '<p class="skillFunction"><b>効果・解説：</b>'+data["function"]+'</p>';
  if (data["prefix_function"]) {
    code+= '<hr class="skillHr">\n\n<p class="skillFunction"><b>プレフィックスド効果：</b>'+data["prefix_function"]+'</p>';
  }
  code+= '</div></div>';
  return code;
}

function write_skill(data) {
  let code=  '<div class="skillWrap"><h3 class="skillTitle">'+data["name"]+'</h3><ul class="skillTags"><li class="skillType">'+data["type"]+'</li> ';
  data["tags"].forEach(tag => {
    code+= '<li class="skillTag">'+tag+'</li>';
  });
  code+= '</ul><div class="skillTh">SR</div><div class="skillTd" style="min-width:30px;">'+data["skill_rank"]+'/'+data["skill_max_rank"]+'</div> '+
          '<div class="skillTh">タイミング</div><div class="skillTd" style="width:150px;">'+data["timing"]+'</div><br>'+
          '<div class="skillTh clear">判定</div><div class="skillTd" style="width:265px;">'+data["roll"]+'</div><br>'+
          '<div class="skillTh clear">対象</div><div class="skillTd">'+data["target"]+'</div> '+
          '<div class="skillTh">射程</div><div class="skillTd">'+data["range"]+'</div><br>'+
          '<div class="skillTh clear">コスト</div><div class="skillTd">'+data["cost"]+'</div> '+
          '<div class="skillTh">制限</div><div class="skillTd">'+data["limit"]+'</div>\n\n'+
          '<p class="skillFunction"><b style="font-size:14px;">効果：</b>'+data["function"]+'</p>'+
          '<hr class="skillHr"><p class="skillFunction"><b style="font-size:14px;">解説：</b>'+data["explain"]+'</p></div>';
  return code;
}
