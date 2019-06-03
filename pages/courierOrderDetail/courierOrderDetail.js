const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {

  },
  onLoad() {
    let that = this;
    my.getStorage({
      key: 'myExpressData',
      success: function (res) {
        console.log(res.data)
        const datas = res.data.myExpressData;

        let status = datas.orderStatus;
        let courierUuid = datas.courierUuid;

        if (courierUuid) {
          that.setData({
            loadingflag: true
          })
          let jsonData = {
            "object": courierUuid
          }
          common.ajax('/user/findCourierByUuid', jsonData,
            function (res) {
              that.setData({
                loadingflag: false
              })
              // console.log('请求发出')
              let headers = res.headers;
              let setcookie = headers["set-cookie"];
              common.sessionvalid(setcookie, function () {
                // console.log('000之前');
                if (res.data.errCode == '000000') {
                  console.log(res.data.object)
                  let courierdata = res.data.object;

                  if (courierdata.photo == '') {
                    courierdata.photo = '../../image/courierimage.png'
                  }
                  that.setData({
                    courierdata: courierdata,
                    phone: courierdata.phone
                  })
                }
              })

            }, function (res) {
            })
        }

        let goodsWeight = datas.goodsWeight;

        if (datas.bookedFrom != null) {
          let bookedFrom = datas.bookedFrom;
          let bookeddate = bookedFrom.split(' ')[0];
          let bookedtime = bookedFrom.split(' ')[1].split(':')[0];
          let bookedFromto = `${bookeddate} ${bookedtime}:00-${Number(bookedtime) + 2}:00`;
          datas.bookedFromto = bookedFromto;
        } else {
          datas.bookedFromto = '无'
        }
        let fromtext = datas.senderProvinceCityCountyName.split('-').join('');
        let fromaddressDetail = fromtext + datas.senderAddressDetail;
        let totext = datas.receiverProvinceCityCountyName.split('-').join('');
        let toaddressDetail = totext + datas.receiverAddressDetail;
          datas.from = fromaddressDetail;
        
          datas.to = toaddressDetail;
        
        if (goodsWeight == '0.5') {
          datas.goodsWeight = '0.5公斤及以下'
        } else {
          datas.goodsWeight = goodsWeight + '公斤'
        }
        if (datas.goodsType == '1') {
          datas.goodsType = '日用品'
        } else if (datas.goodsType == '2') {
          datas.goodsType = '数码产品'
        } else if (datas.goodsType == '3') {
          datas.goodsType = '衣物'
        } else if (datas.goodsType == '4') {
          datas.goodsType = '食物'
        } else if (datas.goodsType == '5') {
          datas.goodsType = '文件'
        } else if (datas.goodsType == '0') {
          datas.goodsType = datas.goodsRemark;
        }
        console.log(datas.goodsType)

        if (status == '0') {
          that.setData({
            cancelflag: true
          })
        } else {
          that.setData({
            cancelflag: false
          })
        }
        that.setData({
          detaildata: datas
        })
      }
    })

  },
  callsender() {
    my.makePhoneCall({
      number: this.data.phone
    })
  },
  cancelExpress() {
    let that = this;
    //取消订单
    my.showActionSheet({
      title: '请选择取消原因',
      items: ['不想发了', '其他原因'],
      cancelButtonText: '取消',
      success: (res) => {
        if (res.index == 0) {
          var cancelreason = '不想发了'
        } else {
          var cancelreason = '其他原因'
        }
        if (res.index == 0 || res.index == 1) {
          that.setData({
            loadingflag: true
          })
          let jsonData = {
            "object": {
              "uuid": this.data.detaildata.uuid,
              "orderCancelRemark": cancelreason
            }
          };
          console.log(JSON.stringify(jsonData));
          common.ajax('/order/userCancelOrder', jsonData,
            function (res) {
              that.setData({
                loadingflag: false
              })
              console.log(res.headers)
              let headers = res.headers;
              let setcookie = headers["Set-Cookie"];
              common.sessionvalid(setcookie, function () {
                if (res.data.errCode == '000000') {
                  my.showToast({
                    type: 'none',
                    content: '取消成功',
                    duration: 1000,
                    success: () => {
                      my.navigateBack({
                        delta: 1
                      })
                    },
                  });
                } else {
                  common.unLogin(res);
                }
              })

            }, function (res) {
              that.setData({
                loadingflag: false
              })
              my.alert({ content: '网络错误，取消失败' });
            })
        }
      },
    });
  },
  imgerror() {
    let data = this.data.courierdata;
    data.photo = '../../image/courierimage.png'
    this.setData({
      courierdata: data
    })
  }
});
