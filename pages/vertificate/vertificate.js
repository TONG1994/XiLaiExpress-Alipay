const common= require("../../common/common.js");
const app = getApp();

Page({
  data: {
    inputValue: '',
    abled:false,
    status:'注册／登录',
    // phonenum:'15995218340',
    countdown:'(60)',
    clickTag:0
  },
  onLoad(options) {
    let that=this;
    this.setData({
      phonenum:options.phonenum,
    });
    common.validateUserIdCard(that);
  },
  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  oncodeInput(e){
    console.log(e.detail.value)
    if(e.detail.value.length=='4'){
       this.setData({
          active:'active',
          abled:true,
          inputValue: e.detail.value,
        });
    }else{
      this.setData({
          active:'',
          abled:false,
        });
    }
   
  },
  login(){
    let that=this;
    if (this.data.clickTag===0) {
      this.setData({
        clickTag:1
      }) 
      setTimeout(function () {
          that.setData({
            clickTag:0
          })
      }, 3000);
      // 验证
      that.setData({
        loadingflag:true
      })
      my.httpRequest({
        // url: 'https://smallapp-cs.xilaikd.com/xilaisender_s/login/userLogin',
        // url:'http://w95d3y.natappfree.cc/xilaisender_s/login/userLogin',
        //测试环境
        //  url:'http://xilai.s1.natapp.cc/xilaisender_s/login/userLogin',
        url:`${common.urlhead}/login/userLogin`,
        headers:{
        'Content-Type':'application/json'
        },
        method: 'POST',
        data: JSON.stringify({
            "object": {
                "telephone":this.data.phonenum,
                "vercode": this.data.inputValue
            },
            "term": "1"
        }),
        dataType: 'json',
        success: function(res) {
          that.setData({
            loadingflag:false
          })
          console.log(res.headers)
          if(res.data.errCode=='000000'){
            let data=res.data.object;
            if(data.staffInfo){
               if(data.staffInfo.idCard!=''||data.staffInfo.idCard!=undefined||data.staffInfo.idCard!=null){
                var loginidcard=data.staffInfo.idCard;
               }else{
                 var loginidcard=null;
               }
            }
            console.log(loginidcard)
            that.setData({
              loginidcard:loginidcard
            })
          
            console.log(data)
            console.log('登录后的idcard')
                console.log(loginidcard)
            //登录后设置cookie保持登录状态
            my.setStorage({
              key: 'cookie',
              data: {
                cookie:`SESSION=${data.sessionId};SSOTOKEN=${data.ssoToken}`,
                // idCard:loginidcard
              },
              success: function() {
                 my.setStorage({
                  key: 'userName',
                  data: {
                    userName:that.data.phonenum,
                    // idCard:loginidcard
                  },
                  success:function(){
                      my.setStorage({
                        key: 'idCard',
                        data: {
                          idCard:loginidcard,
                          // idCard:loginidcard
                        },
                        success:function(){
                          //登录成功后判断要跳转到哪个页面
                        
                          my.getStorage({
                            key: 'currentnav',
                            success: function(res) {
                              console.log(res.data);
                              //如果有存currentnav，说明从非登录位置进入login页面
                              my.showToast({
                                  type: 'none',
                                  content: '登录成功',
                                  duration: 1000,
                                  success: () => {
                                    my.navigateBack({
                                      delta: 2
                                    })
                                    if(res.data.currentnav=='../login/login'){
                                          // 如果是从注册／登录进去的，跳转到my 
                                            my.switchTab({
                                              url: '../my/my'
                                            })  
                                    } else if (res.data.currentnav =='../authentication/authentication'){
                                        // 如果是从认证页面进去后登录的，跳转到设置已认证页面
                                        if(that.data.loginidcard==null){  
                                          setTimeout(function(){
                                              my.navigateTo({ url: '../authentication/authentication'});
                                          },1000)   
                                        }else{
                                            my.switchTab({
                                              url: '../home/home'
                                            })  
                                        }
                                        
                                    
                                    }
                                    // else if(res.data.currentnav=='../sendExpress/sendExpress'){
                                      //扫描支付宝码，登录后跳转到send，但要判断是否认证，认证完成之后还需带着参数传给send页面
                                    else if(res.data.currentnav.indexOf('../sendExpress/sendExpress')!=-1){//是否扫码都可以走send
                                      // 首页登录，点击send,如果未认证跳转到认证页面,认证页面认证成功后调到send页面

                                      if(res.data.currentnav.indexOf('=')!=-1){//从扫码登录
                                        console.log('扫码登录')
                                        var uuid=res.data.currentnav.split('=')[1];
                                        var sendurl="../sendExpress/sendExpress?uuid="+uuid;
                                          var certiurl ="../authentication/authentication?uuid="+uuid;
                                        if(that.data.loginidcard==null){   
                                          console.log('扫码后发现未认证')   
                                          setTimeout(function(){
                                            my.navigateTo({ url: certiurl});
                                          },1000)                   
                                              
                                        }else{
                                          console.log('扫码后发现已认证')
                                          setTimeout(function(){
                                            my.navigateTo({ url: sendurl});
                                          },1000) 
                                            
                                        }
                                        // my.getStorage({
                                        //   key: 'idCard',
                                        //   success: function(res) {
                                        //     if(res.data){
                                        //       console.log('已认证')
                                        //       my.navigateTo({ url: sendurl});
                                        //     }else{
                                        //       console.log('未认证')
                                        //       my.navigateTo({ url: certiurl});
                                        //     }
                                        //             // console.log(that.data.CardValid)
                                        //   },
                                        // });
                                      }else{
                                          if(that.data.loginidcard==null){   
                                            console.log('cardvalidfail')   
                                            setTimeout(function(){
                                                my.navigateTo({ url: '../authentication/authentication'});
                                            },1000)                   
                                                
                                          }else{
                                            console.log('CardValidtrue')
                                            setTimeout(function(){
                                              my.navigateTo({ url: '../sendExpress/sendExpress'});
                                            },1000) 
                                              
                                          }
                                      }
                                      
                                      
                                    }else{
                                      setTimeout(function(){
                                          my.navigateTo({ url: res.data.currentnav});
                                        },1000) 
                                    
                                  }
                                  },
                                });                     
                            }
                            
                          });
                        }
                      });
                  }
                });
              
                
                // my.navigateTo({ url: '../home/home' });
              }
            });
            
          }else{
            my.alert({content: res.data.errDesc});
          }
        },
          
        fail: function(res) {
          that.setData({
            loadingflag:false
          })
          my.alert({content: '网络异常，登录失败'});
        }
      });
    }
    else {
      my.alert({content:'请勿频繁点击！'});
    }
  },
  // 页面渲染完成后 调用  
  onReady: function () {  
    var totalSecond = 59;  
    var interval = setInterval(function () {  
      // 秒数  
      var second = totalSecond;  
      this.setData({  
        countdown:`(${totalSecond})`,  
        countclick:false   
      });  
      totalSecond--;  
      if (totalSecond < 0) {  
        clearInterval(interval);  
        this.setData({  
          countdown: '重新发送', 
          countclick:true 
        });  
      }  
    }.bind(this), 1000);  
  },  

  counts(){
    console.log('click重新发送')
    this.setData({  
      countdown:'(60)', 
      countclick:false    
    });  
      var totalSecond =59;  
      var interval = setInterval(function () {  
        // 秒数  
        var second = totalSecond;  
        this.setData({  
          countdown:`(${totalSecond})`, 
          countclick:false    
        });  
        totalSecond--;  
        if (totalSecond < 0) {  
          clearInterval(interval);  
          this.setData({  
            countdown: '重新发送',
            countclick:true   
          });  
        }  
      }.bind(this), 1000); 

      // 请求验证码接口
      let that=this;
      if (this.data.clickTag===0) {
        this.setData({
          clickTag:1
        }) 
        setTimeout(function () {
            that.setData({
              clickTag:0
            })
        }, 3000);
        // 验证
        my.httpRequest({
          // url: 'http://xilaialipay.icerno.com/xilaimanager_s/user/createVerificationCode',
          // url: 'http://w95d3y.natappfree.cc/xilaisender_s/user/createVerificationCode',
          // url: 'http://xilai.s1.natapp.cc/xilaisender_s/user/createVerificationCode',
          url:`${common.urlhead}/user/createVerificationCode`,
          headers:{
            'Content-Type':'application/json',
            // 'cookie': 'SESSION=ee062cc1-8a9f-48c5-b26f-085a36c24e84;SSOTOKEN=8B0D007A7F6C6A10A2AEB800A6AA88943540B0A67F20B9CE9AAE893984EF73579AB3809653352227'
            },
          method: 'POST',
          data:JSON.stringify({
            "object":that.data.phonenum
          }),
          dataType: 'json',
          success: function(res) {
            console.log(res.data)
            console.log(res.data.errCode)
            if(res.data.errCode=='000000'){
                console.log('重新发送成功')
            }else{
              my.alert({content: res.data.errDesc});
            }
          },
          fail: function(res) {
            my.alert({content: '网络错误，验证码发送失败'});
            console.log(res);       
          }
        });
        
      }
      else {
        my.alert({content:'请勿频繁点击！'});
      }
    },
    rule(){
        my.navigateTo({ url: '../rule/rule'});
    }

});
