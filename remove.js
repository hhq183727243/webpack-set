var fs=require("fs");

//移动
fs.rename('./dist/dist.tar.gz','C:/Program Files/project/zhaorouBD/static/dist.tar.gz',function(err){
   if(err){
     throw err;
   }
});