const common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    inputValue: '',
    status: '发送验证码',
    countdown: '10',
    clickTag: 0
  },
  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
    if (e.detail.value.length == '11') {
      this.setData({
        active: 'active',
        inputValue: e.detail.value
      });
    } else {
      this.setData({
        active: '',
      });
    }

  },
  sendCode() {
    let that = this;

    // 验证
    const reg = /^1[3456789]\d{9}$/;
    const vertiurl = "../vertificate/vertificate?phonenum=" + this.data.inputValue;
    if (this.data.inputValue == '') {
      my.alert({ content: '请输入手机号码' });
    } else if (!reg.test(this.data.inputValue)) {
      my.alert({ content: '手机格式不正确' });
    } else {
      if (this.data.clickTag === 0) {
        this.setData({
          clickTag: 1,
          loadingflag: true
        })
        setTimeout(function() {
          that.setData({
            clickTag: 0
          })
        }, 3000);
        my.httpRequest({
          // url: 'http://xilaialipay.icerno.com/xilaisender_s/user/createVerificationCode',
          // url: 'https://smallapp-cs.xilaikd.com/xilaisender_s/user/createVerificationCode',
          // url:'http://w95d3y.natappfree.cc/xilaisender_s/user/createVerificationCode',
          url: `${common.urlhead}/user/createVerificationCode`,
          headers: {
            'Content-Type': 'application/json',
            // 'cookie': 'SESSION=ee062cc1-8a9f-48c5-b26f-085a36c24e84;SSOTOKEN=8B0D007A7F6C6A10A2AEB800A6AA88943540B0A67F20B9CE9AAE893984EF73579AB3809653352227'
          },
          method: 'POST',
          data: JSON.stringify({
            "object": this.data.inputValue
          }),
          dataType: 'json',
          success: function(res) {
            console.log(res.data)
            console.log(res.data.errCode)
            that.setData({
              loadingflag: false
            })
            if (res.data.errCode == '000000' || res.data.errCode == '50026') {
              my.showToast({
                type: 'none',
                content: '发送成功',
                duration: 1000,
                success: () => {
                  my.navigateTo({ url: vertiurl });
                },
              });

            } else {
              my.alert({ content: res.data.errDesc });
            }
          },
          fail: function(res) {
            that.setData({
              loadingflag: false
            })
            my.alert({ content: '网络错误，验证码发送失败' });
            console.log(res);
          }
        });
      }
      else {
        my.alert({ content: '请勿频繁点击！' });
      }
    }
  }
});
