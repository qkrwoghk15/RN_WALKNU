///////////////////////////////////////////////////////// convert to String time from Json /////////////////////////////////////////////////////////
export function convertStrTime(item){
    var time = JSON.stringify(item.ltime);
        time = time.substr(1,time.length-2);
    var strAry = time.split("\\n");
    var str = "", str1 = "";

    str += convertDay(strAry[0].charAt(0))
    str += convertTm(strAry[0].substring(1,3))
    str += convertTm(strAry[0].substring(strAry[0].length-2,strAry[0].length))

    for(let i=1; i<strAry.length; i++){
        if(str.charAt(0) != convertDay(strAry[i].charAt(0))){
            if(str1.charAt(0) != convertDay(strAry[i].charAt(0))){
                str1 += convertDay(strAry[i].charAt(0))
                str1 += convertTm(strAry[i].substring(1,3))
                str1 += convertTm(strAry[i].substring(strAry[i].length-2,strAry[i].length))
            }
            else str1 = str1.substr(0, 3) + convertTm(strAry[i].substring(strAry[i].length-2,strAry[i].length));
        }
        else{
            str = str.substr(0, 3) + convertTm(strAry[i].substring(strAry[i].length-2,strAry[i].length));
        }
    }
    
    return item.strTime = (str1==""? str : str+str1);
}

function convertTm(time){
    var temp = String(parseInt(time.charAt(0))*2 + (time.charAt(1)=='A'? 0 : 1))
    if(temp.length==1) temp = '0'+temp;
    return temp;
}

function convertDay(day){
    if(day == '월') return '0'
    if(day == '화') return '1'
    if(day == '수') return '2'
    if(day == '목') return '3'
    if(day == '금') return '4'
}
///////////////////////////////////////////////////////// convert to String time from Json /////////////////////////////////////////////////////////