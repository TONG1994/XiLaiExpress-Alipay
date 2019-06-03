const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    checkStatus: 'false',
    clickTag: 0,
    ruleclick: true,
    typeindex: 0,
    typeitem: '日用品',
    goodsvalue: '日用品',
    // weighthint:true,
    weightindex: '0',
    flag: false,
    goodsinputvalue:'',
    weightitem: '0.5',
    condition: false,
    Datelist: [{ day: '今天' }, { day: '明天' }, { day: '后天' }],
    Timelist: [
      '9:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00'
    ],
    bookedFromDateid: '0',
    bookedGoods:'0',
    typearray: ['日用品', '数码产品', '衣物', '食物', '文件', '其他'],
    inputshow:false,
    isAlipay:'0',//是否支付宝扫码下单
    // disabled:true,//checkbox是否禁用
    showDialog: false,//服务站选择弹出框
    showorgName:true,//显示选择服务站
    selectOrgStatus: true,//服务站是否被禁用
    orgArowShow: true,//服务站箭头显示
    selectOrgName:'暂无',
      tipfromhint:false,
      isRefresh:false,//是否页面刷新
    isFormRefresh: true,//是否寄件更新
  },
    onTopBtnTap() {
        this.setData({
            showDialog: !this.data.showDialog,
        });
    },
  onLoad(query) {
    // 页面加载,获取快递员信息

    //  my.alert({
    //   content:query.uuid
    // })
    let that = this;
    let uuid = query.uuid;
    that.setData({
      uuid: uuid
    })
    if (uuid) {
      let jsonData = {
        "object": uuid
      }
        that.setData({
            isAlipay: '1',
        })

      // 调用服务站接口判断是否停止服务，除了=2时调用接口查询快递员信息
      common.ajax2('/organization/getByCourierUuid', jsonData,
        function (res) {
            console.log(res);
          let headers = res.headers;
          let setcookie = headers["set-cookie"];
          common.sessionvalid(setcookie, function () {
            console.log(res.data.errCode);
            if (res.data.errCode == '000000') {
              if (res.data.object != 2) {
                that.setData({
                  loadingflag: true
                })
                common.ajax('/user/findCourierByUuid', jsonData,
                  function (res) {
                      console.log(res);
                    let headers = res.headers;
                    let setcookie = headers["set-cookie"];
                    common.sessionvalid(setcookie, function () {
                      // my.alert({
                      //     content:res.data.errCode
                      //   })
                      that.setData({
                        loadingflag: false
                      })
                      if (res.data.errCode == '000000') {
                         
                        let courierdata = res.data.object;
                          if (courierdata.holidayFlag == 0){  //快递员上班状态
                              if (courierdata.photo == '') {
                                  courierdata.photo = '../../image/courierimage.png'
                              }
                              let orgBaseInfoList = []; //如果有快递员信息，自动显示快递员服务站
                              let serviceItem = {}
                              serviceItem.orgUuid = courierdata.orgUuid;
                              serviceItem.orgName = courierdata.orgName;
                              serviceItem.orgNo = courierdata.orgNo;
                              orgBaseInfoList[0] = serviceItem;
                              that.setData({
                                  flag: true,
                                  courierdata: courierdata,
                                  phone: courierdata.phone,
                                  isAlipay:'1',
                                  tipfromhint:false,
                                  selectOrgName: courierdata.orgName,
                                  orgBaseInfoList: orgBaseInfoList,
                                  showorgName: false,
                              })
                          }else{
                              that.setData({
                                  flag: false,
                                  isAlipay: '0',
                                  showorgName: true,
                              })
                          }
                      } else {
                        common.unLogin(res);

                      }
                      // else if(res.data.errCode=='30071'||res.data.errCode=='30074'){
                      // }
                      // else{
                      //     that.setData({
                      //       loadingflag:false
                      //     })

                      // }
                    })

                  },
                  function (res) {
                    that.setData({
                      loadingflag: false
                    })
                  }
                )
              }
            } else {
              common.unLogin(res);
            }
          })
        },
        function (res) {
          that.setData({
            loadingflag: false
          })
        }
      )
    }else{
        that.setData({
            isAlipay: '0',
        })
    }


    let weightarray = ['0.5公斤及以下'];
    for (let i = 2; i < 61; i++) {

      if (i % 2 == 0) {
        weightarray.push(0.5 * i + '.0公斤')
      } else {
        weightarray.push(0.5 * i + '公斤')
      }
    }

    let hours = new Date().getHours();

    if (hours < 9) {
      that.setData({
        nowtimeindex: -1,
        bookedFromTimeid: 0
      })
      console.log('<9')
    } else if (hours >= 9 && hours < 11) {
      that.setData({
        nowtimeindex: 0,
        bookedFromTimeid: 1
      })
      console.log(0)
    } else if (hours >= 11 && hours < 13) {
      that.setData({
        nowtimeindex: 1,
        bookedFromTimeid: 2
      })
      console.log(1)
    } else if (hours >= 13 && hours < 15) {
      that.setData({
        nowtimeindex: 2,
        bookedFromTimeid: 3
      })
      console.log(2)
    } else if (hours >= 15 && hours < 17) {
      that.setData({
        nowtimeindex: 3,
        bookedFromTimeid: 4
      })
      console.log(3)
    } else {
      that.setData({
        nowtimeindex: 4,
        bookedFromTimeid: 5
      })
      console.log(4)
    }

    let bookedFromTimeid = this.data.bookedFromTimeid;
    var bookedFrom, bookedTo;
    if (bookedFromTimeid == 0) {
      bookedFrom = '09:00:00';
      bookedTo = '11:00:00';
    } else if (bookedFromTimeid == 1) {
      bookedFrom = '11:00:00';
      bookedTo = '13:00:00';
    } else if (bookedFromTimeid == 2) {
      bookedFrom = '13:00:00';
      bookedTo = '15:00:00';
    } else if (bookedFromTimeid == 3) {
      bookedFrom = '15:00:00';
      bookedTo = '17:00:00';
    } else if (bookedFromTimeid == 4) {
      bookedFrom = '17:00:00';
      bookedTo = '19:00:00';
    } else if (bookedFromTimeid == 5) {
      bookedFrom = '09:00:00';
      bookedTo = '11:00:00';
    }

    var bookedFromDate = common.formatDateTime(new Date());
    let Datelist = that.data.Datelist;
    console.log(new Date())
    for (let i = 0; i < Datelist.length; i++) {
      let nowDate = new Date();
      nowDate = nowDate.setDate(nowDate.getDate() + i)
      nowDate = new Date(nowDate)
      console.log(nowDate)
      Datelist[i].bookedFromDate = common.formatDateTime(nowDate);
    }
    that.setData({
      Datelist: Datelist,
    })
    console.log(Datelist)
    this.setData({
      weightarray: weightarray,
      bookedFromDate: bookedFromDate
    })
    var fulldatefromto;
    if (bookedFromTimeid == 5) {
      console.log(bookedFromTimeid == 5)
      let nowDate = new Date();
      nowDate = nowDate.setDate(nowDate.getDate() + 1)
      nowDate = new Date(nowDate)
      let bookedFromDate = common.formatDateTime(nowDate);
      this.setData({
        bookedFromDate: bookedFromDate,
        bookedFromDateid: 1
      })
      fulldatefromto = bookedFromDate + this.data.Timelist[0];
      console.log(fulldatefromto)
    } else {
      fulldatefromto = this.data.bookedFromDate + this.data.Timelist[this.data.bookedFromTimeid];
    }
    if (this.data.bookedFromDateid > 0) {
      this.setData({
        nowtimeindex: -1,
        bookedFromTimeid: 0,
      })
    }
    console.log(bookedFrom)
    let fulldatefrom = this.data.bookedFromDate + bookedFrom;
    let fulldateto = this.data.bookedFromDate + bookedTo;
    console.log(fulldatefrom);
    console.log(fulldateto)
    this.setData({
      fulldatefromto: fulldatefromto,
      bookedFrom: fulldatefrom,
      bookedTo: fulldateto
    })


  },
  chooseDate(e) {
    let id = e.currentTarget.dataset.id;
    let nowDate = new Date();
    nowDate = nowDate.setDate(nowDate.getDate() + id)
    nowDate = new Date(nowDate)
    let bookedFromDate = common.formatDateTime(nowDate);
    this.setData({
      bookedFromDate: bookedFromDate,
      bookedFromDateid: id
    })
    if (id > 0) {
      this.setData({
        nowtimeindex: -1,
        bookedFromTimeid: 0,
      })
    } else {
      let that = this;
      let hours = new Date().getHours();
      if (hours < 9) {
        that.setData({
          nowtimeindex: -1,
          bookedFromTimeid: 0
        })
        console.log('<9')
      } else if (hours >= 9 && hours < 11) {
        that.setData({
          nowtimeindex: 0,
          bookedFromTimeid: 1
        })
        console.log(0)
      } else if (hours >= 11 && hours < 13) {
        that.setData({
          nowtimeindex: 1,
          bookedFromTimeid: 2
        })
        console.log(1)
      } else if (hours >= 13 && hours < 15) {
        that.setData({
          nowtimeindex: 2,
          bookedFromTimeid: 3
        })
        console.log(2)
      } else if (hours >= 15 && hours < 17) {
        that.setData({
          nowtimeindex: 3,
          bookedFromTimeid: 4
        })
        console.log(3)
      } else {
        that.setData({
          nowtimeindex: 4,
          bookedFromTimeid: 5
        })
        console.log(4)
      }

      console.log(this.data.bookedFromTimeid)
    }

  },
  //选择物品类型
  chooseGoods(e){
    let goodsName = this.data.typearray[e.currentTarget.dataset.id];
    if (e.currentTarget.dataset.id==5){
      this.setData({
        bookedGoods: e.currentTarget.dataset.id,
        goodsName: goodsName,
        inputshow: true,
      })
    }else{
      this.setData({
        bookedGoods: e.currentTarget.dataset.id,
        goodsName: goodsName,
        inputshow: false,
      })
    }
  },
  //手动输入物品类型
  onidInput(e) {
    this.setData({
      goodsinputvalue: e.detail.value,
    })
  },
  //确定选择物品类型
  confirmGoods:function(){
    var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
        regEx = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    if (this.data.goodsName=='其他'){
      console.log(this.data.goodsinputvalue.length);
      if (this.data.goodsinputvalue.length == 0){
        my.showToast({
          content: '请输入物品类型',
          duration: 1000
        })
      } else if (regEn.test(this.data.goodsinputvalue) || regCn.test(this.data.goodsinputvalue) || regEx.test(this.data.goodsinputvalue)) {
        my.showToast({
          content: '物品类型不可有特殊字符',
          duration: 1000
        })
      }else{
        this.setData({
          goodsvalue: this.data.goodsinputvalue,
          conditionGoods: !this.data.conditionGoods,
        })
      }
    }else{
      this.setData({
        goodsvalue: this.data.goodsName,
        conditionGoods: !this.data.conditionGoods,
        goodsinputvalue: '',
      })
    }
  },
  chooseTime(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    this.setData({
      bookedFromTimeid: id
    })
  },
  confirm: function () {
    console.log(this.data.bookedFromDateid)
    console.log(this.data.bookedFromTimeid)
    if (this.data.bookedFromDateid == 0 && this.data.bookedFromTimeid == 5) {
      my.alert({
        content: '今日时间不可选，请选择明后天时间段'
      });
    } else {
      let bookedFromTimeid = this.data.bookedFromTimeid;
      var bookedFrom, bookedTo;
      if (bookedFromTimeid == 0) {
        bookedFrom = '09:00:00';
        bookedTo = '11:00:00';
      } else if (bookedFromTimeid == 1) {
        bookedFrom = '11:00:00';
        bookedTo = '13:00:00';
      } else if (bookedFromTimeid == 2) {
        bookedFrom = '13:00:00';
        bookedTo = '15:00:00';
      } else if (bookedFromTimeid == 3) {
        bookedFrom = '15:00:00';
        bookedTo = '17:00:00';
      } else if (bookedFromTimeid == 4) {
        bookedFrom = '17:00:00';
        bookedTo = '19:00:00';
      }

      let fulldatefromto = this.data.bookedFromDate + this.data.Timelist[this.data.bookedFromTimeid];
      let fulldatefrom = this.data.bookedFromDate + bookedFrom;
      let fulldateto = this.data.bookedFromDate + bookedTo;

      this.setData({
        fulldatefromto: fulldatefromto,
        bookedFrom: fulldatefrom,
        bookedTo: fulldateto
      })
      this.setData({
        // citydistrict:this.data.province+" "+this.data.city+" "+this.data.county,
        condition: !this.data.condition
      })
    }

  },
  cancel() {
    this.setData({
      condition: !this.data.condition
    })
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  //选择物品类型
  openGoods: function () {
    this.setData({
      conditionGoods: !this.data.conditionGoods
    })
  },
  callsender() {
    my.makePhoneCall({
      number: this.data.phone
    })
  },
  // bindtypePickerChange(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value);
  //   this.setData({
  //     typeindex: e.detail.value,
  //     typeitem: this.data.typearray[e.detail.value]
  //   });
  // },
  bindweightPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let weight = this.data.weightarray[e.detail.value]
    let weightitem = weight.split('公')[0];
    this.setData({
      weighthint: false,
      weightindex: e.detail.value,
      weightitem: weightitem
    });

  },
 
    
  onShow() {
    if(this.data.isRefresh){
      return
    }
    this.setData({
      ruleclick: true
    })
    const that = this;
    let fromAddressData;
    my.getStorage({
      key: 'fromAddress',
      success: function (res) {
        if (res.data) {
          const from = res.data.fromAddress;
          fromAddressData = from;
          const proviceCityRegionTxt = from.proviceCityRegionTxt.split('-').join('');
          const fromaddressDetail = proviceCityRegionTxt + from.addrDetail;
          from.fromaddressDetail = fromaddressDetail;
          that.setData({
            fromhint: false,
            fromAddress: from,
          })

          //寄数据
          let senderLocation = from.longitude + "," + from.latitude;
          console.log(senderLocation)


        // 201811月20日 判断寄件地址是否在服务站服务范围内
        let cityCode = from.proviceCityRegion.split('-');

        if (that.data.isAlipay == '1'){  //扫码下单不需判断寄件地址是否在服务站范围内
            let senderName = from.name,
                senderPhone = from.phone,
                senderProvinceCityCountyCode = from.proviceCityRegion,
                senderProvinceCityCountyName = from.proviceCityRegionTxt,
                senderAddressDetail = from.addrDetail
            that.setData({
                jsonsenddata: {
                    senderLocation: senderLocation,
                    senderName: senderName,
                    senderPhone: senderPhone,
                    senderProvinceCityCountyCode: senderProvinceCityCountyCode,
                    senderProvinceCityCountyName: senderProvinceCityCountyName,
                    senderAddressDetail: senderAddressDetail
                },
                tipfromhint: false,
            })
        } else {  // 不扫码下单需判断寄件地址是否在服务站范围内
            let newSenderAddressData = {
                "object": {
                    "longitude": from.longitude,
                    "latitude": from.latitude,
                    "addrDetail": from.addrDetail,
                    "cityCode": cityCode[1],
                    "isAlipay": "0"
                }
            }
            common.ajax('/user/senderAddressCheck', newSenderAddressData,
                function(res) {
                    if (res.data.errCode == '000000') {
                        if (res.data.object.length>0){ //有服务站
                            let selectOrg = res.data.object;
                            let orgBaseInfoList = [];
                            let serviceItem = {}
                            serviceItem.orgUuid = selectOrg[0].orgUuid;
                            serviceItem.orgName = selectOrg[0].orgName;
                            serviceItem.orgNo = selectOrg[0].orgNo;
                            orgBaseInfoList[0] = serviceItem;
                            let selectOrgName = selectOrg[0].orgName;
                            if (selectOrg.length < 2) { //只有一个服务站时显示默认
                                that.setData({
                                    // selectOrgName: selectOrgName,//显示第一个服务站名
                                    selectOrgStatus: true,//服务站不可以点击选择
                                    orgArowShow: true,//服务站箭头不显示
                                    // orgBaseInfoList: orgBaseInfoList,
                                });
                            } else {
                                that.setData({
                                    // selectOrgName: selectOrgName,
                                    selectOrgStatus: false,
                                    orgArowShow: false,
                                    // orgBaseInfoList: orgBaseInfoList,
                                })
                            }
                            if (that.data.isFormRefresh){
                              that.setData({
                                selectOrgName: selectOrgName,
                                orgBaseInfoList: orgBaseInfoList,
                              })
                            }
                            let senderName = from.name,
                                senderPhone = from.phone,
                                senderProvinceCityCountyCode = from.proviceCityRegion,
                                senderProvinceCityCountyName = from.proviceCityRegionTxt,
                                senderAddressDetail = from.addrDetail

                            that.setData({
                                jsonsenddata: {
                                    senderLocation: senderLocation,
                                    senderName: senderName,
                                    senderPhone: senderPhone,
                                    senderProvinceCityCountyCode: senderProvinceCityCountyCode,
                                    senderProvinceCityCountyName: senderProvinceCityCountyName,
                                    senderAddressDetail: senderAddressDetail,
                                },
                                tipfromhint: false,
                                selectOrg: res.data.object,
                                //disabled: false //checkbox不禁用
                            })
                        }else{ //没有服务站
                            that.setData({
                                tipfromhint: true,
                                selectOrgName: '暂无',
                                orgArowShow: true,
                                selectOrgStatus: true,
                                disabled: true //checkbox禁用
                            })
                        }
                    } else {
                        that.setData({
                            tipfromhint: true,
                            selectOrgName:'暂无',
                            orgArowShow:true,
                            selectOrgStatus:true,
                            disabled: true //checkbox禁用
                        })
                    }
                },
            )}
        } else {
          that.setData({
            fromhint: true,
          })
        }
      }
    });

    my.getStorage({
      key: 'desAddress',
      success: function (res) {
        if (res.data) {
          const des = res.data.desAddress;
          const proviceCityRegionTxt2 = des.proviceCityRegionTxt.split('-').join('');
          const desaddressDetail = proviceCityRegionTxt2 + des.addrDetail;
          des.desaddressDetail = desaddressDetail;
          that.setData({
            deshint: false,
            desAddress: des
          })
          // 201811月20日 判断寄件地址是否在服务站服务范围内
            let newReceiverAddressData={};
            if (fromAddressData) {
                let cityCode = fromAddressData.proviceCityRegion.split('-');
                let destinationCode = des.proviceCityRegion.split('-');
                newReceiverAddressData = {
                    "object": {
                        "longitude": fromAddressData.longitude,
                        "latitude": fromAddressData.latitude,
                        "addrDetail": fromAddressData.addrDetail,
                        "cityCode": cityCode[1],
                        "destinationCode": destinationCode[1],
                    }
                }
             }else{
                newReceiverAddressData = {
                    "object": {}
                }
             }
            common.ajax('/user/receiverAddressCheck', newReceiverAddressData,
                function(res) {
                    let myReceiverObj = res.data.object;
                    if (res.data.errCode == '000000') {
                        if (myReceiverObj == '1'){  //等于1时有运输方式
                            let receiverName = des.name,
                                receiverPhone = des.phone,
                                receiverProvinceCityCountyCode = des.proviceCityRegion,
                                receiverProvinceCityCountyName = des.proviceCityRegionTxt,
                                receiverAddressDetail = des.addrDetail

                            if (that.data.tipfromhint){
                                that.setData({
                                    disabled:true,
                                    tiptohint: false,
                                })
                            }else{
                                that.setData({
                                    jsonreceiverdata: {
                                        receiverName: receiverName,
                                        receiverPhone: receiverPhone,
                                        receiverProvinceCityCountyCode: receiverProvinceCityCountyCode,
                                        receiverProvinceCityCountyName: receiverProvinceCityCountyName,
                                        receiverAddressDetail: receiverAddressDetail
                                    },
                                    tiptohint: false,
                                    disabled: false,
                                    myReceiverObj: "1",
                                })
                            }
                        }else{ //等于0时没有运输方式
                            that.setData({
                                tiptohint: true,
                                disabled: true,//checkbox禁用
                                myReceiverObj: "0",
                            })
                        }
                    } else {
                        that.setData({
                            tiptohint: true,
                            disabled: true,
                            myReceiverObj: "0",
                        })
                    }
                    if (that.data.tipfromhint || that.data.tiptohint){
                        that.setData({
                            disabled: true,
                        })
                    } else{
                      that.setData({
                        disabled: false,
                      })
                    }
                },
            )
        } else {
          that.setData({
            deshint: true,
          })
        }
      }
    });

  },
    onChange() {
        if (this.data.checkStatus == 'false') {
            this.setData({
                checkStatus: 'true',
                agreementStatus: '1'
            })
        } else {
            this.setData({
                checkStatus: 'false',
                agreementStatus: '0'
            })
        }
    },
    chooseOrg(e) {
        let selectedOrg = this.data.selectOrg[e.currentTarget.dataset.id];
        let orgBaseInfoList = [];
        let serviceItem = {}
        serviceItem.orgUuid = selectedOrg.orgUuid;
        serviceItem.orgName = selectedOrg.orgName;
        serviceItem.orgNo = selectedOrg.orgNo;
        orgBaseInfoList[0] = serviceItem;
        this.setData({
            selectedOrg: selectedOrg,
            selectOrgName: selectedOrg.orgName,
            showDialog: !this.data.showDialog,
            orgBaseInfoList: orgBaseInfoList,
        })
    },
  sendExpress() {
    let that = this;
    if (this.data.clickTag === 0) {
      this.setData({
        clickTag: 1
      })
      setTimeout(function () {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      // 验证


      if (that.data.fromhint || that.data.deshint) {
        my.alert({ content: '请您选择地址哦' });
      }else {
        that.setData({
          loadingflag: true,
          ruleclick: false
        })

        //合并下单数据
        let json = {};

        const jsonsenddata = that.data.jsonsenddata;
        const jsonreceiverdata = that.data.jsonreceiverdata;
        const checked = that.data.checkStatus ? '1' : '0';

        // 物品类型，重量，下单时间
        var goodsType,goodsRemark;
        if (that.data.goodsvalue == '日用品') {
          goodsType = '1'
        } else if (that.data.goodsvalue == '数码产品') {
          goodsType = '2'
        } else if (that.data.goodsvalue == '衣物') {
          goodsType = '3'
        } else if (that.data.goodsvalue == '食物') {
          goodsType = '4'
        } else if (that.data.goodsvalue == '文件') {
          goodsType = '5'
        } else{
          goodsType = '0';
          goodsRemark = that.data.goodsvalue;
        }
        json.goodsType = goodsType;
        json.goodsRemark = goodsRemark;
        json.goodsWeight = that.data.weightitem;
        json.isSelectService = "1";

        //判断是否有运输方式 服务站的信息
        if (that.data.myReceiverObj== "1"){  //有运输方式
            if (!that.data.tipfromhint){ //寄件地址有服务站
                if (that.data.orgBaseInfoList) {
                    json.orgBaseInfoList = that.data.orgBaseInfoList;
                }
            } else { //寄件地址没有服务站
                let orgBaseInfoList = [];
                let serviceItem = {}
                serviceItem.orgName = "暂无";
                orgBaseInfoList[0] = serviceItem;
                json.orgBaseInfoList = orgBaseInfoList;
            }
        } else if(that.data.myReceiverObj == "0"){ //没有运输方式
            let isCanOrder = "0";
            json.isCanOrder = isCanOrder;
            if (that.data.orgBaseInfoList) {
                delete that.data.orgBaseInfoList[0].orgUuid;
                that.data.orgBaseInfoList[0].orgName = '暂无';
                delete that.data.orgBaseInfoList[0].orgNo;
                json.orgBaseInfoList = that.data.orgBaseInfoList;
            }else{
                let orgBaseInfoList = [];
                let serviceItem = {}
                serviceItem.orgName = "暂无";
                orgBaseInfoList[0] = serviceItem;
                json.orgBaseInfoList = orgBaseInfoList;
            }
        }
        //有快递员的信息
        if (that.data.courierdata) {
          const courierdata = that.data.courierdata;
          json.photo = courierdata.photo;
          json.orgUuid = courierdata.orgUuid;
          json.orgName = courierdata.orgName;
          json.orgNo = courierdata.orgNo;
          json.courierUuid = that.data.uuid;
          json.courierNo = courierdata.userCode;
          json.courierName = courierdata.userName;
        }


        json.agreementStatus = checked;
        json.orderSource = '3';
        for (let attr in jsonsenddata) {
          json[attr] = jsonsenddata[attr];
        }
        for (let attr in jsonreceiverdata) {
          json[attr] = jsonreceiverdata[attr];
        }

        json.bookedFrom = that.data.bookedFrom;
        json.bookedTo = that.data.bookedTo;
        let jsonData = {
          "object": json
        };
        common.ajax('/order/senderOrder', jsonData,
          function (res) {
            that.setData({
              loadingflag: false
            })
            let headers = res.headers;
            let setcookie = headers["set-cookie"];
            common.sessionvalid(setcookie, function () {
              if (res.data.errCode == '000000') {
                let myExpressData = res.data.object;
                my.setStorage({
                  key: 'myExpressData',
                  data: {
                    myExpressData: myExpressData,
                  },
                  success: function () {
                    my.showToast({
                      type: 'none',
                      content: '下单成功',
                      duration: 1000,
                      success: () => {
                        // 删除地址记录
                        my.removeStorage({
                          key: 'fromAddress',
                          success: function () {
                            my.removeStorage({
                              key: 'desAddress',
                              success: function () {
                                my.redirectTo({ url: '../myExpress/myExpress' });
                              }
                            });
                          }
                        });
                      },
                    });

                  }
                });

              } else {
                common.unLogin(res);
              }
            })

          }, function (res) {
            that.setData({
              loadingflag: false
            })
            my.alert({ content: '网络错误，下单失败' });
          })
      }
    }
    else {
      my.alert({ content: '请勿频繁点击！' });
    }


  },
  jiaddress() {
    this.setData({
      isRefresh: false,
      tipfromhint: false,
      isFormRefresh:true,
    })
    my.navigateTo({ url: '../myAddress/myAddress?index=2&getAliAddress=1' });

  },
  shouaddress() {
    this.setData({
      isRefresh: false,
      tipfromhint: false,
      isFormRefresh: false,
    })
    my.navigateTo({ url: '../myAddress/myAddress?index=1&getAliAddress=1' });
  },
  rule() {
    this.setData({
      isRefresh: true
    })
    my.navigateTo({ url: '../rule/rule' });
  },
  imgerror() {
    let data = this.data.courierdata;
    data.photo = '../../image/courierimage.png'
    this.setData({
      courierdata: data
    })
  }
});
