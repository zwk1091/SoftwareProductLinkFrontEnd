<template>
  <div>
    <el-container>
      <el-header id="tool">
        <top-bar></top-bar>
      </el-header>

      <el-container>
        <el-aside> 
          <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <el-menu-item index="1">
                    <i class="el-icon-document"></i>
                    <span slot="title">添加需求关联</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-document"></i>
                    <span slot="title">添加UML图关联</span>
                </el-menu-item>
            </el-menu>

        </el-aside>
        <el-main>
          <div class="mainBody">
            <div class="top">
              <el-card class="box-card top-card">
                <div slot="header" class="clearfix">
                  <span>代码内容</span>
                  <!-- <el-button style="float: right; padding: 3px 0" type="text"
                    >操作按钮</el-button
                  > -->
                </div>
                 <!-- <div class="text">代码名称：{{ requirementForm.rname }}</div> -->
                
           
              </el-card>
            </div>
            <div class="bottom">
              <!-- <div class="bt-1"> -->
                <el-card class="box-card card-1">
                    <div slot="header" class="clearfix">
                    <span>关联的需求</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                      @click="addRequirementLinkDialogVisible = true">添加关联</el-button
                    >
                  </div>
                  <div v-for="item in linkRequirementList" :key="item.rid" class="text item list-files">
                    {{ "需求名称: " + item.rname }}
                  </div>
                  
                </el-card>
                <el-card class="box-card card-2">
                  <div slot="header" class="clearfix">
                    <span>关联的UML图</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                     @click="addUMLLinkDialogVisible = true" >添加关联</el-button
                    >
                  </div>
                  <div v-for="item in filePicList" :key="item.fid" class="text item">
                    {{ "UML名称： "+ item.fileName }}
                    {{ "UML类型： "+ item.fileType }}
                  </div>
                </el-card>
              <!-- </div> -->
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog
            title="新增UML的关联"
            :visible.sync="addUMLLinkDialogVisible"
            width="30%"
        >
        <el-form
            ref="requirementForm"
            :model="requirementForm"
            label-width="80px"
            style="width: 300px;"
        >
            <el-select v-model="fidList" clearable multiple  placeholder="请选择UML图">
            <el-option
              v-for="item in allFilePicList"
              :key="item.fid"
              :label="item.fileName"
              :value="item.fid">
              <span style="float: left">{{ item.fileName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fileType }}</span>
            </el-option>
          </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addUMLLinkDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="createLinkCodefileUml">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
            title="新增需求的关联"
            :visible.sync="addRequirementLinkDialogVisible"
            width="30%"
        >
        <el-form
            ref="requirementForm"
            :model="requirementForm"
            label-width="80px"
            style="width: 300px;"
        >
            <el-select v-model="selectedRidList" clearable multiple  placeholder="请选择需求">
            <el-option
              v-for="item in allRequirementList"
              :key="item.rid"
              :label="item.rname"
              :value="item.rid">
           </el-option>
          </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRequirementLinkDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="createLinkRequirementCodeFile">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
import TopBar from "./TopBar.vue";
export default {
  name: "RequirementDetailPanel",
  components:{TopBar},
  props: {
    rname: {
      type: String,
      default: "undefine",
    },
    description: {
      type: String,
      default: "undefine",
    },
    rtype: {
      type: String,
      default: "undefine",
    },
    priority: {
      type: Number,
      default: "undefine",
    },
    rid: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      dialogVisible: false,
      newMembers: [],
      userList: [],
      codeFileForm: [],
      filePicList:[],
      codeFileList:[],
      requirementList:[],
      addUMLLinkDialogVisible: false,
      addRequirementLinkDialogVisible: false,
      allFilePicList:[],
      allRequirementList:[],
      selectedCodefidList:[],
      selectedRidList:[],
      linkRequirementList:[],
      requirementForm: [],
    };
  },
  mounted() {
      this.getAllFilePicByPid();
      this.getAllRequirementByPid();
  },
  methods: {
    createLinkRequirementCodeFile() {
        var self = this;
        console.log(self.$store.state.UML.uid);
        console.log("createLinkRequirementCodeFile")
        var len = self.selectedRidList.length;
        for(var i = 0; i < len; i++) {
            self.$axios.get("/createLinkRequirementCodeFile", {
            params:{
            rid : self.selectedRidList[i],
            codefid : self.$store.state.UML.codefid,
            uid : self.$store.state.UML.userId,
            }
      }).then(function(response) {
          self.$message({
              message: "添加成功",
              type: "success",
            });
            self.getLinkCodeFileByRid();
            self.$emit("refresh");
      })
      .catch(function(error) {
          self.$message({
              message: "添加失败",
              type: "success",
            });
          console.log("error:" + error);
      });
      }
      self.addCodeFileLinkDialogVisible = false;
    },

    getAllRequirementByPid() {
        var self = this;
        self.$axios.get("/getAllRequirementByPid", {
        params:{
          pid : self.$store.state.UML.pid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.allRequirementList = response.data;
          console.log(self.allRequirementList);
      })
      .catch(function(error) {
          console.log("error:" + error);
      });
    },
    getAllFilePicByPid() {
    var self = this;
    self.$axios.get("/getAllFilePicByPid", {
        params:{
          pid : self.$store.state.UML.pid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.allFilePicList = response.data;
          console.log(self.allFilePicList);
      })
      .catch(function(error) {
          console.log("error:" + error);
      });
    },
    createLinkCodefileUml() {
      var self = this;
      console.log(self.$store.state.UML.uid);
      console.log(self.fidList);
      var len = self.fidList.length;
      for(var i = 0; i < len; i++) {
        
      self.$axios.get("/createLinkRequirementUml", {
        params:{
          rid : self.$store.state.UML.rid,
          fid : self.fidList[i],
          uid : self.$store.state.UML.userId,
        }
      }).then(function(response) {
          self.$message({
              message: "添加成功",
              type: "success",
            });
            self.getLinkFilePicByRid();
            self.$emit("refresh");
      })
      .catch(function(error) {
          self.$message({
              message: "添加失败",
              type: "success",
            });
          console.log("error:" + error);
      });
      }
      
      self.addUMLLinkDialogVisible = false;
    },
    getLinkRequirementByCodefid() {
        var self = this;
        self.$axios.get("/getLinkRequirementByCodefid", {
        params:{
          codefid : self.$store.state.UML.codefid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.linkRequirementList = response.data;
          console.log(self.linkRequirementList);
      })
      .catch(function(error) {
          console.log("error:" + error);
      });
    },
    getLinkFilePicByRid() {
      var self = this;
      self.$axios.get("/getLinkFilePicByRid", {
        params:{
          rid : self.$store.state.UML.rid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.filePicList = response.data;
          console.log(self.filePicList);
      })
      .catch(function(error) {
          console.log("error:" + error);
      });
    },
    handleClick() {
      this.dialogVisible = true;
      this.getAllUser();
    },
    getAllUser() {
      var self = this;
      this.$axios
        .get("/getAllUser", {
          params: {
            uid: self.$store.state.UML.userId,
            gid: this.gid,
          },
        })
        .then(function (response) {
          console.log(
            "getAllUser:",
            self.$store.state.UML.userId,
            response.data
          );
          self.userList = response.data;
        })
        .catch(function (error) {
          console.log("error:" + error);
        });
    },
    inviteUser() {
      var self = this;
      this.$axios
        .post("/inviteUser", {
          gid: self.gid,
          userEmailList: self.newMembers,
        })
        .then(function (response) {
          console.log(response.data);
          self.newMembers = [];
          self.$emit("refresh");
        })
        .catch(function (error) {
          console.log("error:" + error);
        });

      this.dialogVisible = false;
    },

  },
};
</script>

<style >

#tool {
    width: 100%;
    height: auto;
    margin-top: 1%;
    display: block;
}

.text {
  font-size: 12px;
}

.item {
  margin-bottom: 10px;
}

.list {
  overflow-y: auto;
  height: 100px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 240px;
  height: 190px; */
  display: inline-block;
  /* margin: 10px; */
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 480px; */
}

.top {
 /* height: 300px; */
}

.bottom {
  /* margin-top: 200px; */
  display: flex;
}



.card-1{
  width: 70%;

  margin-right: 20px;
}

.card-2{
width: 400px;
}

.top-card {
 width: 70%;
 height: 40%;
}
</style>
