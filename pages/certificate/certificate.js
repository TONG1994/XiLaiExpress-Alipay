var common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    hintshow:false
  },
  onLoad(query) {
    //扫支付宝码未认证的，要认证，要保存一下uuid值
    if(query.uuid){
      let sendurl="../sendExpress/sendExpress?uuid="+query.uuid;
      this.setData({
        sendurl:sendurl
      })
    }
      let idCardNo = query.idCardNo;
      let realName = query.realName;
      if (idCardNo && realName){
          this.setData({
              inputdisabled: true,
              Name: realName,
              idno: idCardNo,
              checkactive: true,
          })
      }
  },
   
  onnameInput(e){
    if(e.detail.value){
      this.setData({
          name:true,
          Name:e.detail.value
      });
      console.log(this.data.id)
      if(this.data.id){
          this.setData({  
            checkactive:true
          });
      }  
    }else{
        this.setData({
            name:false,
            checkactive:false
        });
    }
    console.log(this.data.name)
  },
  onidInput(e){
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    if(e.detail.value.length=='0'){
      this.setData({
          hintshow:false,
        });
    }else if(reg.test(e.detail.value)){
      console.log(1)
       this.setData({
          id:true,
          hintshow:false,
          idno:e.detail.value,
        });
        if(this.data.name){
          this.setData({
            checkactive:true
          });
        }  
        console.log(this.data.idno)
    }else{
      if(e.detail.value.length=='15'||e.detail.value.length=='18'){
        this.setData({
          hintshow:true,
          id:false,
          checkactive:false
        });
      }else{
         this.setData({
            hintshow:false,
            id:false,
            checkactive:false
          });
      }

      console.log(this.data.checkactive)
    }  
  },
  checkIdcard(){
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    if(reg.test(this.data.idno)){
      this.setData({
        hintshow:false
      });
    }else{
      this.setData({
        hintshow:true
      });
    } 
    //验证
    let clickTag = 0;
    if(clickTag === 0) {
      clickTag = 1;
      setTimeout(function () {
          clickTag = 0
      }, 5000);
      // 验证
      let that=this;
      let jsondata={
          "object": {
            "idCardNo":that.data.idno,
            "realName":that.data.Name
          }
        }
         console.log(that.data.idno);
        this.setData({
          loadingflag:true
        })

      common.ajax('/idCardAuth/validateUserIdCard',jsondata,
        function(res) {
          that.setData({
            loadingflag:false
          })
          console.log(res.data)
          console.log(res.headers)
          let headers=res.headers;
          let setcookie=headers["set-cookie"];
          common.sessionvalid(setcookie,function(){

            if(res.data.errCode=='000000'){
                if(res.data.object){
                  that.setData({
                    alertshow:true,
                    alert:{
                      image:'../../../image/success.png',
                      text:'验证成功'
                    }
                  })
                  
                  my.setStorage({
                    key: 'idCard',
                    data: {
                      idCard: true,
                    }
                  });
                  my.getStorage({
                    key: 'currentnav',
                    success: function(res) {
                      setTimeout(function(){
                        my.navigateBack({
                          delta: 2
                        })
                        if(res.data.currentnav=='../sendExpress/sendExpress'){
                          my.navigateTo({ url: '../sendExpress/sendExpress'});
                        }else if(res.data.currentnav.indexOf('=')){
                          my.setStorage({
                              key: 'currentnav',
                              data: {
                                  currentnav:'../sendExpress/sendExpress',
                              }
                          });
                          my.navigateTo({ url:that.data.sendurl});
                        }
                      },1000)
                      
                    }   
                  });
                  
                }else{
                  that.setData({
                    alertshow:true,
                    alert:{
                      image:'../../../image/fail.png',
                      text:'姓名和身份证号码不一致'
                    }
                  })
                }
            
            }else{
              if (res.data.errCode === "AUTH09"){
                  common.unLogin(res);
              } 
              else{
                  that.setData({
                    alertshow:true,
                    alert:{
                      image:'../../../image/fail.png',
                      text:res.data.errDesc
                    }
                  })
              } 
              
              // var text=res.data.errCode
              // if(res.data.errCode=='REQ000'){
              //   console.log(res.data.errDesc);
              //   if(res.data.errDesc=="您已实名认证，无需实名认证！"){
              //    var text="您已实名认证，无需实名认证！"
              //   }
              // }else if(res.data.errCode=='REQ002'){
              //   var text="内部服务调用异常，请确认后重试"
              //   my.alert({content: });          
              // }else if(res.data.errCode=='REQ006'){
              //   var text="您已实名认证，无需实名认证！"
              //   my.alert({content: '抱歉，今日您的实名认证次数已达上限，请明天再试'});          
              // }else{
              //   var text="您已实名认证，无需实名认证！"
              //   my.alert({content: '后台错误'});  
              // }
            
              
            }
            if(that.data.alertshow){
                setTimeout(function(){
                  that.setData({
                    alertshow:false,
                  })
                },2000)
            }
          }) 
        },function(res) {
           my.alert({content: '网络错误，认证失败'});     
        })   
    }
    else {
        alert('请勿频繁点击！');
    }
  }

});
