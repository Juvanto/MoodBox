module.exports={
	getTime:function(){
		var change=function(a){
			if(a<10){return '0'+a}
			else{return ''+a}	
		}
		var date=new Date(),
		    year=change(date.getFullYear()),
			month=change(date.getMonth()+1),
			day=change(date.getDate()),
            hour=change(date.getHours()),
            minute=change(date.getMinutes()),
			second=change(date.getSeconds());
			return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;				
	}
}