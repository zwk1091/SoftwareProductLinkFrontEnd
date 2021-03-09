<template>
  <codemirror
          ref="codeMirros"
          :value="value"
          :options="codeMirrosOptions"
          class="code">
  </codemirror>
</template>

<script>
  import { codemirror } from 'vue-codemirror'
  require("codemirror/mode/python/python.js")
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/xml-fold.js')
  require('codemirror/addon/fold/indent-fold.js')
  require('codemirror/addon/fold/markdown-fold.js')
  require('codemirror/addon/fold/comment-fold.js')

  export default {
    name: "codeMirros",
    components: {
      codemirror
    },
    props: {
      value:{
        type: String,
        required: true,
        default: '',
      }
    },
    data() {
      return {
        codeMirrosOptions:{
          value:'',
          theme:'darcula', //主题
          indentUnit:2,
          smartIndent:true,
          tabSize:4,
          readOnly:true, //只读
          showCursorWhenSelecting:true,
          lineNumbers:false, //是否显示行数
          firstLineNumber:1
        },
        resArr: '',
      };
    },
    mounted() {

    },
    methods: {

    }
  };
</script>
