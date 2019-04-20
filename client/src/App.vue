<template>
  <div id="app">
    <h1>TODO   LIST</h1>
    <ul>
      <li id="add-contain">
        <form id="add-form" @submit.prevent="add">
          <input
              type="text"
              id="add-input"
              placeholder="     write sth to do ..."
          >
        </form>
      </li>
      <li v-for="(thing,index) in things"
          :key = index class="single-thing">
        <span :id=thing.id>
          <label>
            <input class="check-box" type="checkbox"
                   @click="check"
                  :checked="thing.status===1">
          </label>
          <span
              :class="thing.status===1?'title-span checked':'title-span'"
              @dblclick="edit($event)"
          >
              {{thing.title}}</span>
            <span class="del-btn" @click="del(thing.id)">×</span>
        </span>
        <span class="input-span">
          <input type="text" id="edit-thing" title="editThing"
                 :value="thing.title">
        </span>
      </li>
      <li class="tools-bar">
        <div id="tools-contain">
          <div class="things-left">{{all_count}} things to do</div>
          <input type="button" class="btn-All" value="All" @click="getAll">
          <input type="button" class="btn-Complete" value="Complete" @click="getComplete">
          <input type="button" class="btn-Active" value="Active" @click="getActive">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        curPattern:0,
        all_count:0,
        things : [
        ]
      }
    },
    created (){
      this.getAll();
    },
    methods : {

      /*获取事件*/
      getThings(){
        this.$http.get('/api/all').then((response)=>{
          this.things = response.body.map((item)=>{
            return {
              id : item.thing_id,
              title : item.thing_title,
              status : item.thing_status
            }
          });

          /*根据当前的位置过滤获取的事件*/
          // 过滤掉未完成的
          if(this.curPattern === 1)
            this.things = this.things.filter(val=>val.status!==0);
          // 过滤掉已完成
          else if(this.curPattern === 2)
            this.things = this.things.filter(val=>val.status===0);

          this.all_count = 0;
          this.things.forEach((val)=>{
            if(val.status === 0)
              this.all_count ++;
          })
        },(err)=>{
          throw err;
        })
      },
      getAll(){
        this.curPattern = 0;
        this.getThings();
      },
      getComplete(){
        this.curPattern = 1;
        this.getThings();
      },
      getActive(){
        this.curPattern = 2;
        this.getThings();
      },

      // 增删改查
      add(e){
        let curTar = e.currentTarget.firstElementChild;
        let curText = curTar.value;
        this.$http.post('/api/add',{title:curText}).then(
            ()=>{
              curTar.value = "";
              this.getThings();
            },
            (err)=>{throw err;}
        );
      },
      check(e) {
        let cur = e.currentTarget;
        this.$http.get('/api/fetch?id=' + cur.parentElement.parentElement.id).then((res)=>{
              let curThing = {};
              curThing.title = res.body[0]['thing_title'];
              curThing.id = res.body[0]['thing_id'];
              curThing.status = res.body[0]['thing_status'];
              //勾选
              if(cur.checked !== false){
                curThing.status = 1;
              }
              else{
                curThing.status = 0;
              }
              this.$http.post('/api/edit',curThing).then(()=>{
                this.getThings();
              },(err)=>{
                throw err;
              });
            },
            (err)=>{
              throw err;
            }
        );
      },
      del(id) {
        this.$http.get('/api/del?id=' + id).then(()=>{
          this.getThings();
        },err=>{
          throw err;
        });
        // changeCount();
      },
      edit(e){
        let textTar = e.currentTarget;
        let parTar = textTar.parentElement;
        let sourceTar = parTar.nextElementSibling;
        let inputTar = sourceTar.getElementsByTagName("input")[0];

        parTar.style.display = "none";
        sourceTar.style.display = "block";
        inputTar.focus();
        inputTar.onblur = ()=>{
          //修改数据
          this.$http.get('/api/fetch?id=' + parTar.id).then((res)=>{
                let curThing = {};
                curThing.title = inputTar.value;
                curThing.id = res.body[0].thing_id;
                curThing.status = res.body[0].thing_status;
                this.$http.post('/api/edit',curThing).then(()=>{
                  this.getThings();
                },(err)=>{
                  throw err;
                });
              },
              (err)=>{
                throw err;
              }
          );

          parTar.style.display = "block";
          sourceTar.style.display = "none";
        }

      }
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    box-sizing: border-box;
  }

  h1 {
    font-size: 40px;
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: inline-block;
    position: center;
    box-shadow: 1px 2px 3px 4px;
  }

  li {
    width: 500px;
    height: 70px;
    border-bottom: 1px solid rgba(161, 161, 161, 0.7);
    display: block;
    line-height: 70px;
  }

  form{
    width: 100%;
    height: 100%;
  }

  #add-input{
    outline: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 30px;
  }

  .check-box{
    outline: none;
    border: 1px inset grey;
    margin: auto 0;
    height: 25px;
    width: 25px;
  }

  .title-span{
    font-size: 25px;
    display: inline-block;
    width: 80%;
  }

  .del-btn{
    visibility: hidden;
    width: 4%;
    position: relative;
    font-size: 40px;
  }

  .single-thing:hover .del-btn{
    visibility: visible;
  }

  .checked{
    opacity: .5;
    text-decoration: line-through;
  }

  .things-left{
    display:inline-block;
    position: relative;
    left: -30px;
  }

  .tools-bar{
    height: 50px;
    line-height: 50px;
  }

  .btn-All,.btn-Complete,.btn-Active{
    position: relative;
    left: 40px;
    width: 90px;
  }

  .input-span{
    width: 488px;
    height: 90%;
    display: none;
    position: relative;
    margin: 0;
    padding: 0;
  }

  #edit-thing{
    width: 100%;
    height: 100%;
    font-size: 25px;
  }
</style>
