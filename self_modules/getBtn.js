//pageNum:页面数
//pageCur:选中的页数
//btnNum:要显示的按钮数
//classOg:未选中的按钮样式
//classSel:选中的按钮样式
//classNone:不显示的按钮样式
//按键数要为奇数
module.exports={
           getBtn:function(pageNum,pageCur,btnNum,classOg,classSel,classNone)
		          {var btnConArr=[],btnClaArr=[],object={};
				   if(pageNum==0||pageCur>pageNum)
				   {for(let i=0;i<btnNum;i++)
					{btnConArr[i]='';
				     btnClaArr[i]='classNone';	   
					}
					object.content=btnConArr;object.class=btnClaArr;			   
					return  object; 
				    }
			       if(pageCur==1)
				    {btnConArr[0]=1;
			         btnClaArr[0]=classSel;
					 if(pageNum==1)
					 {for(let i=1;i<btnNum;i++)
					  {btnConArr[i]='';
				       btnClaArr[i]=classNone;}
					  }
					  else if(pageNum>1&&pageNum<btnNum)
					       {for(let i=1;i<btnNum;i++)
						    {btnConArr[i]=i<pageNum?i+1:'';
							 btnClaArr[i]=i<pageNum?classOg:classNone;}
							 btnConArr[pageNum]='>';
                             btnClaArr[pageNum]=classOg;
						    }
					   else{for(let i=1;i<btnNum;i++)
					        {btnConArr[i]=i+1;
				             btnClaArr[i]=classOg;}
							 btnConArr[btnNum-1]='>';
							 btnConArr[btnNum-2]=pageNum;
							 btnConArr[btnNum-3]=pageNum-1;
						     btnConArr[btnNum-4]='...';
					   }
					   
				   }
				   else if(pageCur>1&&pageCur==pageNum)
				   {btnConArr[0]='<';
			        btnClaArr[0]=classOg;
					if(pageNum<btnNum)
					{for(let i=1;i<btnNum;i++)
					{btnConArr[i]=i<=pageNum?i:'';
				     btnClaArr[i]=i<=pageNum?classOg:classNone;
					}
					 btnClaArr[pageNum]=classSel;}
					else{for(let i=1;i<btnNum;i++)
					     {btnConArr[btnNum-i]=pageNum+1-i;
				          btnClaArr[btnNum-i]=classOg;						  
					     }
						 btnClaArr[btnNum-1]=classSel;
						 btnConArr[1]=1;
						 btnConArr[2]=2;
						 btnConArr[3]='...';
					}
				   }
				   else{
					btnConArr[0]='<';
			        btnClaArr[0]=classOg;
					btnConArr[btnNum-1]='>';
			        btnClaArr[btnNum-1]=classOg;
					if(pageNum<btnNum-1)
					{for(let i=1;i<btnNum-1;i++)
				     {btnConArr[i]=i<pageNum+1?i:'';
					  btnClaArr[i]=i<pageNum+1?classOg:classNone;}					 
                      btnClaArr[pageCur]=classSel;
					}
					else{//当按键的顺序像以下的情况时:< 1 ... 4 5 6 ... 9 >
					     //两个...号之间能显示的按键数为btnNum-6
						 //distance为两个...号之间的按键，最左侧的按键和最右侧的按键离中间按键的距离，因此总按键数必须为奇数
						 //根据两个...号之间的按键的最左侧按键和最右侧按键离第一个按键和最后一个按键的距离来决定是否显示...号
						 let distance=(btnNum-7)/2;
                         if(pageCur-distance<4)
                         {for(let i=1;i<btnNum-3;i++)
						  {btnConArr[i]=i;
					       btnClaArr[i]=classOg;}
                           console.log(btnConArr)						   
						   btnClaArr[pageCur]=classSel;
						   btnConArr[btnNum-2]=pageNum;
						   btnClaArr[btnNum-2]=classOg;
						   btnConArr[btnNum-3]='...';
						   btnClaArr[btnNum-3]=classOg;
						 }							 
					     else if(pageNum-(pageCur+distance)<3)
					          {for(let i=btnNum-2,j=0;i>2;i--,j++)
						       {btnConArr[i]=pageNum-j;
					            btnClaArr[i]=classOg;}
								btnClaArr[btnNum-2-(pageNum-pageCur)]=classSel;
						        btnConArr[1]=1;
						        btnClaArr[1]=classOg;
						        btnConArr[2]='...';
						        btnClaArr[2]=classOg;
						       }
                         else{
							btnConArr[1]=1;
							btnConArr[2]='...';
							btnConArr[btnNum-2]=pageNum;
							btnConArr[btnNum-3]='...';
							for(let i=3,j=pageCur-distance;i<btnNum-3;i++,j++)
							{btnConArr[i]=j}
						    for(let i=1;i<btnNum-1;i++)
							{btnClaArr[i]=classOg;}
						     btnClaArr[(btnNum-1)/2]=classSel;
						 }							   
}
				   }                 				   
                    object.content=btnConArr;object.class=btnClaArr;			   
					return  object; 
				  }
}

