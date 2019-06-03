const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {},

  onShow(){
    common.validateUserIdCard(this);
  },
  sendExpress() {
    let that=this;
    setTimeout(function(){
       my.getStorage({
      key: 'cookie',
      success: function(res) {
        // console.log(res.data);
        if(!res.data){
            // 未登录存储当前想打开的页面，登录完成后自动跳转
            my.setStorage({
                key: 'currentnav',
                data: {
                    currentnav: '../sendExpress/sendExpress',
                }
            });
            my.navigateTo({ url: '../login/login' });
        }else{
          //点击send如果未认证需要认证，认证成功自动跳到sendexpress
          if(that.data.CardValid=='false'){   
            console.log('cardvalidfail')                           
            my.navigateTo({ url: '../authentication/authentication'});
          }else{
            console.log('CardValidtrue')
              my.navigateTo({ url: '../sendExpress/sendExpress'});
          }
        }
       
      },
      fail: function(res){
        my.alert({content: res.errorMessage});
      }
    });
    },300)
   
  },
  expressRecord() {
    common.navigate('../myExpress/myExpress' );
    // my.navigateTo({ url: '../myExpress/myExpress' });
  },
  certificate() {
    common.navigate('../authentication/authentication' );
    // my.navigateTo({ url: '../certificate/certificate' });
  }
});
