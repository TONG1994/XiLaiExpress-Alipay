const common= require("../../common/common.js");
const app = getApp();

Page({
  data: {
    
},
onLoad(){
this.setData({
    loadingflag:true
})
const that=this;
my.getStorage({
    key: 'cookie',
    success: function(res) {
        let userName=res.data.userName;
        that.setData({
            userName:userName,
        })
    }
});
common.ajax('/coupon/getByUser',null,
    function(res) {
        that.setData({
            loadingflag:false
        })
        console.log(res.headers)
        let headers=res.headers;
        let setcookie=headers["set-cookie"];
        common.sessionvalid(setcookie,function(){
            if(res.data.errCode=='000000'){
                const list=res.data.object;
                console.log(list)
                if(list.length==0){
                    that.setData({
                        nocoupon:true
                    })
                }else{
                    that.setData({
                        nocoupon:false
                    })
                    let newArrayactive=[];
                    let newArrayexpired=[];
                    let newArrayused=[];
                    let newArrayusing=[];
                    for(let i=0;i<list.length;i++){
                        const FailureTime=list[i].effectiveFailureTime.split(" ")[0].split("-").join(".");
                        list[i].FailureTime=FailureTime;
                        if(list[i].expire==1){      
                            list[i].couponstatus='expired'
                        }else{
                            if(list[i].status==0){
                            list[i].couponstatus=''
                            }else if(list[i].status==1){
                            list[i].couponstatus='using'
                            }else{
                                list[i].couponstatus='used'
                            }
                        }

                        if(list[i].status=='0'&&list[i].expire==0){
                            newArrayactive.push(list[i])
                        }else if(list[i].expire==1){
                            newArrayexpired.push(list[i])
                        }else if(list[i].status==1){
                            newArrayusing.push(list[i])
                        }else{
                            newArrayused.push(list[i])
                        }
                    }
                    console.log(newArrayusing)
                        var newlist=newArrayactive.concat(newArrayusing).concat(newArrayused).concat(newArrayexpired)
                            console.log(newlist)
                        that.setData({
                            list:newlist,
                        })
                    }   
                    // console.log(that.data.list)
            }else{
                 common.unLogin(res);
            } 
        })
    },function(res) {
        that.setData({
            loadingflag:false
        })
        my.alert({content: res.error});     
    }) 
}
});
