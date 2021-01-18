class Tool{
  formatDate(currentDate){
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    month = month >=10 ? month : '0' + month
    var date = currentDate.getDate();
    date = date >= 10 ? date : '0' + date
    return year + '-'+month + '-'+ date;
  }
  thousandthPlace(value){
    var v = value.toString().split('.');
    var valueInt = v[0]

    var ints = [];
    for (var i = valueInt.length-1; i>=0;i-=3){
      var index =i-2<=0 ? 0 : i-2;
      var v1 = valueInt.slice(index ,i+1)
      ints.unshift(v1)
    }
    var v2 = ints.join(',')
    if(v[1]){
     v2+= '.'+v[1]
    }
    return v2;
  }
}
export const tool = new Tool()