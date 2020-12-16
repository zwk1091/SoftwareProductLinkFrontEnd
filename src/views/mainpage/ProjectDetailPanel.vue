<template>
    <div>
        
        <div style="display: flex">
            <el-container>
            <el-header id="tool">
                <top-bar></top-bar>
            </el-header>
            <el-container class="mainBody">
            <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <el-menu-item index="1">
                    <i class="el-icon-document"></i>
                    <span slot="title">项目详情</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">需求管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-menu"></i>
                    <span slot="title">UML图管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-menu"></i>
                    <span slot="title">代码管理</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <i class="el-icon-menu"></i>
                    <span slot="title">新建UML</span>
                </el-menu-item>
            </el-menu>
            <div
                class="centerDiv"
                v-show="activeIndex == '1'"
            >
                <div class="text">项目名称：{{ thisProject.pname }}</div>
                <div class="text">项目描述：{{ thisProject.pdescription }}</div>
                <div class="text">项目领域：{{ thisProject.pfield }}</div>
                <div class="text">项目语言：{{ thisProject.planguage }}</div>
                    <!-- <ProjectInfo  
                        v-for="item in thisProject"
                        :key="'pid:' + item.pid"
                        :pid="item.pid"
                        :pname="item.pname"
                        :description="item.pdescription"
                        :planguage="item.planguage"
                        :pfield="item.pfield"
                        @refresh="updateProjectInfoByPid()"
                    ></ProjectInfo> -->
            </div>
            <div
                class="centerDiv"
                v-show="activeIndex == '2'"
            >
                <el-card class="box-card">
                    <el-button
                        class="createBtn"
                        icon="el-icon-circle-plus-outline"
                        @click="dialogVisible = true"
                        >新建需求</el-button
                    >
                </el-card>
                <transition-group name="list-complete">
                    <RequirementInfo  
                        v-for="item in requirementList"
                        :key="'rid:' + item.rid"
                        :rid="item.rid"
                        :rname="item.rname"
                        :description="item.description"
                        :rtype="item.rtype"
                        :priority="item.priority"
                        @refresh="getAllRequirementByPid()"
                    ></RequirementInfo>
                </transition-group>
            </div>
            <div
                class="centerDiv"
                v-show="activeIndex == '3'"
            >
                 <transition-group name="list-complete">
                        <SingleFile
                            v-for="item in fileList"
                            :key="item.fid"
                            :fileName="item.fileName"
                            :fid="item.fid"
                            :fileType="item.fileType"
                            :gid="selectGid"
                            :src="item.refreshTime"
                            @refreshFileList="selectGroupFile(selectGid)"
                        ></SingleFile>
                </transition-group>
            </div>
            <div class="centerDiv" 
            v-show="activeIndex == '4'">
                <transition-group name="list-complete">
                   
                </transition-group>
            </div>

            <div
                class="detailContent"
                v-show="activeIndex == '5'"
                style="width: 300px; margin: 10px auto"
            >
                 <el-form ref="form" :model="form" label-width="80px" style="width: 300px;">
                    <el-form-item label="文件名称">
                        <el-input v-model="form.UMLName"></el-input>
                    </el-form-item>
                    <el-form-item label="UML类型">
                        <el-select v-model="form.UMLType" placeholder="请选择UML类型">
                            <el-option label="类图" value="CLASS_DIAGRAM"></el-option>
                            <el-option label="顺序图" value="SEQUENCE_DIAGRAM"></el-option>
                            <el-option label="组件图" value="COMPONENT_DIAGRAM"></el-option>
                            <el-option label="状态图" value="STATE_DIAGRAM"></el-option>
                            <el-option label="用例图" value="USECASE_DIAGRAM"></el-option>
                            <el-option label="部署图" value="DEPLOYMENT_DIAGRAM"></el-option>
                            <el-option label="实体关系图" value="ER_DIAGRAM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="float: right; margin-left: 5px" @click="resetUMLForm()">清空</el-button>
                        <el-button style="float: right" type="primary" @click="newfile">创建</el-button>
                    </el-form-item>
                </el-form>
            </div>

            </el-container>
            </el-container>
        </div>
        <PageFooter></PageFooter>
        <el-dialog
            title="新增一条需求"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <el-form
                ref="requirementForm"
                :model="requirementForm"
                label-width="80px"
                style="width: 300px;"
            >
                <el-form-item label="需求名称">
                    <el-input v-model="requirementForm.rname"></el-input>
                </el-form-item>
                <el-form-item label="需求类型">
                    <el-input v-model="requirementForm.rtype"></el-input>
                </el-form-item>
                <el-form-item label="需求优先级">
                    <el-input v-model="requirementForm.priority"></el-input>
                </el-form-item>
                <el-form-item label="详细描述">
                    <el-input v-model="requirementForm.description"></el-input>
                </el-form-item>
                <el-form-item label="图片说明Todo">
                    <!-- <el-input v-model="requirementForm.name"></el-input> -->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createRequirement">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TopBar from "./TopBar.vue";
import RequirementInfo from "./RequirementInfo";
import GroupInfo from "./GroupInfo.vue";
import SingleFile from "./SingleFile.vue";
import PageFooter from "../PageFooter.vue";
export default {
    name: "ProjectDetailPanel",
    components: {GroupInfo, SingleFile, PageFooter, RequirementInfo, TopBar},
    data() {
        return {
            dialogVisible: false,
            activeIndex: "1",
            requirementForm: {
                rname: "",
                descrrption: "",
                priority: "",
                rtype: "",
            },
            form: {
                rname: "",
                descrrption: "",
                rtype: "",
                priority: "",
            },
            thisProject: [],
            pid: -1,
            description: "",
            planguage: "",
            pfield: "",
            pname: "",
            fileList: [],
            requirementList : [],
            imgsrc: "http://qldvty1zf.hn-bkt.clouddn.com/"
        };
    },

    mounted() {
        this.getFileList();
        this.getAllGroup();
        // this.getAllRequirementByUid();
        this.getAllRequirementByPid();
        this.updateProjectInfoByPid();
        // this.createRequirement();
    },
    methods: {
        updateProjectInfoByPid() {
            console.log("update project by pid");
            var self = this;
            self.$axios
                .get("/getProjectByPid", {
                    params: {
                        pid: self.$store.state.UML.pid,
                    }
                })
                .then(function(response) {
                    console.log("success:");
                    console.log(response);
                    self.thisProject = response.data;
                    console.log(self.thisProject.pdescription);

                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        newfile() {
            var self = this;
            //console.log("personal:"+self.$store.state.UML.userId);
            self.$axios
                .get("/createFile", {
                    params: {
                        uid: self.$store.state.UML.userId,
                        fileName: self.form.UMLName,
                        fileType: self.form.UMLType
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.$store.commit("setUMLId", { id: response.data });
                    self.$store.commit("setGroupId", { groupId: -1 });
                    self.$store.commit("setUMLName", {
                        name: self.form.UMLName
                    });
                    self.$store.commit("setUMLType", {
                        type: self.form.UMLType
                    });
                    //清空Nodes
                    self.$store.commit("setUMLNodes", {
                        nodeList: []
                    });
                    //清空lines
                    self.$store.commit("setUMLLines", {
                        lineList: []
                    });
                    //console.log(self.$store.state.UML.UMLId);
                    //console.log(self.$store.state.UML.UMLName);
                    //console.log(self.$store.state.UML.UMLType);
                    self.$router.push({ name: "Designer" });
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        

        createRequirement() {
            var self = this;
            //console.log("personal:"+self.$store.state.UML.userId);
            self.$axios
                .get("/createRequirement", {
                    params: {
                        uid: self.$store.state.UML.userId,
                        pid: self.$store.state.UML.pid,
                        rname: self.requirementForm.rname,
                        description: self.requirementForm.description,
                        rtype: self.requirementForm.rtype,
                        // pdescription
                        priority: self.requirementForm.priority,
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.resetForm();
                    self.getAllRequirementByPid();
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
            this.dialogVisible = false;
        },
        resetUMLForm() {
            this.form.UMLName = "";
            this.form.UMLType = "";
        },
        resetForm() {
            this.form.rname = "";
            this.form.description = "";
            this.form.rtype = "";
            this.form.priority = "";
        },
        getAllRequirementByPid() {
            var self = this;
            this.$axios
                .get("/getAllRequirementByPid", {
                    params: {
                        pid: self.$store.state.UML.pid,
                    },
                })
                .then(function(response) {
                    console.log(
                        "getAllRequirementByPid:",
                        self.$store.state.UML.pid,
                        response.data
                    );
                    self.requirementList = response.data;
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        getAllRequirementByUid() {
            var self = this;
            this.$axios
                .get("/getAllRequirementByUid", {
                    params: {
                        uid: self.$store.state.UML.userId,
                    },
                })
                .then(function(response) {
                    console.log(
                        "getAllRequirementByUid:",
                        self.$store.state.UML.userId,
                        response.data
                    );
                    self.requirementList = response.data;
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
         selectGroupFile(gid) {
            console.log("selectGroupFile gid:", gid);
            this.selectGid = gid;
            var self = this;
            this.$axios
                .get("/getAllFileByGid", {
                    params: {
                        gid: gid,
                    },
                })
                .then(function(response) {
                    console.log(response.data);
                    self.fileList = response.data;
                    console.log("fileList:", self.fileList);
                    for (var i = 0; i < self.fileList.length; i++) {
                        var imgsrc =
                            "http://qldvty1zf.hn-bkt.clouddn.com" +
                            self.fileList[i].fileType +
                            "_" +
                            self.fileList[i].fid +
                            "?v=" +
                            self.fileList[i].refreshTime;
                        self.fileList[i].refreshTime = imgsrc;
                    }
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
            this.detailList = true;
        },
        getAllGroup() {
            var self = this;
            this.$axios
                .get("/getAllGroupByUid", {
                    params: {
                        uid: self.$store.state.UML.userId,
                    },
                })
                .then(function(response) {
                    console.log(
                        "getAllGroupByUid:",
                        self.$store.state.UML.userId,
                        response.data
                    );
                    self.groupList = response.data;
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        handleSelect(key, keyPath) {
            this.activeIndex = key;
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        resetForm() {
            this.form.UMLName = "";
            this.form.UMLType = "";
        },
        newfile() {
            var self = this;
            //console.log("personal:"+self.$store.state.UML.userId);
            self.$axios
                .get("/createFile", {
                    params: {
                        uid: self.$store.state.UML.userId,
                        fileName: self.form.UMLName,
                        fileType: self.form.UMLType
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.$store.commit("setUMLId", { id: response.data });
                    self.$store.commit("setGroupId", { groupId: -1 });
                    self.$store.commit("setUMLName", {
                        name: self.form.UMLName
                    });
                    self.$store.commit("setUMLType", {
                        type: self.form.UMLType
                    });
                    //清空Nodes
                    self.$store.commit("setUMLNodes", {
                        nodeList: []
                    });
                    //清空lines
                    self.$store.commit("setUMLLines", {
                        lineList: []
                    });
                    //console.log(self.$store.state.UML.UMLId);
                    //console.log(self.$store.state.UML.UMLName);
                    //console.log(self.$store.state.UML.UMLType);
                    self.$router.push({ name: "Designer" });
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        getFileList() {
            console.log("getfile");
            var self = this;
            this.$axios
                .get("/getAllFilePicByUid", {
                    params: {
                        uid: self.$store.state.UML.userId
                    }
                })
                .then(function(response) {
                    console.log(response.data);
                    self.fileList = response.data;
                    for (var i = 0; i < self.fileList.length; i++) {
                        var imgsrc =
                            "http://qldvty1zf.hn-bkt.clouddn.com/" +
                            self.fileList[i].fileType +
                            "_" +
                            self.fileList[i].fid +
                            "?v=" +
                            self.fileList[i].refreshTime;
                        self.fileList[i].refreshTime = imgsrc;
                    }
                    console.log(response.data);
                })
                .catch(function(error) {
                    console.log("error", error);
                });
        }
    }
};
</script>
<style scoped>
.personmenu {
    height: 400px;
    width: 150px;
    min-width: 150px;
}
.detailContent {
    padding-top: 50px;
}
.centerDiv {
    height: 390px;
    overflow-y: auto;
    padding-top: 10px;
}
.list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
}
.box-card {
    width: 240px;
    height: 190px;
    display: inline-block;
    margin: 10px;
}
.createBtn {
    width: 200px;
    height: 150px;
    display: inline-block;
}
.centerDiv {
    height: 390px;
    overflow-y: auto;
    padding-top: 10px;
}
#tool {
    width: 100%;
    height: auto;
    margin-top: 1%;
    display: block;
}

.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.list-complete-leave-active {
    position: absolute;
}
</style>
