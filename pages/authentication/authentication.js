var common = require("../../common/common.js");
const app = getApp();

Page({
    photograph(){
        my.chooseImage({
            success: (res) => {
                let img = res.apFilePaths[0];
                my.getStorage({
                    key: 'cookie',
                    success: function(res) {
                        let cookie = res.data.cookie;
                        my.uploadFile({
                            url: common.urlhead+'/idCardAuth/getIdCardInfoByOCR',
                            fileType: 'image',
                            header: {
                                'cookie': cookie
                            },
                            fileName: 'image',
                            filePath: img,
                            success: (res) => {
                                let data = res.data;
                                let objectData = JSON.parse(data);
                                console.log(objectData);
                                if (objectData.errCode ==='000000'){
                                    let realName = objectData.object.name;
                                    let idCardNo = objectData.object.idCard;
                                    if (idCardNo === '' || idCardNo === null || realName === '' || realName === null){
                                        my.alert({
                                            content: '上传失败，请重新上传'
                                        });
                                    }else{
                                        my.navigateTo({ url: '../certificate/certificate?realName=' + realName + '&idCardNo=' + idCardNo })
                                    }
                                }else{
                                    my.alert({
                                        content: '上传失败，请重新上传'
                                    });
                                }
                            },
                            fail(res) {
                                my.alert({
                                    content: '上传失败，请重新上传'
                                });
                            }
                        });
                    }
                });

            },
        });
    },
    write() {
        common.navigate('../certificate/certificate');
    },


});
