var common = require("../../common/common.js");
const app = getApp();

Page({
  data: {
    inputValue: '',
  },
  onShow() {
    common.status(this);
    common.validateUserIdCard(this);
  },
  login() {
    if (this.data.login == 'false') {
      common.navigate('../login/login');
    }
  },
  certificate() {
      common.navigate('../authentication/authentication');
  },
  myExpress() {
    common.navigate('../myExpress/myExpress');
  },
  address() {
    common.navigate('../myAddress/myAddress?index=0');
  },
  coupon() {
    common.navigate('../coupon/coupon');
  },
  set() {
    common.navigate('../set/set');
  },
  about() {
    common.navigate('../about/about');
  },
  phonecall() {
    my.makePhoneCall({
      number: '021-52658180'
    })
  }
});
