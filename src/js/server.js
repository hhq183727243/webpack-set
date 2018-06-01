module.exports = {
    getJSON: function(url,callback){
        $.ajax({
            url: url,
            type: 'get',
            traditional: true,
            success: function(result){
                if(typeof result != 'object'){
                    try{
                        result = JSON.parse(result);
                    }catch(e){
                        result = {
                            resCode: 500,
                            resDes: '返回数据非json格式'
                        }
                    }
                }

                if(200 == result.code){
                    if (typeof callback == 'function') callback(result);
                }else{
                    if(result.data == 'noLogin'){
                        window.location.href = 'user/login.html';
                    }else{
                        weui.alert(result.resDes);
                    }
                }
              }
        });
    },
    postJSON: function(url,data,callback){
        $.ajax({
            url: url,
            type: 'post',
            data: data,	
            traditional: true,
            success: function(result){
                if(typeof result != 'object'){
                    try{
                        result = JSON.parse(result);
                    }catch(e){
                        result = {
                            resCode: 500,
                            resDes: '返回数据非json格式'
                        }
                    }
                }

                if(200 == result.code){
                    if (typeof callback == 'function') callback(result);
                }else{
                    if(result.data == 'noLogin'){
                        window.location.href = 'user/login.html';
                    }else{
                        weui.alert(result.resDes);
                    }
                }
              }
        });
    }
}