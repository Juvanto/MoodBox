//上传个人资料模块
//GetLength函数获取字符串长度，汉字为两个字符长
GetLength = function(str)   
{  
    var realLength = 0;  
    for (var i = 0; i < str.length; i++)   
    {  
        charCode = str.charCodeAt(i);  
        if (charCode >= 0 && charCode <= 128)   
        realLength += 1;  
        else   
        realLength += 2;  
    }  
    return realLength;  
} 

$('#changeClick').click(
                  function(){$('#changeInfor').show(500); 
                             $('#inforFormName').val($('#selfName').text());
							 $('#inforFormSign').val($('#selfSign').text());				  
				 })
				 
$('#inforFormCancel').click(function(){$('#inforFormWarn').text('');                                       
	                                   $('#changeInfor').hide(500);
                                       })
									   
$('#inforFormHead').click(function(){$('#inforFormWarn').text('');
	                                 $('#inforFormFile').click();})
									 
/*type为file的input改变时触发change事件*/									 
$('#inforFormFile').change(
                       function(){
						     //获取文件
						 var photo = this.files[0],
						     pat=/image\/\w+/,
						     //计算文件大小，MB为单位	 
							 size = Math.round(photo.size / 1024 / 1024);
							 //通过type属性获得文件类型
                         if(!pat.test(photo.type))							  
						     {$('#inforFormWarn').text('请上传正确的图片文件！');
                              return false;} 
                         if(size>2){$('#inforFormWarn').text('请上传小于2M的图片文件！');
						            return false;}
						//HTML5 API FileReader()					
						 var reader = new FileReader();
                        //读取文件						 
						 reader.readAsDataURL(photo);
						//文件读取成功调用，文件以base64形式存在，可直接用作URI
                         reader.onload=function(){
						     base64Code=this.result; 
						     //预览图片	 
							 $("#inforFormShow").attr("src",base64Code);
							 $('#inforFormWarn').text('读取图片文件成功！');}						 
					   })
$('#inforFormSure').click(
                          function(){
							var $name=$('#inforFormName').val(),
  							    $sign=$('#inforFormSign').val();
							if(!$name)
							{$('#inforFormWarn').text('昵称不能为空！');
						     return false;}
						    else if(GetLength($name)>18)
							{$('#inforFormWarn').text('昵称请控制在9个汉字或18个英文字符内！');
						     return false;}
							if(GetLength($sign)>30)
							{$('#inforFormWarn').text('签名请控制在15个汉字或30个英文字符内！');
						     return false;}
							$('#inforForm').submit();
						  })
						  
$('#inforFormName').focus(function(){$('#inforFormWarn').text('')})
$('#inforFormSign').focus(function(){$('#inforFormWarn').text('')})


//little-thoughts模块
//提交一个little-thoughts
$('#littleSubmit').click( 
                         function(){
						  var $content=$('#thoughts').val();
						  if(!$content)
						  {$('#littleWarn').text('内容为空！')}
					      else if(GetLength($content)>140)
						  {$('#littleWarn').text('请控制在70字内！')}
					      else{$('#littleForm').submit();}
						  }
)
$('#thoughts').focus(function(){$('#littleWarn').text('')});





//文章全文模块，以mode为前缀
$('#modeBackHome').click(
                       function(){
					   window.location.href='/homepage';
	                          
});


//删除一个mood	
$('#modeDelete').click(
               function(){
				var number=$(this).data('number');                          
               if(number)
			   {var message=confirm('确定要删除这个mood吗？');
				if(message==true)
				{window.location.href='/homepage/delete?moods_number='+number}
			    else{return false}
				} 
                else{return false}				
			   }
			   )					  
						  
//编辑一个mood
$('#modeEditBtn').click(
                    function(){
					var title=$('#modeTitle').text();	
					var content=$('#modeContent').text();
					$('#modeArticle').toggleClass('mode-article-none');
 					$('#modeEdit').toggleClass('mode-edit');
					$('#modeEdit .mode-edit-title').val(title);
                    $('#modeEdit .mode-edit-content').val(content);					
					}
)					  
						  
$('#modeEditSubmit').click(
	                       function(){
						   var number=$(this).data('number');
						   console.log(number)
						   $('#modeEditForm').attr('action','/homepage/moods/moods_edit?moods_number='+number);
						   $('#modeEditForm').submit();		   
						   }
)						  
						  
						  
$('#modeEditCancel').click(
	                       function(){
						  $('#modeArticle').toggleClass('mode-article-none');
 					      $('#modeEdit').toggleClass('mode-edit');
					      $('#modeEdit .mode-edit-title').val('');
                          $('#modeEdit .mode-edit-content').val('');		   
						   }
)							  
						  
						  
						  
						  
						  
						  
						  