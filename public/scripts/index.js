function emptyCheck(id)
{var $array=$('#'+id).find('input');
 var $len=$array.length;
 for(let i=0;i<$len;i++)
 {
  if(($array[i].type=='text'||$array[i].type=='password')&&!$array[i].value)
    {return false}
     else{continue}
                     }
     return true;
	                      }	
						  
function formatCheck()
{var pattern=/[^0-9a-zA-Z]/g;
 var $account=$('#account').val(),$password=$('#password').val();
 if(pattern.test($account))
 {return false}
 else if(pattern.test($password))
 {return false}
 else{return true} 
} 


function lengthCheck()
{
 var $account=$('#account').val().length,
     $password=$('#password').val().length;
 if($account>15||$account<7||$password<7||$password>15)
 {return false}
  else{return true} 
}
	 
$('#signbu').click(function(){
	var $warning=$('#warning');
    if(!emptyCheck('logform'))
	{setp('账号或密码不能为空！');
     return false;}
	else if(!lengthCheck())
	{setp('账号和密码的长度均应在7-15位！');
     return false;}
	else if(!formatCheck())
	{setp('账号和密码只能由数字和大小写字母组成！');
     return false;}
	 else if(!isNaN(Number($('#account').val()[0])))
	{setp('账号不能以数字开头！');
     return false;}	 
     else{
		   $.post('/signin',$('#logform').serialize(),
		                    function(data){$warning.text(data)})
	 }	 
	}
	)
	 
$('#logbu').click(function(){
	var $warning=$('#warning');
    if(!emptyCheck('logform'))
	{setp('账号或密码不能为空！');
     return false;}
	else if(!lengthCheck()||!formatCheck()||!isNaN(Number($('#account').val()[0])))
	{setp('账号或密码不正确！');
     return false;} 
     else{
		   $.post('/login',$('#logform').serialize(),
		                    function(data){
								setp(data.message);								
								if(data.url){window.location.href=data.url;}
								}								
								)
	 }	 
	}
	)
function setp(str){$('#warning').text(str);}
$('#account').focus();
$('#account').focus(function(){setp('')});
$('#password').focus(function(){setp('')});
$('#account').keypress(function(event){if(event.keyCode=='13')
	                                    {$('#logbu').click();}
									    else{return}})
$('#password').keypress(function(event){if(event.keyCode=='13')
	                                    {$('#logbu').click();}
									    else{return}})


	
