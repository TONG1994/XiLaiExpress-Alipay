const tcity = require("../../utils/areajson.js");
const common = require("../../common/common.js");
const regular = require("../../utils/regular.js");
const app = getApp();
Page({
  data: {
    provinces: [],
    province: "北京市",
    citys: [],
    city: "北京城区",
    countys: [],
    county: '怀柔区',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    clickTag: 0,
    textareaTag: true,
    sendlocation: '',
    sendlocation1: '',
  },
  onLoad(options) {
    let that = this;
    my.showLoading({
      content: '加载中',
    })
    my.getStorage({
      key: 'editAddress',
      success: function(res) {
        let editAddressdatas = res.data.editAddress;
        let uuid = editAddressdatas.uuid,
          name = editAddressdatas.name,
          phone = editAddressdatas.phone,
          addrDetail = editAddressdatas.addrDetail,
          proviceCityRegionTxt = editAddressdatas.proviceCityRegionTxt,
          proviceCityRegion = editAddressdatas.done_proviceCityRegionTxt,
          citydistrict = editAddressdatas.proviceCityRegionTxt.split('-').join(' '),
          addrType = editAddressdatas.addrType,
          longitude = editAddressdatas.longitude,
          latitude = editAddressdatas.latitude;
        that.setData({
          uuid: uuid,
          address_name: name,
          address_phone: phone,
          srlocation: addrDetail,
          proviceCityRegion: proviceCityRegion,
          citydistrict: citydistrict,
          proviceCityRegionTxt: proviceCityRegionTxt,
          addrType: addrType,
          longitude: longitude,
          latitude: latitude,
        })
      },
      complete: function() {
      }
    });
    that.setData({
      userName: options.userName,
    })
    tcity.init(that);
    let cityData = that.data.cityData;
    let provinces = [];
    let citys = [];
    let countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].label);
    }
    for (let i = 0; i < cityData[0].children.length; i++) {
      citys.push(cityData[0].children[i].label)
    }
    for (let i = 0; i < cityData[0].children[0].children.length; i++) {
      countys.push(cityData[0].children[0].children[i].label)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys
    })

  },
  onShow() {
    my.hideLoading();
  },
  //所在地区 选择框
  open() {
    this.setData({
      condition: !this.data.condition
    })
    setTimeout(() => {
      this.setData({
        textareaTag: false
      })
    }, 200)
  },
  cancel() {
    this.setData({
      condition: !this.data.condition,
      textareaTag: true
    })
  },
  confirm() {
    this.setData({
      citydistrict: this.data.province + " " + this.data.city + " " + this.data.county,
      condition: !this.data.condition,
      textareaTag: true
    })
  },
  bindChange(e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      console.log('province no ');
      let citys = [];
      let countys = [];
      if (cityData[val[0]].children != undefined || cityData[val[0]].children != null) {
        for (let i = 0; i < cityData[val[0]].children.length; i++) {
          citys.push(cityData[val[0]].children[i].label)
        }
        if (cityData[val[0]].children[0].children != undefined || cityData[val[0]].children[0].children != null) {
          for (let i = 0; i < cityData[val[0]].children[0].children.length; i++) {
            countys.push(cityData[val[0]].children[0].children[i].label)
          }
          this.setData({
            province: this.data.provinces[val[0]],
            city: cityData[val[0]].children[0].label,
            citys: citys,
            county: cityData[val[0]].children[0].children[0].label,
            countys: countys,
            values: val,
            value: [val[0], 0, 0]
          })
          return;
        } else {
          //香港澳门数据只有省和市，置空后面的数据
          this.setData({
            province: this.data.provinces[val[0]],
            city: cityData[val[0]].children[0].label,
            citys: citys,
            county: '',
            countys: '',
            values: val,
            value: [val[0], 0, 0]
          })
          return;
        }
      } else {
        //台湾数据只有省，置空后面的数据
        this.setData({
          province: this.data.provinces[val[0]],
          city: '',
          citys: '',
          county: '',
          countys: '',
          values: val,
          value: [val[0], 0, 0]
        })
        return;
      }
    }
    if (val[1] != t[1]) {
      console.log('city no');
      let countys = [];
      if (cityData[val[0]].children[val[1]].children != undefined || cityData[val[0]].children[val[1]].children != null) {
        for (let i = 0; i < cityData[val[0]].children[val[1]].children.length; i++) {
          countys.push(cityData[val[0]].children[val[1]].children[i].label)
        }
        this.setData({
          city: this.data.citys[val[1]],
          county: cityData[val[0]].children[val[1]].children[0].label,
          countys: countys,
          values: val,
          value: [val[0], val[1], 0]
        })
        return;
      } else {
        //香港澳门
        this.setData({
          city: this.data.citys[val[1]],
          county: '',
          countys: '',
          values: val,
          value: [val[0], val[1], 0]
        })
        return;
      }
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  radiofromclick() {
    this.setData({
      addrType: 2
    })
    console.log(this.data.addrType)
  },
  radiodesclick() {
    this.setData({
      addrType: 1
    })
    console.log(this.data.addrType)
  },
  //姓名输入
  nameInput(e) {
    this.setData({
      address_name: e.detail.value,
    })
  },
  //联系方式输入
  phoneInput(e) {
    let test = regular.clipboardNumber(e.detail.value)
    console.log(test);
    this.setData({
      address_phone: test,
    })
  },
  //详细地址输入
  addressInput(e) {
    this.setData({
      srlocation: e.detail.value,
    })
  },
  // 收/发件保存
  saveaddress() {
    let that = this;
    if (this.data.clickTag === 0) {
      //改成显示提示框
      my.showLoading({
        content: '加载中',
      })
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      //判断用户输入的内容
      //姓名
      if (this.data.address_name != undefined &&
        this.data.address_name != '' &&
        //电话
        this.data.address_phone != undefined &&
        this.data.address_phone != '' &&
        //所在区域
        this.data.citydistrict != undefined &&
        this.data.citydistrict != '' &&
        //收/发件详细地址
        this.data.srlocation != undefined &&
        this.data.srlocation != '') {
        //判断电话类型
        let phone_first = this.data.address_phone.slice(0, 1);
        let phone_length = this.data.address_phone.length;
        var getphone = this.data.address_phone
        var regularphone = regular.isValid('Phone', getphone);
        if (phone_first !== "1") {
          if (!(phone_length >= 4 && phone_length <= 12)) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        } else if (phone_first === "1") {
          if (phone_length !== 11) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        }
        let done_addressAreaTest = this.data.citydistrict.split(" ")
        if (done_addressAreaTest[1] == "" || done_addressAreaTest[1] == undefined || done_addressAreaTest[1] == null) {
          //台湾
          const done_address = this.data.citydistrict.split(" ").join("");
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0],
            proviceCityRegion: done_address
          })

        } else if (done_addressAreaTest[2] == "" || done_addressAreaTest[2] == undefined || done_addressAreaTest[2] == null) {
          //香港澳门-xxx
          const done_address = this.data.citydistrict.split(" ").join("");
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0] + "-" + done_addressAreaTest[1],
            proviceCityRegion: done_address
          })

        } else {
          //正常情况xxx-xxx-xxx
          const done_addressArea = this.data.citydistrict.split(" ").join("-");
          const done_address = this.data.citydistrict.split(" ").join("");

          // proviceCityRegionTxt 江苏-无锡-新吴区
          // proviceCityRegion 江苏无锡新吴区
          that.setData({
            proviceCityRegionTxt: done_addressArea,
            proviceCityRegion: done_address
          })
        }
        //整合详细地址字符串
        var location = this.data.proviceCityRegion + this.data.srlocation;
        var key = "38782d2bc8e5e42e210eb8013e17836a";
        var url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${location}&city=`;
        my.httpRequest({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function(res) {
            if (res.data.geocodes.length != 0) {
              let geocodes = res.data.geocodes[0];
              let locationarray = geocodes.location.split(',');
              that.setData({
                longitude: locationarray[0],
                latitude: locationarray[1],
              })
            }
            let jsonData = {
              "object": {
                "uuid": that.data.uuid,
                "name": that.data.address_name,
                "phone": that.data.address_phone,
                "addrDetail": that.data.srlocation,
                "proviceCityRegionTxt": that.data.proviceCityRegionTxt,
                "addrType": that.data.addrType,
                "longitude": that.data.longitude,
                "latitude": that.data.latitude,
                "addUserType": "1",
                "addUserPhone": that.data.userName,
              }
            }
            common.ajax('/addressBook/update', jsonData,
              function(res) {
                my.hideLoading()
                let header = res.headers;
                let setcookie = header["set-cookie"];
                common.sessionvalid(setcookie, function() {
                  if (res.data.errCode == '000000') {
                    my.showToast({
                      type: 'none',
                      content: '编辑成功',
                      duration: 1000,
                      success: () => {
                        my.navigateBack({
                          delta: 1
                        })
                      }
                    })
                  } else {
                    my.showToast({
                      type: 'none',
                      content: res.data.errDesc,
                      duration: 1000
                    })
                  }
                })

              },
              function(res) {
                my.hideLoading()
                my.showToast({
                  type: 'none',
                  content: res.errorMessage,
                  duration: 1000
                })
              })
          },
          fail: function(res) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: 'fail',
              duration: 1000
            })
          },
        });
      } else {
        my.hideLoading()
        my.showToast({
          type: 'none',
          content: '请把地址填写完整哦',
          duration: 1000
        })
      }
    } else {
      my.showToast({
        type: 'none',
        content: '请勿频繁点击！',
        duration: 1000
      })
    }
  },







  saveaddressReceipt() {
    let that = this;

    if (this.data.clickTag === 0) {
      my.showLoading({
        content: '加载中',
      })
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      console.log(this.data.address_name)

      function savedata() {
        //新增地址

      }
      //判断用户输入的内容
      if (this.data.address_name != undefined && this.data.address_phone != undefined && this.data.citydistrict != undefined && this.data.address_detail != undefined && this.data.address_name != '' && this.data.address_phone != '' && this.data.citydistrict != '' && this.data.address_detail != '') {
        //判断电话类型
        let phone_first = this.data.address_phone.slice(0, 1);
        let phone_length = this.data.address_phone.length;
        var getphone = this.data.address_phone
        var regularphone = regular.isValid('Phone', getphone);
        if (phone_first !== "1") {
          if (!(phone_length >= 4 && phone_length <= 12)) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        }
        if (phone_first === "1") {
          if (phone_length !== 11) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        }

        let done_addressAreaTest = this.data.citydistrict.split(" ")
        if (done_addressAreaTest[1] == "" || done_addressAreaTest[1] == undefined || done_addressAreaTest[1] == null) {
          //台湾
          let done_address = this.data.citydistrict.split(" ").join("");
          // proviceCityRegionTxt 江苏-无锡-新吴区
          // proviceCityRegion    江苏无锡新吴区
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0],
            proviceCityRegion: done_address
          })

        } else if (done_addressAreaTest[2] == "" || done_addressAreaTest[2] == undefined || done_addressAreaTest[2] == null) {
          //香港澳门-xxx
          let done_address = this.data.citydistrict.split(" ").join("");
          // proviceCityRegionTxt 江苏-无锡-新吴区
          // proviceCityRegion    江苏无锡新吴区
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0] + "-" + done_addressAreaTest[1],
            proviceCityRegion: done_address
          })

        } else {
          //正常情况xxx-xxx-xxx
          let done_addressArea = this.data.citydistrict.split(" ").join("-");
          let done_address = this.data.citydistrict.split(" ").join("");

          // proviceCityRegionTxt 江苏-无锡-新吴区
          // proviceCityRegion    江苏无锡新吴区
          that.setData({
            proviceCityRegionTxt: done_addressArea,
            proviceCityRegion: done_address
          })

        }
        this.setData({
          loadingflag: true
        })
        //如果location                  
        console.log(that.data.longitude)
        if (that.data.longitude == undefined && that.data.latitude == undefined) {
          console.log(this.data.proviceCityRegion);
          console.log(this.data.address_detail)
          if (this.data.proviceCityRegion !== '' && this.data.proviceCityRegion !== 'undefined' && this.data.address_detail !== "undefined" && this.data.address_detail !== "") {
            let addressAll_text = this.data.proviceCityRegion + this.data.address_detail
            let key = "38782d2bc8e5e42e210eb8013e17836a";
            let url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${addressAll_text}&city=`;
            my.httpRequest({
              url: url,
              method: 'GET',
              dataType: 'json',
              success: function(res) {
                if (res.data.geocodes.length != 0) {
                  let geocodes = res.data.geocodes[0];
                  let locationarray = geocodes.location.split(',');
                  that.setData({
                    longitude: locationarray[0],
                    latitude: locationarray[1],
                  })
                }
                let that = this;
                let jsonData = {
                  "object": {
                    "uuid": that.data.uuid,
                    "name": that.data.address_name,
                    "phone": that.data.address_phone,
                    "addrDetail": that.data.address_detail,
                    "proviceCityRegionTxt": that.data.proviceCityRegionTxt,
                    "addrType": that.data.addrType,
                    "longitude": that.data.longitude,
                    "latitude": that.data.latitude,
                    "addUserType": "1",
                    // "addUserName": "陈平",
                    "addUserPhone": that.data.userName,
                    // "addUserPhone": userName,
                  }
                }
                // console.log(JSON.stringify(jsonData));

                common.ajax('/addressBook/update', jsonData,

                  function(res) {
                    my.hideLoading()
                    that.setData({
                      loadingflag: false
                    })
                    let header = res.header;
                    let setcookie = header["set-cookie"];
                    common.sessionvalid(setcookie, function() {
                      if (res.data.errCode == '000000') {
                        //编辑成功 
                        my.showToast({
                          type: 'none',
                          content: '编辑成功',
                          duration: 1000,
                          success: () => {
                            my.navigateBack({
                              delta: 1
                            })
                          }
                        })

                      } else {
                        my.showToast({
                          type: 'none',
                          content: res.data.errDesc,
                          duration: 1000
                        })
                      }
                    })

                  },
                  function(res) {
                    my.hideLoading()
                    my.showToast({
                      type: 'none',
                      content: res.errorMessage,
                      duration: 1000
                    })
                  })
              },
              fail: function(res) {
                my.hideLoading()
                my.showToast({
                  type: 'none',
                  content: 'fail',
                  duration: 1000
                })
              },
              complete: function() {
                that.setData({
                  loadingflag: false
                })
              }
            });
          }
        } else {
          let that = this;
          let jsonData = {
            "object": {
              "uuid": that.data.uuid,
              "name": that.data.address_name,
              "phone": that.data.address_phone,
              "addrDetail": that.data.address_detail,
              "proviceCityRegionTxt": that.data.proviceCityRegionTxt,
              "addrType": that.data.addrType,
              "longitude": that.data.longitude,
              "latitude": that.data.latitude,
              "addUserType": "1",
              "addUserName": "陈平",
              "addUserPhone": that.data.userName,
              // "addUserPhone": userName,
            }
          }
          console.log(JSON.stringify(jsonData));
          common.ajax('/addressBook/update', jsonData,
            function(res) {
              that.setData({
                loadingflag: false
              })
              let header = res.headers;
              let setcookie = header["set-cookie"];
              common.sessionvalid(setcookie, function() {
                my.hideLoading()
                if (res.data.errCode == '000000') {
                  //编辑成功
                  my.showToast({
                    type: 'none',
                    content: '编辑成功',
                    duration: 1000,
                    success: () => {
                      my.navigateBack({
                        delta: 1
                      })
                    },
                  });

                } else {
                  my.showToast({
                    type: 'none',
                    content: res.data.errDesc,
                    duration: 1000
                  })
                }
              })

            },
            function(res) {
              my.hideLoading()
              my.showToast({
                type: 'none',
                content: res.errorMessage,
                duration: 1000
              })
            })
        }
        // if获取到location后请求

      } else {
        my.hideLoading()
        my.showToast({
          type: 'none',
          content: '请把地址填写完整哦',
          duration: 1000
        })
      }
    } else {
      my.showToast({
        type: 'none',
        content: '请勿频繁点击！',
        duration: 1000
      })
    }

  },
  //发件
  chooseLocation() {
    my.navigateTo({ url: "../location/location" });
  },
  saveaddressSend() {
    //用户保存操作
    let that = this;
    //计时器，确保用户不要多次点击
    if (this.data.clickTag === 0) {
      my.showLoading({
        content: '加载中',
      })
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      //判断用户输入的内容
      if (this.data.address_name != undefined && this.data.address_phone != undefined && this.data.sendlocation != undefined && this.data.sendlocation1 != undefined && this.data.address_name != '' && this.data.address_phone != '' && this.data.sendlocation != '' && this.data.sendlocation1 != '') {
        //判断电话类型
        let phone_first = this.data.address_phone.slice(0, 1);
        let phone_length = this.data.address_phone.length;
        var getphone = this.data.address_phone
        var regularphone = regular.isValid('Phone', getphone);
        if (phone_first !== "1") {
          if (!(phone_length >= 4 && phone_length <= 12)) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        } else if (phone_first === "1") {
          if (phone_length !== 11) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        } else {
          my.hideLoading()
          my.showToast({
            type: 'none',
            content: "请填写正确的手机号",
            duration: 1000
          });
          return false;
        }
        //整合详细地址字符串
        var location = this.data.sendlocation + this.data.sendlocation1;
        var key = "38782d2bc8e5e42e210eb8013e17836a";
        var url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${location}&city=`;
        my.httpRequest({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function(res) {
            console.log(res)
            //找到地点
            if (res.data.geocodes.length != 0) {
              let geocodes = res.data.geocodes[0];
              let locationarray = geocodes.location.split(',');
              let citydistrict = `${geocodes.province} ${geocodes.city} ${geocodes.district}`;
              console.log("locationarray")
              console.log(locationarray)
              that.setData({
                longitude: locationarray[0],
                latitude: locationarray[1],
                citydistrict: citydistrict
              })
              var proviceCityRegionTxt = that.data.citydistrict.split(" ").join("-");
              var district = geocodes.district;
              var detail = that.data.sendlocation.split(district);
              console.log(detail);
              var address_detail = detail[1] + that.data.sendlocation1;

              let jsonData = {
                "object": {
                  "uuid": that.data.uuid,
                  "name": that.data.address_name,
                  "phone": that.data.address_phone,
                  "addrDetail": address_detail,
                  "proviceCityRegionTxt": proviceCityRegionTxt,
                  "addrType": that.data.addrType,
                  "longitude": that.data.longitude,
                  "latitude": that.data.latitude,
                  "addUserType": "1",
                  "addUserPhone": that.data.userName,
                  "active": "1"
                }
              }
              console.log(jsonData)

              common.ajax('/addressBook/update', jsonData,
                function(res) {
                  my.hideLoading()
                  let header = res.headers;
                  let setcookie = header["set-cookie"];
                  common.sessionvalid(setcookie, function() {
                    if (res.data.errCode == '000000') {

                      my.showToast({
                        type: 'none',
                        content: '编辑成功',
                        duration: 1000,
                        success: () => {
                          my.navigateBack({
                            delta: 1
                          })
                        }
                      })
                    } else {
                      console.log(res.data);
                      my.showToast({
                        type: 'none',
                        content: res.data.errDesc,
                        duration: 1000
                      })
                    }
                  })
                },
                function(res) {
                  my.hideLoading()
                  my.showToast({
                    type: 'none',
                    content: res.errorMessage,
                    duration: 1000
                  })
                })
            }
          },
          fail(res) {
            my.hideLoading()
            my.showToast({
              type: 'none',
              content: 'fail',
              duration: 1000
            })
          },
          complete() {
            that.setData({
              loadingflag: false
            })
          }
        });
      } else {
        my.hideLoading()
        my.showToast({
          type: 'none',
          content: '请把地址填写完整哦',
          duration: 1000
        })
      }
    } else {
      my.showToast({
        type: 'none',
        content: '请勿频繁点击！',
        duration: 1000
      })
    }
  },

});
