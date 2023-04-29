
let lhdb
let sheet_data
let img_src

function openjson() {
  let url = document.getElementById("sheet_id").value;
  let request = new XMLHttpRequest();
  request.open('GET', "https://lhrpg.com/lhz/api/"+url+".json");
  request.responseType = 'json';
  request.send();
  img_src = "https://lhrpg.com/lhz/image/icons/"+('000000'+url).slice(-6)+".jpg";

  request.onload = function () {
    let data = request.response;
    sheet_data = JSON.parse(JSON.stringify(data));
    tmpfill();
  }
}

function openjson_local(e) {
  let reader = new FileReader();
  reader.readAsText(e.files[0], "UTF-8");
  reader.onload = function () {
    sheet_data = JSON.parse(reader.result);
    tmpfill();
  }
}

function openimg_loacl(e) {
  let reader = new FileReader();
  reader.readAsDataURL(e.files[0]);
  reader.onload = function () {
    img_src = reader.result;
  }
}

function tmpfill() {
  document.getElementById("tmp_data").innerHTML= sheet_data["name"]+'&nbsp;CR:'+sheet_data["character_rank"]
}

function writesheet() {
  if(!sheet_data) {
    return;
  }
  let obj = window.open();
  let sheet_width = document.getElementById("sheet_width").value;
  let code='<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width='+sheet_width+'px, user-scalable=yes">'
      +'<link rel="stylesheet" type="text/css" href="sheet.css">'
      +'<title>'+sheet_data["name"]+' :LHTRPGキャラシ</title></head>'
      +'<body ontouchstart = ""><table id="basedata"><caption hidden>基本データ</caption>'
      +'<tbody class="cr_block"><tr><th>CR:</th><td class="num" id="character_rank">'+sheet_data["character_rank"]+'</td></tr></tbody><tbody class="pcname">'
      +'<tr class="pcname"><th hidden>PC名:</th><td class="nameWrap">'
      +'<p><dev id="wrapname">'+sheet_data["name"]+'</dev> <dev id="wrapplay">@'+sheet_data["player_name"]+'</dev></p>'
      +'<p id="wraptag"><li class="skillTag">'+sheet_data["tags"].join('</li><li class="skillTag">')+'</li></p>'
      +'<p id="wrapremark">'+(sheet_data["remarks"]?sheet_data["remarks"].replace(/[\r\n|\n]+/g,"<br>"):"<br>")+'</p>'
      +'</td><td class="strings" id="name">'+sheet_data["name"]+'</td>'
      +'</tr></tbody><tbody  class="job"><tr class="job"><td class="enum" id="main_job">'+sheet_data["main_job"]+'</td>'
      +'</tr><tr class="job"><td class="enum" id="sub_job">'+sheet_data["sub_job"]+'</td>'
      +'</tr><tr class="job"><td class="enum" id="race">'+sheet_data["race"]+'</td></tr></tbody></table>'
      +'<table id="status"><caption hidden>ステータス</caption><tr>'
      +'<th>HP</th><td class= "num" id="max_hitpoint">'+sheet_data["max_hitpoint"]+'</td>'
      +'<th>因果</th><td class= "num" id="effect">'+sheet_data["effect"]+'</td>'
      +'<th>行動</th><td class= "num" id="action">'+sheet_data["action"]+'</td>'
      +'<th>移動</th><td class= "num" id="move">'+sheet_data["move"]+'</td>'
      +'<th>射程</th><td class= "num" id="range">'+sheet_data["range"]+'</td>'
      +'</tr><tr>'
      +'<th>攻撃</th> <td class= "num" id="physical_attack">'+sheet_data["physical_attack"]+'</td>'
      +'<th>魔力</th> <td class= "num" id="magic_attack">'+sheet_data["magic_attack"]+'</td>'
      +'<th>物防</th> <td class= "num" id="physical_defense">'+sheet_data["physical_defense"]+'</td>'
      +'<th>魔防</th> <td class= "num" id="magic_defense">'+sheet_data["magic_defense"]+'</td>'
      +'<th>回復</th> <td class= "num" id="heal_power">'+sheet_data["heal_power"]+'</td>'
      +'</tr></table><table id="abl"><caption hidden>能力値</caption><tr>'
      +'<th>STR</th>'
      +'<td class= "num" id="str_value">'+sheet_data["str_value"]+'</td>'
      +'<td class= "nump" id="str_basic_value">('+("\u00A0"+sheet_data["str_basic_value"]).slice(-2)+')</td>'
      +'<th>運動</th><td class= "dice" id="abl_motion">'+sheet_data["abl_motion"]+'</td>'
      +'<th>耐久</th><td class= "dice" id="abl_durability">'+sheet_data["abl_durability"]+'</td>'
      +'<th>命中</th><td class= "dice" id="abl_hit">'+sheet_data["abl_hit"]+'</td>'
      +'</tr><tr>'
      +'<th>DEX</th>'
      +'<td class= "num" id="dex_value">'+sheet_data["dex_value"]+'</td>'
      +'<td class= "nump" id="dex_basic_value">('+("\u00A0"+sheet_data["dex_basic_value"]).slice(-2)+')</td>'
      +'<th>解除</th><td class= "dice" id="abl_dismantle">'+sheet_data["abl_dismantle"]+'</td>'
      +'<th>操作</th><td class= "dice" id="abl_operate">'+sheet_data["abl_operate"]+'</td>'
      +'<th>回避</th><td class= "dice" id="abl_avoid">'+sheet_data["abl_avoid"]+'</td>'
      +'</tr><tr>'
      +'<th>POW</th>'
      +'<td class= "num" id="pow_value">'+sheet_data["pow_value"]+'</td>'
      +'<td class= "nump" id="pow_basic_value">('+("\u00A0"+sheet_data["pow_basic_value"]).slice(-2)+')</td>'
      +'<th>知覚</th><td class= "dice" id="abl_sense">'+sheet_data["abl_sense"]+'</td>'
      +'<th>交渉</th><td class= "dice" id="abl_negotiate">'+sheet_data["abl_negotiate"]+'</td>'
      +'<th>抵抗</th><td class= "dice" id="abl_resist">'+sheet_data["abl_resist"]+'</td>'
      +'</tr><tr>'
      +'<th>INT</th>'
      +'<td class= "num" id="int_value">'+sheet_data["int_value"]+'</td>'
      +'<td class= "nump" id="int_basic_value">('+("\u00A0"+sheet_data["int_basic_value"]).slice(-2)+')</td>'
      +'<th>知識</th><td class= "dice" id="abl_knowledge">'+sheet_data["abl_knowledge"]+'</td>'
      +'<th>解析</th><td class= "dice" id="abl_analyze">'+sheet_data["abl_analyze"]+'</td>'
      +'<th></th><td class= "dice"></td>'
      +'</tr></table>'
      +'<img src="'+(img_src?img_src:"img/icon1.png")+'">'
      +'<table id="equip"><colgroup span="1" class="head"><colgroup span="3" class="data"><tr>'
      +'<th>手</th>'
      +'<td class="item strings" id="hand1">'+(sheet_data["hand1"]?sheet_data["hand1"]["alias"]+write_item(sheet_data["hand1"]):"\u00A0")+'</td>'
      +'<td class="item strings" id="hand2">'+(sheet_data["hand2"]?sheet_data["hand2"]["alias"]+write_item(sheet_data["hand2"]):"\u00A0")+'</td>'
      +'</tr><tr>'
      +'<th>防具</th>'
      +'<td class="item strings" id="armor">'+(sheet_data["armor"]?sheet_data["armor"]["alias"]+write_item(sheet_data["armor"]):"\u00A0")+'</td>'
      +'</tr><tr>'
      +'<th>補助</th>'
      +'<td class="item strings" id="support_item1">'+(sheet_data["support_item1"]?sheet_data["support_item1"]["alias"]+write_item(sheet_data["support_item1"]):"\u00A0")+'</td>'
      +'<td class="item strings" id="support_item2">'+(sheet_data["support_item2"]?sheet_data["support_item2"]["alias"]+write_item(sheet_data["support_item2"]):"\u00A0")+'</td>'
      +'<td class="item strings" id="support_item3">'+(sheet_data["support_item3"]?sheet_data["support_item3"]["alias"]+write_item(sheet_data["support_item3"]):"\u00A0")+'</td>'
      +'</tr><tr>'
      +'<th>鞄</th>'
      +'<td class="item strings" id="bag">'+(sheet_data["bag"]?sheet_data["bag"]["alias"]+write_item(sheet_data["bag"]):"\u00A0")+'</td>'
      +'</tr></table>'
      +'<table id="belongings">'
      +'<caption hidden>所持品一覧</caption>'
      +'<colgroup span="1" class="head">'
      +'<colgroup span="1" class="data" id="items_num">'
      +'<tr id="items">'
      +'<th>所持</th>';

  var use_yen=0, use_mg=0;
  keys=["hand1","hand2","armor","support_item1","support_item2","support_item3","bag"];
  keys.forEach(key => {
    if(sheet_data[key]) {
      use_yen+=sheet_data[key]["price"];
      sheet_data[key]["tags"].forEach(tag => {
        let mg = /M([0-9]+)/.exec(tag);
        if(mg) {
          use_mg+=parseInt(tag[1]);
        }
      });
    } else {
    }
  });

  //所持品書き込み
  var i=0, emp=0;
  sheet_data["items"].forEach(item => {
    if (item) {
      code+='<td class="item strings" id="item_'+i+'">'+item["alias"]+write_item(item)+'</td>';
      use_yen+=item["price"];
      item["tags"].forEach(tag => {
        let mg = /M([0-9]+)/.exec(tag);
        if(mg) {
          use_mg+=parseInt(tag[1]);
        }
      });
    } else {
      emp++;
    }
    i++;
  });

  code=code+'<td class="strings" id="item_emp">計'+use_yen+'G, MG: '+use_mg+', 空きスロット:'+("\u00A0"+emp).slice(-2)+'</td>'
      +'</tr></table>'
      +'<table id="skills">'
      +'<caption hidden>所持スキル一覧</caption>'
      +'<tbody id="skill_block">'

  //スキル書き込み
  var i=0, emp=0;
  sheet_data["skills"].forEach(skill => {
    if(skill) {
      code += '<tr class="skill_tr" id="skill_'+i+'"><td class="strings">'+skill["name"]+write_skill(skill)+'</td> <td class="enum">'+skill["timing"]
                +'</td> <td class="nump">'+skill["skill_rank"]+'/'+skill["skill_max_rank"]+'</td></tr> '
    } else {
      emp++;
    }
    i++;
  });
  if (emp > 0) {
    code += '<tr><td>空きスロット:'+emp+'</td></tr>';
  }
  code+='</tbody></table><hr></body></html>';
  obj.document.open();
  obj.document.write(code);
  obj.document.close();
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