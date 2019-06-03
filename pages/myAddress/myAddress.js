const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    currentTab: '0',
    show: false,
    addrType: '',
    zhifubao: false,
    translate: true,
    opacity: true,
    scrollHeight: '',
    tabs: [
      {
        name: "全部"
      },
      {
        name: "收件"
      },
      {
        name: "发件"
      }
    ]
  },
  setaddress(e) {
    if (this.data.fromindex == '2') {
      let fromAddress = this.data.list[e.currentTarget.dataset.id];
      my.setStorage({
        key: 'fromAddress',
        data: {
          fromAddress: fromAddress,
        }
      });
      my.navigateBack({
        delta: 1
      })
    } else if (this.data.fromindex == '1') {
      let desAddress = this.data.list[e.currentTarget.dataset.id];
      my.setStorage({
        key: 'desAddress',
        data: {
          desAddress: desAddress,
        }
      });
      my.navigateBack({
        delta: 1
      })
    }

  },
  manage() {
    if (!this.data.show) {
      this.setData({
        show: true,
        active: 'active'
      })
    } else {
      this.setData({
        show: false,
        active: ''
      })
    }

  },

  onLoad(query) {
    let that = this
    //判断从发件或者收件进入地址tab
    let id = query.index;
    let getAliAddress = query.getAliAddress;
    const left = 250 * id;
    this.setData({
      left: left,
      currentTab: id,
      fromindex: id,
      loadingflag: true,
      noaddress: false,
      getAliAddress: getAliAddress
    })
    my.setStorage({
      key: 'addressType', // 缓存数据的key
      data: '1', // 要缓存的数据

    });
    // if (getAliAddress == 1) {
    //   my.getStorage({
    //     key: 'isfirstget',
    //     success(res) {
    //       if (res.data == null || res.data == undefined) {
    //         my.confirm({
    //           content: '是否获取支付宝的收件地址',
    //           confirmButtonText: '立即获取',
    //           cancelButtonText: '还是算了',
    //           success: (result) => {
    //             //同意
    //             if (result.confirm) {
    //               my.setStorage({
    //                 key: 'isfirstget',
    //                 data: '1',
    //                 success(res) {
    //                 }
    //               })
    //               that.getAuthCode(getAliAddress)
    //             }
    //           }
    //         })

    //       } else {
    //         // that.getAuthCode(getAliAddress)
    //       }
    //     }, fail(res) {
    //     }
    //   })
    // }
  },
  onReady() {
    this.getScrollViweHeight();

  },
  getScrollViweHeight() {
    let that = this;
    my.createSelectorQuery()
      .select('.scroll').boundingClientRect().exec((ret) => {
        console.log(JSON.stringify(ret, null, 2));
        my.getSystemInfo({
          success: function (res) {
            that.setData({
              scrollheight: res.windowHeight - Math.ceil(ret[0].top)
            })
          }
        })
      });
  },
  // 动画开关
  flage() {
    this.setData({
      zhifubao: true
    })
    setTimeout(() => {
      this.setData({
        zhifubao: false
      })
    }, 2000)
  },
  onShow() {
    this.setData({
      noaddress: false,
      loadingflag: true
    })
    let that = this;
    if (that.data.currentTab == '1') {
      this.setData({
        addrType: 2
      })
    } else if (that.data.currentTab == '2') {
      this.setData({
        addrType: 1
      })
    } else if (that.data.currentTab == '0') {
      this.setData({
        addrType: ''
      })
    }
    my.getStorage({
      key: 'userName',
      success: function (res) {
        let userName = res.data.userName;
        that.setData({
          userName: userName,
        })
        let jsonData = {
          "object":
          {
            "object": {
              // "addUserPhone":that.data.userName,
              "addUserPhone": that.data.userName,
              "addUserType": "1",
              "addrType": that.data.addrType
            }
          }
        }
        //  "addrType": '1' //1,2
        common.ajax('/addressBook/queryBySearchFilter', jsonData,
          function (res) {
            that.setData({
              loadingflag: false
            })
            let headers = res.headers;
            let setcookie = headers["set-cookie"];
            common.sessionvalid(setcookie, function () {
              if (res.data.errCode == '000000') {
                let list = res.data.object.list;
                for (let i = 0; i < list.length; i++) {
                  let txt = list[i].proviceCityRegionTxt.split('-').join('');
                  list[i].done_proviceCityRegionTxt = txt;
                }
                if (list.length == 0) {
                  that.setData({
                    noaddress: true,
                    list: list,
                  })
                } else {
                  that.setData({
                    noaddress: false,
                    list: list,
                  })
                }
                that.setData({
                  loadingflag: false
                })
              } else {
                common.unLogin(res);
              }
            })

          }, function (res) {
            that.setData({
              loadingflag: false
            })
            my.alert({ content: '网络错误，请求失败' });
          })
      }
    });

  },
  tab(e) {
    this.setData({
      zhifubao: false
    })
    const id = e.currentTarget.dataset.id;
    my.setStorage({
      key: 'addressType', // 缓存数据的key
      data: id, // 要缓存的数据
    });
    const left = 250 * id;
    this.setData({
      left: left,
      currentTab: id,
      list: [],
      loadingflag: true,
      noaddress: false
    })
    //请求发件／收件地址
    let that = this;
    if (id == '1') {
      this.setData({
        addrType: 2
      })
    } else if (id == '2') {
      this.setData({
        addrType: 1
      })
    } else if (id == '0') {
      this.setData({
        addrType: ''
      })
    }

    //tab查询地址
    let jsonData = {
      "object":
      {
        "object": {
          "addUserPhone": that.data.userName,
          "addUserType": "1",
          "addrType": that.data.addrType
        }
      }
    }
    //  "addrType": '1' //1,2
    common.ajax('/addressBook/queryBySearchFilter', jsonData,
      function (res) {
        that.setData({
          loadingflag: false
        })
        let headers = res.headers;
        let setcookie = headers["set-cookie"];
        common.sessionvalid(setcookie, function () {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            for (let i = 0; i < list.length; i++) {
              let txt = list[i].proviceCityRegionTxt.split('-').join('');
              list[i].done_proviceCityRegionTxt = txt;
            }
            if (list.length == 0) {
              that.setData({
                noaddress: true,
              })
            } else {
              that.setData({
                noaddress: false,
                list: list,
              })
            }
            that.setData({
              loadingflag: false
            })
          } else {
            common.unLogin(res);
          }
        })

      }, function (res) {
        that.setData({
          loadingflag: false
        })
        my.alert({ content: '网络错误，请求失败' });
      })
  },
  searchInput(e) {
    // 过滤掉特殊字符
    let specialCharacter = "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]";
    function stripScript(s) {
      let pattern = new RegExp(specialCharacter)
      let rs = "";
      for (let i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
      }
      return rs;
    }
    let searchValue = stripScript(e.detail.value);
    this.setData({
      searchValue: searchValue,
    })
    if (e.detail.value.length == 0) {
      let that = this;
      let searchValue = that.data.searchValue;
      let jsonData = {
        "object": {
          "object": {
            "name": searchValue,
            "phone": searchValue,
            "proviceCityRegionTxt": searchValue,
            "addrDetail": searchValue,
            "addUserType": "1",
            "addUserPhone": that.data.userName,
            "addrType": that.data.addrType
          }
        }
      }
      //  "addrType": '1' //1,2
      common.ajax('/addressBook/queryFromApp', jsonData,
        function (res) {
          that.setData({
            loadingflag: false
          })
          let headers = res.headers;
          let setcookie = headers["set-cookie"];
          common.sessionvalid(setcookie, function () {
            if (res.data.errCode == '000000') {
              let list = res.data.object.list;
              for (let i = 0; i < list.length; i++) {
                let txt = list[i].proviceCityRegionTxt.split('-').join('');
                list[i].done_proviceCityRegionTxt = txt;
              }
              if (list.length == 0) {
                that.setData({
                  list: list
                })
              } else {
                that.setData({
                  list: list,
                })
              }
              that.setData({
                loadingflag: false
              })

            } else {
              common.unLogin(res);
            }
          })

        }, function (res) {
          that.setData({
            loadingflag: false
          })
          my.alert({ content: '网络错误，请求失败' });
        })
    }

  },
  searchAddress() {
    let that = this;
    that.setData({
      loadingflag: true,
    })
    let searchValue = that.data.searchValue;
    let jsonData = {
      "object": {
        "object": {
          "name": searchValue,
          "phone": searchValue,
          "proviceCityRegionTxt": searchValue,
          "addrDetail": searchValue,
          "addUserType": "1",
          "addUserPhone": that.data.userName,
          "addrType": that.data.addrType
        }
      }
    }
    //  "addrType": '1' //1,2
    common.ajax('/addressBook/queryFromApp', jsonData,
      function (res) {
        that.setData({
          loadingflag: false
        })
        let headers = res.headers;
        let setcookie = headers["set-cookie"];
        common.sessionvalid(setcookie, function () {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            for (let i = 0; i < list.length; i++) {
              let txt = list[i].proviceCityRegionTxt.split('-').join('');
              list[i].done_proviceCityRegionTxt = txt;
            }
            if (list.length == 0) {
              that.setData({
                list: list
              })
            } else {
              that.setData({
                list: list,
              })
            }
            that.setData({
              loadingflag: false
            })
          } else {
            common.unLogin(res);
          }
        })

      }, function (res) {
        that.setData({
          loadingflag: false
        })
        my.alert({ content: '网络错误，请求失败' });
      })
  },
  deleteAddress(e) {

    let that = this;
    that.setData({
      noaddress: false,
    })
    my.confirm({
      title: '确认要删除吗？',
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      success: (result) => {
        if (result.confirm) {
          const addressmess = e.currentTarget.dataset.id.split(",");
          let addressid = addressmess[0];
          let addressuuid = addressmess[1];
          //删除
          let that = this;
          let jsonData = { "object": addressuuid }
          common.ajax('/addressBook/remove', jsonData,
            function (res) {
              that.setData({
                loadingflag: false
              })
              let headers = res.headers;
              let setcookie = headers["set-cookie"];
              common.sessionvalid(setcookie, function () {
                if (res.data.errCode == '000000') {

                  let newlist = [];
                  for (let i = 0; i < that.data.list.length; i++) {
                    if (that.data.list[i].uuid != addressuuid) {
                      newlist.push(that.data.list[i])
                    }
                  }
                  for (let i = 0; i < newlist.length; i++) {
                    let txt = newlist[i].proviceCityRegionTxt.split('-').join('');
                    newlist[i].done_proviceCityRegionTxt = txt;
                  }
                  if (newlist.length == 0) {
                    that.setData({
                      noaddress: true,
                      list: newlist,
                    })
                  } else {
                    that.setData({
                      noaddress: false,
                      list: newlist,
                    })
                  }
                  //提示删除成功
                  my.showToast({
                    type: 'none',
                    content: '删除成功',
                    duration: 1000,
                    success: () => {
                    },
                  });
                } else {
                  common.unLogin(res);
                }
              })

            }, function (res) {
              my.alert({ content: '网络错误，请求失败' });
            })
        }
      },
    })
  },
  editAddress(e) {
    let that = this;
    let editAddress = this.data.list[e.currentTarget.dataset.id];
    my.setStorage({
      key: 'editAddress',
      data: {
        editAddress: editAddress,
      }
    });
    my.setStorage({
      key: 'addresstip',
      data: {
        addresstip: null,
      },
      success: function () {
        let edit = "../editAddress/editAddress?userName=" + that.data.userName;
        my.navigateTo({ url: edit });
      }
    });

  },
  goDetail() {
    my.navigateTo({ url: '../expressDetail/expressDetail' });
  },
  addAddress() {
    let that = this;
    my.setStorage({
      key: 'addresstip',
      data: {
        addresstip: null,
      },
      success: function () {
        var addrType = 2;
        if (that.data.currentTab == 2) {
          addrType = 1
        } else if (that.data.currentTab == 1) {
          addrType = 2
        }
        let vertiurl = "../addAddress/addAddress?userName=" + that.data.userName + '&addrType=' + addrType;
        my.navigateTo({ url: vertiurl });
      }
    });


  },
  zhibutton() {
    let type = this.data.getAliAddress;
    if (type != '' && type != undefined && type != null) {
      this.getAuthCode(type)

    } else {
      my.getStorage({
        key: 'addressType', // 缓存数据的key
        success: (res) => {
          if (res.data != undefined && res.data != undefined && res.data != null) {
            if (res.data == 1) { this.getAuthCode(2) }
            else if (res.data == 2) { this.getAuthCode(1) }
            else {
              this.getAuthCode(2)
            }
          } else {
            this.getAuthCode(2)
          }
        },
      });
    }
  },
  getAuthCode(getAliAddress) {
    let that = this;

    my.getAuthCode({
      scopes: ['user_address'],
      success: (res) => {

        if (res.authCode) {
          let authCode = res.authCode;

          // 获取用户选中的收货地址ID
          my.chooseAddress({
            success: (res) => {
              let withresult = JSON.stringify(res.result);
              if (withresult != '""') {
                let json = {
                  'addressId': withresult,
                  'authCode': authCode,
                }
                let json1 = JSON.stringify(json)
                let data = {
                  'object': json1
                }
                if (withresult == undefined) {
                  return false;
                }
                //粘贴板
                that.handleCopy(JSON.stringify(data))

                //从寄件入口进入，询问是否需要保存地址到喜来
                // if (getAliAddress != 1) {
                my.confirm({
                  content: '是否将此地址同步至喜来',
                  confirmButtonText: '是的',
                  cancelButtonText: '暂不需要',
                  success: (result) => {
                    //不同意直接退出
                    if (!result.confirm) {
                      return
                    } else {
                      //继续走保存路线
                      my.showLoading({
                      });

                      //请求后台数据
                      common.ajax('/addressBook/getAddFromAli', data
                        , function (res) {
                          if (res.data.errCode === "000000") {
                            //1、请求高德接口（获取经纬度）
                            let a = res.data.object;
                            let b = JSON.parse(a);
                            let name = b.fullname;
                            let phone = b.mobile;
                            //完整地址
                            let location;
                            let proviceCityRegionTxt;
                            if (b.area == undefined) {
                              location = "" + b.prov + b.city + b.address;
                              proviceCityRegionTxt = "" + b.prov + "-" + b.city
                            } else {
                              location = "" + b.prov + b.city + b.area + b.address;
                              proviceCityRegionTxt = "" + b.prov + "-" + b.city + "-" + b.area
                            }

                            var key = "38782d2bc8e5e42e210eb8013e17836a";
                            var url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${location}&city=`;
                            my.httpRequest({
                              url: url,
                              method: 'GET',
                              dataType: 'json',
                              success(res) {
                                let test = JSON.stringify(res)
                                // my.alert({ content: "1111111"+test });
                                if (res.data.geocodes.length != 0) {
                                  let geocodes = res.data.geocodes[0];
                                  //获取经纬度
                                  let latandlong = geocodes.location.split(",")
                                  let longitude = latandlong[0];
                                  let latitude = latandlong[1];
                                  let jsonData1 = {
                                    "object": {
                                      "name": name,
                                      "phone": phone,
                                      "addrDetail": b.address,
                                      "proviceCityRegionTxt": proviceCityRegionTxt,
                                      "addrType": getAliAddress,
                                      "longitude": longitude,
                                      "latitude": latitude,
                                      "addUserType": "1",
                                      "addUserPhone": that.data.userName,
                                      "active": "1"
                                    }
                                  }
                                  // my.alert({
                                  //   title: "222222"+JSON.stringify(jsonData1)
                                  // });
                                  //请求新增地址接口
                                  common.ajax('/addressBook/create', jsonData1
                                    , function (res) {
                                      console.log("++++++++++++" + JSON.stringify(res))
                                      let header = res.headers;
                                      let setcookie = header["set-cookie"];
                                      common.sessionvalid(setcookie, function () {
                                        my.hideLoading();
                                        if (res.data.errCode == '000000') {
                                          my.showToast({
                                            type: 'none',
                                            content: '新增成功',
                                            duration: 1000,
                                            success: () => {
                                              my.getStorage({
                                                key: 'userName',
                                                success: function (res) {
                                                  let userName = res.data.userName;
                                                  that.setData({
                                                    userName: userName,
                                                  })
                                                  let jsonData = {
                                                    "object":
                                                    {
                                                      "object": {
                                                        "addUserPhone": that.data.userName,
                                                        "addUserType": "1",
                                                        "addrType": that.data.addrType
                                                      }
                                                    }
                                                  }

                                                  common.ajax('/addressBook/queryBySearchFilter', jsonData,
                                                    function (res) {
                                                      let headers = res.headers;
                                                      let setcookie = headers["set-cookie"];
                                                      common.sessionvalid(setcookie, function () {
                                                        if (res.data.errCode == '000000') {
                                                          that.flage();
                                                          let list = res.data.object.list;
                                                          for (let i = 0; i < list.length; i++) {
                                                            let txt = list[i].proviceCityRegionTxt.split('-').join('');
                                                            list[i].done_proviceCityRegionTxt = txt;
                                                          }
                                                          if (list.length == 0) {
                                                            that.setData({
                                                              noaddress: true,
                                                              list: list,
                                                            })
                                                            my.hideLoading();
                                                          } else {
                                                            that.setData({
                                                              noaddress: false,
                                                              list: list,
                                                            })
                                                            my.hideLoading();
                                                          }
                                                        } else {
                                                          common.unLogin(res);
                                                        }

                                                      })

                                                    }, function (res) {
                                                      my.hideLoading();
                                                      my.alert({ content: '网络错误，请求失败' });
                                                    })
                                                }
                                              });
                                            }
                                          })
                                        } else {
                                          my.hideLoading();

                                          my.showToast({
                                            type: 'none',
                                            content: res.data.errDesc,
                                            duration: 1000
                                          })
                                        }
                                      })
                                    }
                                    , function (res) {
                                      my.hideLoading();

                                      my.showToast({
                                        type: 'none',
                                        content: res.errorMessage,
                                        duration: 1000
                                      })
                                    })


                                }
                              },
                              fail(res) {
                                my.hideLoading();

                                my.alert({ content: '经纬度请求错误' });
                              }
                            })
                          } else {
                            my.hideLoading();

                            my.alert({ content: '网络错误' });
                          }

                        }, function (res) {
                          my.hideLoading();
                          my.alert({ content: '网络错误' });
                        })

                    }
                  }
                })

              }
            }
          });
        }
        else {
          my.alert({
            title: '授权失败', // alert 框的标题
          });
        }
      },
    });


  },
  handleCopy(data) {
    my.setClipboard({
      text: data,
    });
  },

});
