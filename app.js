
App({
  onLaunch(options) {
    var that=this;
    // my.alert({
    //   content:options.query
    // })
    // common.validateUserIdCard(this);
    //扫快递员二维码启动页面下单时
    if(options.query){
      if(options.query.qrCode){
        let url=options.query.qrCode;
        let uuid=url.split('?')[1].split('&')[0].split('=')[1]

        // if (options.query.uuid) {
        //有启动参数，判断是否登陆，未登录跳转到登录页面，登录跳转到发快递页面
        var sendurl="../sendExpress/sendExpress?uuid="+uuid;
        var certiurl="../certificate/certificate?uuid="+uuid;
        // var sendurl = "../sendExpress/sendExpress?uuid=" + options.query.uuid;
        // var certiurl = "../authentication/authentication?uuid=" + options.query.uuid;
        my.getStorage({
          key: 'cookie',
          success: function(res) {
            // console.log(res.data);
            if(!res.data){
                // 未登录存储当前想打开的页面，登录完成后自动跳转
                my.setStorage({
                    key: 'currentnav',
                    data: {
                        currentnav:sendurl,
                    }
                });
                my.navigateTo({ url: '../login/login' });
            }else{
              my.getStorage({
                key: 'idCard',
                success: function(res) {
                  console.log('app.js已认证')
                  if(res.data.idCard){
                    my.navigateTo({ url: sendurl});
                  }else{
                    console.log('app.js未认证')
                    my.navigateTo({ url: certiurl});
                  }
                          // console.log(that.data.CardValid)
                },
              });
                //点击send如果未认证需要认证，认证成功自动跳到sendexpress
            }
          
          },
          fail: function(res){
            my.alert({content: res.errorMessage});
          }
        });
      }
      
      // //点击公众号查快递时
      // // alipays://platformapi/startApp?appId=2018050702646599&page=pages/home/home&query=public=true;
      // if(options.query.public){
      //   //有启动参数，判断是否登陆，未登录跳转到登录页面，登录跳转到发快递页面
      //   var expressurl="../myExpress/myExpress";
      //   // var certiurl="../certificate/certificate?uuid="+options.query.public;
      //   my.getStorage({
      //     key: 'cookie',
      //     success: function(res) {
      //       // console.log(res.data);
      //       if(!res.data){
      //           // 未登录存储当前想打开的页面，登录完成后自动跳转
      //           my.setStorage({
      //               key: 'currentnav',
      //               data: {
      //                   currentnav:expressurl,
      //               }
      //           });
      //           my.navigateTo({ url: '../login/login' });
      //       }else{
      //         my.navigateTo({ url: expressurl});
      //       }
          
      //     },
      //     fail: function(res){
      //       my.alert({content: res.errorMessage});
      //     }
      //   });
      // }
    }
  },
  userInfo: null,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: (authcode) => {
          console.info(authcode);

          my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
});
