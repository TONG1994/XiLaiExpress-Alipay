
// const url = "http://10.10.10.166:1882";

// 开发环境
var urlhead = 'http://game.icerno.com/xilaisender_s'
var urlhead2 = 'http://game.icerno.com/xilaimanager_s'

// 测试环境
// var urlhead = 'http://smallapp-cs.xilaikd.com/xilaisender_s'
// var urlhead2 = 'http://smallapp-cs.xilaikd.com/xilaimanager_s'
// 生产环境dev
// var urlhead='https://smallapp.xilaikd.com/xilaisender_s';
// var urlhead2='https://smallapp.xilaikd.com/xilaimanager_s'


function status(that) {
    my.getStorage({
        key: 'userName',
        success: function (res) {
            // my.alert({
            //  content:JSON.stringify(res.data)
            // });
            //   console.log(res.data)
            if (res.data) {
                that.setData({
                    login: 'true',
                })
                // console.log(res.data.userName)
                if (res.data.userName) {
                    that.setData({
                        userName: res.data.userName,
                    })
                } else {
                    that.setData({
                        userName: '注册／登录',
                    })
                }
            } else {
                that.setData({
                    login: 'false',
                })
            }

            // console.log(that.data.login)
        },
        fail: function (res) {
            my.alert({ content: res.errorMessage });
        }
    });
}
function validateUserIdCard(that) {
    my.getStorage({
        key: 'idCard',
        success: function (res) {
            if (res.data) {
                if (res.data.idCard) {
                    that.setData({
                        CardValid: 'true',
                        CardValidtext: '已认证'
                    })
                } else {
                    that.setData({
                        CardValid: 'false',
                        CardValidtext: '未认证'
                    })
                }
            } else {
                that.setData({
                    CardValid: 'false',
                    CardValidtext: '未认证'
                })
            }
            // console.log(that.data.CardValid)
        },
        fail: function (res) {
            my.alert({ content: res.errorMessage });
        }
    });
}



function navigate(url) {
    //判断是否登录，未登录跳转到登录页面
    my.getStorage({
        key: 'cookie',
        success: function (res) {
            // console.log(res.data);
            if (!res.data) {
                // 未登录存储当前想打开的页面，登录完成后自动跳转
                my.setStorage({
                    key: 'currentnav',
                    data: {
                        currentnav: url,
                    }
                });
                my.navigateTo({ url: '../login/login' });
            } else {
                my.navigateTo({ url: url });
            }

        },
        fail: function (res) {
            my.alert({ content: res.errorMessage });
        }
    });

}

//验证cookie登录的网络请求
//funcsucss 请求成功调用，数据是res

function sessionvalid(setcookie, func) {
    if (setcookie) {
        if (setcookie[0].indexOf('SESSION=') != -1 && setcookie[1].indexOf('SSOTOKEN=') != -1) {
            let sessionId = setcookie[0],
                ssoToken = setcookie[1],
            storageData = sessionId + ';' + ssoToken
            my.setStorage({
                key: 'cookie',
                data: {
                    cookie:storageData,
                },
            });

        }
    }
    func();
}

function ajax(url, data, funcsucss, funcfail) {
    // const api=' http://10.10.10.201:1882/xilaimanager_s/';
    // const api='xilaialipay.icerno.com/xilaisender_s';
    // const api='https://smallapp-cs.xilaikd.com/xilaisender_s';
    // const api='http://w95d3y.natappfree.cc/xilaisender_s';
    const api = urlhead;
    let URL = api + url;
    my.getStorage({
        key: 'cookie',
        success: function (res) {
            let cookie = res.data.cookie;
            my.httpRequest({
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'cookie': cookie
                },
                method: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                success: funcsucss,
                fail: funcfail
            });
        }
        //cookie获取失败
        // fail: function(res){
        //   my.alert({content: res.errorMessage});
        // }
    });

}

function ajax2(url, data, funcsucss, funcfail) {
    // const api=' http://10.10.10.201:1882/xilaimanager_s/';
    // const api='xilaialipay.icerno.com/xilaisender_s';
    // const api='https://smallapp-cs.xilaikd.com/xilaisender_s';
    // const api='http://w95d3y.natappfree.cc/xilaisender_s';
    const api = urlhead2;
    let URL = api + url;
    my.getStorage({
        key: 'cookie',
        success: function (res) {
            let cookie = res.data.cookie;
            my.httpRequest({
                url: URL,
                headers: {
                    'Content-Type': 'application/json',
                    'cookie': cookie
                },
                method: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                success: funcsucss,
                fail: funcfail
            });
        }
        //cookie获取失败
        // fail: function(res){
        //   my.alert({content: res.errorMessage});
        // }
    });

}

function unLogin(res) {
    if (res.data.errCode === "AUTH09") {
        console.log('登录过期')
        my.clearStorage();
        my.setStorage({
            key: 'currentnav',
            data: {
                currentnav: "../login/login",
            }
        });
        my.navigateBack({
            delta: 10
        })
        my.navigateTo({ url: '../login/login' });
    } else {
        my.alert({ content: res.data.errDesc });
    }
}
function formatDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    // var h = date.getHours();  
    // var minute = date.getMinutes();  
    // minute = minute < 10 ? ('0' + minute) : minute;  
    // return y + '-' + m + '-' + d+' '+h+':'+minute+':00';  
    return y + '-' + m + '-' + d + ' ';
};
module.exports = {
    navigate: navigate,
    status: status,
    validateUserIdCard: validateUserIdCard,
    ajax: ajax,
    ajax2: ajax2,
    urlhead: urlhead,
    sessionvalid: sessionvalid,
    unLogin: unLogin,
    formatDateTime: formatDateTime,

}

