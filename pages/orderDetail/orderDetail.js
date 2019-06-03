const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    currentTab: '0',
    text: '',
    tabs: [
      {
        name: "运单详情"
      },
      {
        name: "物流详情"
      }
    ],
    tabs2: [
      {
        name: "全部"
      },
      {
        name: "待接单"
      },
      {
        name: "已签收"
      }
    ]
  },
  onLoad() {
    let that = this;
    my.getStorage({
      key: 'myExpressData',
      success: function(res) {
        console.log(res.data)
        const datas = res.data.myExpressData;
        let status = datas.orderStatus;
        if (status == '0') {
          that.setData({
            cancelflag: true
          })
        } else {
          that.setData({
            cancelflag: false
          })
        }
        console.log(that.data.cancelflag)
        const senderProvinceCityCountyName = datas.senderProvinceCityCountyName.split('-').join('');
        const sendAddress = senderProvinceCityCountyName + datas.senderAddressDetail;
        const receiverProvinceCityCountyName = datas.receiverProvinceCityCountyName.split('-').join('');
        const receiveAddress = receiverProvinceCityCountyName + datas.receiverAddressDetail;
        datas.senderProvinceCityCountyNameall = sendAddress;
        datas.receiverProvinceCityCountyNameall = receiveAddress;
        let logisticsCompanyUuid = datas.logisticsCompanyUuid
        console.log(logisticsCompanyUuid)
        that.setData({
          logisticsNo: datas.logisticsNo,
        })
        if (logisticsCompanyUuid == 'deppon') {
          that.setData({
            companyimg: '../../image/deppon.png',
          })
        } else if (logisticsCompanyUuid == 'zto') {
          that.setData({
            companyimg: '../../image/zto.png',
          })
        } else if (logisticsCompanyUuid == 'zjs') {
          that.setData({
            companyimg: '../../image/zhaijisong.png',
          })
        } else {
          that.setData({
            companyimg: '../../image/logisticno.png'
          })
        }
        for (let key in datas) {
          // console.log(1)
          if (datas[key] == null) {
            datas[key] = '无'
          }
        }
        console.log(datas.goodsType)
        if (datas.goodsType == '0') {
          datas.goodsType = datas.goodsRemark;
        } else if (datas.goodsType == '1') {
          datas.goodsType = '日用品';
        } else if (datas.goodsType == '2') {
          datas.goodsType = '数码产品';
        } else if (datas.goodsType == '3') {
          datas.goodsType = '衣物';
        } else if (datas.goodsType == '4') {
          datas.goodsType = '食物';
        } else if (datas.goodsType == '5') {
          datas.goodsType = '文件';
        }

        if (datas.payType == '0') {
          datas.payType = '支付宝支付';
        } else if (datas.payType == '1') {
          datas.payType = '快递员代付';
        } else if (datas.payType == '2') {
          datas.payType = '支付宝我的快递支付';
        } else if (datas.payType == '无') {
          datas.payType = '未支付';
        }
        console.log(datas)
        if (datas.goodsWeight == '0.5') {
          datas.goodsWeight = '0.5公斤及以下'
        } else {
          datas.goodsWeight = datas.goodsWeight + '公斤';
        }
        that.setData({
          detaildata: datas
        })
        console.log(that.data.logisticsNo)
        console.log(that.data.detaildata)
        // that.setData({
        //     logisticsNo:'1093775419'
        //   })
        if (that.data.logisticsNo == null) {
          that.setData({
            show: true
          })
        } else {
          that.setData({
            show: false
          })
          let jsonData = {
            "object": that.data.logisticsNo
          };
          common.ajax('/route/getByLogisticsNo', jsonData,
            function(res) {
              console.log(res.headers)
              let headers = res.headers;
              let setcookie = headers["set-cookie"];
              common.sessionvalid(setcookie, function() {
                if (res.data.errCode == '000000') {
                  let logisticslist = res.data.object.routes;
                  let lastindex = res.data.object.routes.length - 1;
                  that.setData({
                    logisticslist: logisticslist,
                    lastindex: lastindex
                  })
                  console.log(that.data.lastindex)
                } else {
                  common.unLogin(res);
                }
              })

            }, function(res) {
              // that.setData({
              //   loadingflag:false
              // }) 
              my.alert({ content: '网络错误，请求失败' });
            })
          // my.httpRequest({          
          //   // url:'http://xilai.s1.natapp.cc/xilaireceiver_s/route/getByLogisticsNo',
          //   url:`${common.urlhead}/route/getByLogisticsNo`,
          //   headers:{
          //   'Content-Type':'application/json'
          //   },
          //   method: 'POST',
          //   data: JSON.stringify(jsonData),
          //   dataType: 'json',
          //   success: function(res) {
          //     if(res.data.errCode=='000000'){
          //       let logisticslist=res.data.object.routes;
          //       let lastindex=res.data.object.routes.length-1;
          //         that.setData({
          //         logisticslist:logisticslist,
          //         lastindex:lastindex
          //         })
          //         console.log(that.data.lastindex)
          //     }else{
          //       my.alert({content: res.data.errDesc});
          //     }
          //   },

          //   fail: function(res) {
          //       my.alert({content: '网络错误，获取失败'});
          //   }
          // });      
        }
      }
    });

    // 物流详情
  },
  tab(e) {
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id;
    const left = 375 * id;
    this.setData({
      left: left,
      currentTab: id
    })
  },
  copy() {
    this.setData({
      text: this.data.detaildata.logisticsNo
    })
    my.setClipboard({
      text: this.data.text,
      success: () => {
        my.showToast({
          type: 'success',
          content: '物流单号复制成功',
          duration: 1000
        })
      },
    });
  }
});
