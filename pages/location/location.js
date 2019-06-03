const common = require("../../common/common.js");
const amapFile = require("../../utils/amap-wx.js");
const app = getApp();

Page({
  data: {
    tips: {},
    city: '北京市',
    cityAdcode: '110105'
  },
  onLoad(e) {
    let that = this;
    //带过来的城市
    console.log(e.id);
    console.log(e.code);
    let city_test = e.id
    let city_code = e.code
    if (city_test != '') {
      this.setData({
        city: city_test,
        cityAdcode: city_code
      })
      var keywords = city_test;
      var key = "f951696ba64bfc95033a4db927992ce0";
      var myAmapFun = new amapFile.AMapWX({
        key: key
      });
      myAmapFun.getInputtips({
        keywords: keywords,
        citylimit: true,
        city: city_code,
        success: function (data) {
          if (data && data.tips) {
            var list = [];
            for (var i = 0; i < data.tips.length; i++) {
              if (data.tips[i].location != "") {
                //记录详细地址到address
                data.tips[i].address = data.tips[i].name;
                //记录完整地址到name
                data.tips[i].name = data.tips[i].district + data.tips[i].name;
                list.push(data.tips[i]);
              }
            }
            that.setData({
              tips: list
            });
          }
          console.log(that.data.tips);
        }
      })
      return;
    }
    my.showLoading({
      content: '定位中...',
    });
    my.getLocation({
      type: 1,
      success(res) {
        let location = res.longitude + "," + res.latitude;
        let key = "38782d2bc8e5e42e210eb8013e17836a";
        let url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${location}&key=${key}&radius=3000&extensions=all`;
        my.httpRequest({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            console.log(res);
            var nocity = res.data.regeocode.addressComponent.city;
            if (nocity.length == 0) {
              that.setData({
                city: res.data.regeocode.addressComponent.province,
                cityAdcode: res.data.regeocode.addressComponent.adcode
              })
            } else {
              that.setData({
                city: res.data.regeocode.addressComponent.city,
                cityAdcode: res.data.regeocode.addressComponent.adcode
              })
            }
            let key = "38782d2bc8e5e42e210eb8013e17836a";
            let url1 = `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${location}&poitype=&radius=&extensions=all&batch=false&roadlevel=0`;
            my.httpRequest({
              url: url1,
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                console.log("最终")
                console.log(JSON.stringify(res));

                let data = res.data.regeocode.addressComponent;
                let district = data.district != '' ? data.district : '';
                let street = data.streetNumber.street != '' ? data.streetNumber.street : '';
                let name = res.data.regeocode.aois.length != 0 ? res.data.regeocode.aois[0].name : '';
                //查询

                let keyword = data.province + data.city + district + street + name;
                console.log(res.data.regeocode.aois[0]);
                var key1 = "f951696ba64bfc95033a4db927992ce0";
                var myAmapFun = new amapFile.AMapWX({
                  key: key1
                });

                myAmapFun.getInputtips({
                  keywords: keyword,
                  citylimit: true,
                  city: that.data.cityAdcode,
                  success: function (data) {
                    if (data && data.tips) {
                      var list = [];
                      for (var i = 0; i < data.tips.length; i++) {
                        if (data.tips[i].location != "") {
                          //记录详细地址到address
                          data.tips[i].address = data.tips[i].name;
                          //记录完整地址到name
                          data.tips[i].name = data.tips[i].district + data.tips[i].name;
                          list.push(data.tips[i]);
                        }
                      }
                      that.setData({
                        tips: list
                      });
                    }
                    console.log(data);
                  }
                })


                my.hideLoading()
              },
              fail: function (res) {
                my.hideLoading()
              }
            })



          }, fail(res) {
            my.hideLoading();

          }
        })
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },
  chooseCity() {
    let that = this;
    my.chooseCity({
      hotCities: [
        {
          city: '北京市',
          adCode: '110100'
        },
        {
          city: '上海市',
          adCode: '310100'
        },
        {
          city: '深圳市',
          adCode: '440300'
        },
        {
          city: '广州市',
          adCode: '440100'
        },
        {
          city: '重庆市',
          adCode: '500100'
        },
        {
          city: '天津市',
          adCode: '120100'
        }
      ],
      success: (res) => {
        let city = res.city;
        let cityAdcode = res.adCode;
        // my.alert({
        //   content:cityAdcode+city
        // })
        that.setData({
          city: city,
          cityAdcode: cityAdcode,
          tips: ''
        })
      },
    });
  },
  search(e) {
    var that = this;
    var keywords = e.detail.value;
    var key = "f951696ba64bfc95033a4db927992ce0";
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getInputtips({
      keywords: keywords,
      citylimit: true,
      city: that.data.cityAdcode,
      success: function (data) {
        if (data && data.tips) {
          var list = [];
          for (var i = 0; i < data.tips.length; i++) {
            if (data.tips[i].location != "") {
              //记录详细地址到address
              data.tips[i].address = data.tips[i].name;
              //记录完整地址到name
              data.tips[i].name = data.tips[i].district + data.tips[i].name;
              list.push(data.tips[i]);
            }
          }
          that.setData({
            tips: list
          });
        }
        console.log(data);
      }
    })
  },
  chooseAddress(e) {
    var keywords = e.currentTarget.dataset.keywords.name;
    //获取省市区后面的地址
    var getformatted = e.currentTarget.dataset.keywords.address;
    let id = e.currentTarget.dataset.id;
    let tips = this.data.tips;
    let addresstip = tips[id];
    var keywords = tips[id].name;
    console.log(keywords)

    var key = "38782d2bc8e5e42e210eb8013e17836a";
    var url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${keywords}&city=`;
    my.httpRequest({
      url: url,
      method: 'GET',
      dataType: 'json',
      success(res) {
        console.log(res);
        //找到地点
        if (res.data.geocodes.length != 0) {
          let geocodes = res.data.geocodes[0];
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          prevPage.setData({ //直接给上移页面赋值
            item: getformatted,
            province: geocodes.province,
            city: geocodes.city,
            county: geocodes.district,
            index: "get"
          });
          my.navigateBack({
            delta: 1
          });
        } else {
          my.showToast({
            type: 'none',
            content: '网络错误',
            duration: 1000
          })
        }
      },
      fail(res) {
        my.showToast({
          type: 'none',
          content: '请求失败',
          duration: 1000
        })
      }

    })
  }
});
