<template>
  <div>
    <el-container>
      <el-header id="tool">
        <top-bar></top-bar>
      </el-header>

      <el-container>
        <el-aside> 
          <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <el-menu-item index="1" @click="addUMLLinkDialogVisible = true">
                    <i class="el-icon-document"></i>
                    <span slot="title">添加UML图关联</span>
                </el-menu-item>
                <el-menu-item index="2" @click="addCodeFileLinkDialogVisible = true">
                    <i class="el-icon-document"></i>
                    <span slot="title">添加代码文件关联</span>
                </el-menu-item>
                <el-menu-item index="3" >
                    <i class="el-icon-document"></i>
                    <span slot="title">自动生成UML图</span>
                </el-menu-item>
                <div
                class="centerDiv"
                v-show="activeIndex == '1'"
                >

                </div>
                <div
                class="centerDiv"
                v-show="activeIndex == '2'"
                >
                </div>
            </el-menu>

        </el-aside>
        <el-main>
          <div class="mainBody">
            <div class="top">
              <el-card class="box-card top-card">
                <div slot="header" class="clearfix">
                  <span>需求内容</span>
                  <!-- <el-button style="float: right; padding: 3px 0" type="text"
                    >操作按钮</el-button
                  > -->
                </div>
                <!-- <div v-for="o in 8" :key="o" class="text item">
                  {{ "列表内容 " + o }}
                </div> -->
                 <div class="text">需求名称：{{ requirementForm.rname }}</div>
                <div class="text">需求描述：{{ requirementForm.description }}</div>
                <div class="text">需求类型领域：{{ requirementForm.rtype }}</div>
                <div class="text">需求优先级：{{ requirementForm.priority }}</div>
           
              </el-card>
            </div>
            <div class="bottom">
              <!-- <div class="bt-1"> -->
                <el-card class="box-card card-1">
                  <div slot="header" class="clearfix">
                    <span>关联的UML图</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                      @click="addUMLLinkDialogVisible = true">添加关联</el-button
                    >
                  </div>
                   <el-table
                    :data="filePicList" stripe
                    style="width: 100%">
                    <el-table-column
                      prop="fileName"
                      label="UML名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="fileType"
                      label="UML类型"
                      width="180">
                    </el-table-column>
                      <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button  type="text" size="small">查看</el-button>
                      <el-button type="text" @click="deleteLinkFilePic(scope.row)" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                  </el-table>
                  <!-- <div v-for="item in filePicList" :key="item.fid" class="text item">
                    {{ "UML名称： "+ item.fileName }}
                    {{ "UML类型： "+ item.fileType }}
                  </div> -->
                </el-card>
              <!-- </div> -->
              <!-- <div class="bt-2"> -->
                <el-card class="box-card card-2">
                  <div slot="header" class="clearfix">
                    <span>关联的代码文件</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                      @click="addCodeFileLinkDialogVisible = true" >添加关联</el-button
                    >
                  </div>
                  <el-table
                    :data="codeFileList" stripe
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="文件名称"
                      width="180">
                    </el-table-column>
                      <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button  type="text" size="small">查看</el-button>
                      <el-button type="text" @click="deleteLinkCodeFile(scope.row)" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                  </el-table>
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
            <el-button type="primary" @click="createLinkRequirementUml">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
            title="新增代码文件的关联"
            :visible.sync="addCodeFileLinkDialogVisible"
            width="30%"
        >
        <el-form
            ref="requirementForm"
            :model="requirementForm"
            label-width="80px"
            style="width: 300px;"
        >
            <el-select v-model="selectedCodefidList" clearable multiple  placeholder="请选择代码文件图">
            <el-option
              v-for="item in allCodeFileList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCodeFileLinkDialogVisible = false">取 消</el-button>
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
      fileName:"",
      fidList:[],
      selectedCodefidList:[],
      dialogVisible: false,
      addUMLLinkDialogVisible: false,
      addCodeFileLinkDialogVisible:false,
      newMembers: [],
      activeIndex: "0",
      userList: [],
      requirementForm: [],
      filePicList:[],
      allFilePicList:[],
      allCodeFileList:[],
      codeFileList:[],
    };
  },
  mounted() {
    this.getRequirementInfo();
    this.getLinkFilePicByRid();
    this.getLinkCodeFileByRid();
    this.getAllFilePicByPid();
    this.getAllCodeFileByPid();
  },
  methods: {
    createLinkRequirementCodeFile() {
        var self = this;
      console.log(self.$store.state.UML.uid);
      console.log(self.selectedCodefidList);
      var len = self.selectedCodefidList.length;
      for(var i = 0; i < len; i++) {
        
      self.$axios.get("/createLinkRequirementCodeFile", {
        params:{
          rid : self.$store.state.UML.rid,
          codefid : self.selectedCodefidList[i],
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
    getAllCodeFileByPid() {
      var self = this;
      self.$axios.get("/getProjectFilesNoDirectoryByPid", {
        params:{
          pid : self.$store.state.UML.pid,
        }
      }).then(function(response) {
         
            self.allCodeFileList = response.data;
            console.log("all code file list");
            console.log(self.allCodeFileList);
      })
      .catch(function(error) {
          console.log("error:" + error);
      });
    },
    deleteLinkCodeFile(row) {
      var self = this;
      console.log(row);
      self.$axios.get("/deleteLinkRequirementCodeFileByRidAndCodefid", {
        params:{
          codefid : row.id,
          rid : self.$store.state.UML.rid,
        }
      }).then(function(response) {
          self.$message({
              message: "删除成功",
              type: "success",
            });
            self.getLinkCodeFileByRid(self.$store.state.UML.rid,);
            self.$emit("refresh");
      })
      .catch(function(error) {
        self.$message({
              message: "删除失败",
              type: "success",
            });
          console.log("error:" + error);
      });
      self.getLinkFilePicByRid();
    },
    deleteLinkFilePic(row) {
      var self = this;
      console.log(row);
      self.$axios.get("/deleteLinkRequirementUmlByRidAndFid", {
        params:{
          fid : row.fid,
          rid : self.$store.state.UML.rid,
        }
      }).then(function(response) {
          self.$message({
              message: "删除成功",
              type: "success",
            });
            self.getLinkFilePicByRid();
            self.$emit("refresh");
      })
      .catch(function(error) {
        self.$message({
              message: "删除失败",
              type: "success",
            });
          console.log("error:" + error);
      });
      self.getLinkFilePicByRid();
    },
    createLinkRequirementUml() {
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
    handleSelect(key, keyPath) {
            this.activeIndex = key;
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
    getLinkCodeFileByRid() {
      var self = this;
      self.$axios.get("/getLinkCodeFileByRid", {
        params:{
          rid : self.$store.state.UML.rid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.codeFileList = response.data;
          console.log(self.codeFileList);
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
    getRequirementInfo() {
      var self = this;
      self.$axios.get("/getRequirementByRid", {
        params:{
          rid : self.$store.state.UML.rid,
        }
      }).then(function(response) {
          console.log("success:");
          console.log(response);
          self.requirementForm = response.data;
          console.log(self.requirementForm.description);

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
    deleteRequirement() {
      console.log("delete requirement", this.rid);
      if (this.rid <= 0) {
        return;
      }
      var self = this;
      this.$axios
        .get("/deleteRequirement", { params: { rid: self.rid } })
        .then(function (response) {
          console.log("delete requirement res:", response.data);
          if (response.data) {
            self.$message({
              message: "删除成功",
              type: "success",
            });
            self.$emit("refresh");
          } else {
            self.$message({
              message: "出现错误",
              type: "error",
            });
          }
        })
        .catch(function (error) {
          console.log("error:", error);
        });
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
  height: 30%;
  margin-right: 20px;
}

.card-2{
  width: 400px;
  height: 30%;
}

.top-card {
 width: 80%;
 height: 40%;
}
</style>
