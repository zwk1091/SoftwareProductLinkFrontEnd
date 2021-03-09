<template>
<li>
        <div

          :class="{bold: isFolder}"   
                                      
          @click="toggle"       
          @dblclick="changeType">     
          {{model.name}}
          <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
          <item
            class="item"
            
            v-for="model in model.children"
            :model="model" :key="model">
          </item>
          <li class="add" @click="addChild">+</li>
        </ul>
</li>

</template>

<script>
var data = {
  name: 'vueDemo',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}
export default {
    name: 'vueDemo',
  template: '#item-template',
  props: {
    model: Object ,  //将文件数据通过props传入
    data: {
    treeData: data
  }
  },
  data: function () {
    
    return {
      open: false       //open表示文件夹闭合状态
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length
    }
  },    //计算对象是否有子节点并且子节点数大于0来判断是否是文件夹
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },              //控制文件夹闭合的方法 单击触发改变open
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },   //双击触发，通过给文件增加子节点来使文件属性变成文件夹
    addChild: function () {
      this.model.children.push({
        name: 'new stuff'
      })     //点击文件夹里的+节点触发  为文件夹添加一个新文件
    }            
  }
}

</script>

<style scoped>
 body {
        font-family: Menlo, Consolas, monospace;
        color: #444;
      }
      .item {
        cursor: pointer;
      }
      .bold {
        font-weight: bold;
      }
      ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
      }
</style>


