
    Vue.component('result-list',{
    props:["message"],
    computed:{
        star_num:function(){
            var num=this.message.stargazers_count
            if(parseInt(num)>1000){
                return (this.message.stargazers_count/1000).toFixed(1)+'k'
            }else{
                return num
            }
       
        }
    },
    template: `
  <div class="result_list clearfix">
    <div class="result_content">   
        <h3 class="title"><a>{{message.full_name}}</a></h3>
        <p class="description">{{message.description}}</p>
    </div> 
    <div class="result_language">
        <span class="C" v-if="message.language=='C'">  </span>
        <span class="Shell" v-if="message.language=='Shell'">  </span>
        <span class="HTML" v-if="message.language=='HTML'">  </span>
        <span class="JavaScript" v-if="message.language=='JavaScript'">  </span>
        <span class="Ruby" v-if="message.language=='Ruby'">  </span>
        <span class="Python" v-if="message.language=='Python'">  </span>
        <span class="CPlusPlus" v-if="message.language=='C++'">  </span>
        <span class="Cjing" v-if="message.language=='C#'">  </span>
        <span class="CSS" v-if="message.language=='CSS'">  </span>
        <span class="GO" v-if="message.language=='GO'">  </span>
        <span class="Scala" v-if="message.language=='Scala'">  </span>
        <span class="language">{{message.language}}</span>
    </div>
    <div class="result_star">
        <div class="star"> <img src="./images/star.jpg" wdith="30px" height="30px" > </div>
        <p class="starNum">{{this.star_num}}</p>
    </div>
  </div>`
});

   var vue_search=new Vue({
        el:'#search',
        data:{
            search_word:'git',
        },
        methods:{
            searchMethod:function(){
                console.log(this.search_word)
                vue_result.search_word=this.search_word
            }
        }
   })


   var vue_result= new Vue({
        el:'#result',
        data:{
            search_word:'git',
            total:0,
            allData:{},
            page:1
          
        },
        computed:{
            total_format:function(){              
                var reg=/\d{1,3}(?=(\d{3})+$)/g;   
                return (this.total + '').replace(reg, '$&,');  
                
            },
            pageChange:function(){
                if(JSON.stringify(this.allData)!=='{}')  return this.allData[0]['full_name']
            
            }
        },
        watch:{
            search_word: {
                handler(newName) {
                var script = document.createElement('script');
                script.src = 'https://api.github.com/search/repositories?q='+this.search_word+'&callback=foo&page='+this.page+'&per_page=6';
                document.getElementsByTagName('head')[0].appendChild(script);
           
                }
              
            },
            page:{
                handler(newname){
                    console.log(newname)
                    var script = document.createElement('script');
                script.src = 'https://api.github.com/search/repositories?q='+this.search_word+'&callback=foo&page='+this.page+'&per_page=6';
                document.getElementsByTagName('head')[0].appendChild(script);
              
                }
            }


        },
        beforeCreate(){
                var script = document.createElement('script');
                script.src = 'https://api.github.com/search/repositories?q=git&callback=foo&page=1&per_page=6';
                document.getElementsByTagName('head')[0].appendChild(script);
        },
        updated(){
         
             
        }
    })


          
   

    function foo(response) {
        var meta = response.meta;
        var data = response.data;
        console.log(meta);
        console.log(data);
        if(  vue_result.total!== data.total_count){
          vue_result.total=data.total_count
          layui.use('laypage', function(){
              var laypage = layui.laypage;
              //调用分页
              laypage.render({
                elem: 'pagination'
                ,count: data.total_count
                ,limit:6
                ,prev:"Previous"
                ,next:'Next'
                ,theme:'#0366D6'
                ,jump: function(obj, first){
      
                   if(!first){ 
                    var script = document.createElement('script');
                    script.src = 'https://api.github.com/search/repositories?q='+vue_result.search_name+'&callback=foo&page='+obj.curr+'1&per_page=6';
                    document.getElementsByTagName('head')[0].appendChild(script);
                    }
      
                    console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    console.log(obj.limit); //得到每页显示的条数
                    console.log(first)
                }
              });
       
          })
        } 
        vue_result.allData=data.items
      
      }
  