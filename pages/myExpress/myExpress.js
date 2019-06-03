const common= require("../../common/common.js");
const app = getApp();

Page({
  data: {
    currentTab:'0',
    detailpage:0,
    orderStatus:'',
    tabs:[
      {
        name: "全部"
      },
      {
        name: "待接单"
      },
      {
        name: "待签收"
      }
    ]
  },
  onLoad(){
    //初次加载
    this.setData({
      loadingflag:true
    })
    let that=this;
    let jsonData = {
        "object": {
            "pageRow": 0,
            "startPage": 0,
            "object":{
              "orderStatus":''
            }
        }
    };
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax('/expressOrderDetail/queryUserOrderList',jsonData,
      function(res) {
        console.log(res.headers)
        let headers=res.headers;
        let setcookie=headers["set-cookie"];
        common.sessionvalid(setcookie,function(){
           that.setData({
              loadingflag:false
            })
           if(res.data.errCode=='000000'){
            let list=res.data.object.list;
            console.log(list)
            for(let i=0;i<list.length;i++){
              const sendercityName=list[i].senderProvinceCityCountyName.split('-')[1].split('市')[0];
              const receivecityName=list[i].receiverProvinceCityCountyName.split('-')[1].split('市')[0];
              let orderStatus=list[i].orderStatus;
                   if (orderStatus == 0) {
                      list[i].orderstate = "待接单";
                      that.setData({
                        detailpage:1
                      })
                  } else if (orderStatus == 1) {
                       that.setData({
                        detailpage:1
                      })
                      list[i].orderstate= "待取件";
                  } else if (orderStatus == 2) {
                      list[i].orderstate = "未付款";
                  } else if (orderStatus == 3) {
                      list[i].orderstate = "待发件";
                  } else if (orderStatus == 4) {
                      list[i].orderstate = "待签收";
                  } else if (orderStatus == 5) {
                      list[i].orderstate = "已签收";
                  } else if (orderStatus == 6) {
                      list[i].orderstate = "已取消";
                  }
              list[i].sendercityName=sendercityName;
              list[i].receivecityName=receivecityName;
            }
            if(list.length==0){
                that.setData({
                    noaddress:true,
                })
              }else{
                that.setData({
                    noaddress:false,
                    list:list,
                })
              }
            that.setData({
                list:list,
            })
            console.log(that.data.list)
            
          }else{
            common.unLogin(res);
          }
        })
       
      },function(res) {
          that.setData({
            loadingflag:false
          }) 
          my.alert({content: '网络错误，请求失败'});     
    }) 
  },
  tab(e){
    this.setData({
      loadingflag:true
    })
    const id=e.currentTarget.dataset.id;
    const left=250*id;
     this.setData({
        left:left,
        currentTab:id,
        list:[],
        noaddress:false
     })

    let that=this;
    if(id=='1'){
      var orderStatus='0'
    }else if(id=='2'){
       var orderStatus='4'
    }else if(id=='0'){
       var orderStatus=''
    }
    //tab查询地址
    let jsonData = {
        "object": {
            "pageRow": 0,
            "startPage": 0,
            "object":{
              "orderStatus":orderStatus
            }
        }
    };
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax('/expressOrderDetail/queryUserOrderList',jsonData,
      function(res) {
        console.log(res.headers)
        let headers=res.headers;
        let setcookie=headers["set-cookie"];
        console.log('header setcookie')
        console.log(setcookie)
        common.sessionvalid(setcookie,function(){
           that.setData({
              loadingflag:false
            })
          if(res.data.errCode=='000000'){
            let list=res.data.object.list;
            console.log(list)
            for(let i=0;i<list.length;i++){
              const sendercityName=list[i].senderProvinceCityCountyName.split('-')[1].split('市')[0];
              const receivecityName=list[i].receiverProvinceCityCountyName.split('-')[1].split('市')[0];
              let orderStatus=list[i].orderStatus;
                  if (orderStatus == 0) {
                      list[i].orderstate = "待接单";
                  } else if (orderStatus == 1) {
                      list[i].orderstate= "待取件";
                  } else if (orderStatus == 2) {
                      list[i].orderstate = "未付款";
                  } else if (orderStatus == 3) {
                      list[i].orderstate = "待发件";
                  } else if (orderStatus == 4) {
                      list[i].orderstate = "待签收";
                  } else if (orderStatus == 5) {
                      list[i].orderstate = "已签收";
                  } else if (orderStatus == 6) {
                      list[i].orderstate = "已取消";
                  }
              list[i].sendercityName=sendercityName;
              list[i].receivecityName=receivecityName;
            }
            if(list.length==0){
                that.setData({
                    noaddress:true,
                })
              }else{
                that.setData({
                    noaddress:false,
                    list:list,
                })
              }
            that.setData({
                list:list,
            })
            console.log(that.data.list)
            
          }else{
            // my.alert({content: res.data.errDesc}); 
            common.unLogin(res);
          }
        })
        
      },
      function(res) {
        that.setData({
          loadingflag:false
        }) 
        my.alert({content: '网络错误，请求失败'});  
    })  
  },
  goDetail(e){
      let that=this;
      let myExpressData=this.data.list[e.currentTarget.dataset.id];
      let orderStatus=myExpressData.orderstate;
      console.log(orderStatus)
      if (orderStatus == '待接单') {
          that.setData({
            detailpage:1
          })
      } else if (orderStatus == "待取件") {
          that.setData({
            detailpage:1
          })
      } else if (orderStatus == "已取消") {
          that.setData({
            detailpage:1
          })
      }else{
         that.setData({
            detailpage:0
          })
      } 
      my.setStorage({
        key: 'myExpressData',
          data: {
            myExpressData:myExpressData,
          },
          success: function() {
            if(that.data.detailpage){
              my.navigateTo({url:'../courierOrderDetail/courierOrderDetail'});
            }else{
              my.navigateTo({url:'../orderDetail/orderDetail'});
            }

          }
      });
      
  }

});
