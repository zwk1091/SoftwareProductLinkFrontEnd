<template>
    <div>
        <div style="display: flex">
            <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <el-menu-item index="1">
                    <i class="el-icon-document"></i>
                    <span slot="title">发布项目</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">项目列表</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-menu"></i>
                    <span slot="title">我的项目</span>
                </el-menu-item>
            </el-menu>
            <div
                class="detailContent"
                v-if="activeIndex == '1'"
                style="width: 300px; margin: 10px auto"
            >
                <el-form ref="form" :model="form" label-width="80px" style="width: 300px;">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.pname"></el-input>
                    </el-form-item>
                    <el-form-item label="项目领域">
                        <el-input v-model="form.pfield"></el-input>
                    </el-form-item>
                    <el-form-item label="项目语言">
                        <el-input v-model="form.planguage"></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述">
                        <el-input v-model="form.pdescription"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="float: right; margin-left: 5px" @click="resetForm()">清空</el-button>
                        <el-button style="float: right" type="primary" @click="newProject">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="centerDiv" v-else-if="activeIndex == '2'">
                <transition-group name="list-complete">
                    <ProjectInfo  
                        v-for="item in projectList"
                        :key="'pid:' + item.pid"
                        :rname="item.pname"
                        :description="item.pdescription"
                        :planguage="item.planguage"
                        :pfield="item.pfield"
                        @refresh="getAllProject()"
                    ></ProjectInfo>
                </transition-group>
            </div>
            <div class="centerDiv" v-else>
               
            </div>
        </div>
        <PageFooter></PageFooter>
    </div>
</template>
<script>
import ProjectInfo from "./ProjectInfo";
import GroupInfo from "./GroupInfo.vue";
import SingleFile from "./SingleFile.vue";
import PageFooter from "../PageFooter.vue";

export default {
    name: "ProjectPanel",
    components: {GroupInfo, SingleFile, PageFooter, ProjectInfo},
    data() {
        return {
            activeIndex: "1",
            form: {
                UMLName: "",
                UMLType: ""
            },
            fileList: [],
            projectList:[],
            requirementList : [],
            imgsrc: "http://qldvty1zf.hn-bkt.clouddn.com/"
        };
    },
    mounted() {
        this.getFileList();
        this.getAllGroup();
        this.getAllRequirement();
        this.getAllProject();
    },
    methods: {
        getAllProject() {
            var self = this;
            this.$axios
                .get("/getAllProject", {
                    params: {
                        
                    },
                })
                .then(function(response) {
                    console.log(
                        "getAllProject:",
                        self.$store.state.UML.userId,
                        response.data
                    );
                    self.projectList = response.data;
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        getAllRequirement() {
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
            this.form.pname = "";
            this.form.planguage = "";
            this.form.pfield = "";
            this.form.pdescription = "";
        },
        newProject() {
            var self = this;
            self.$axios
                .get("/createProject", {
                    params: {
                        pname: self.form.pname,
                        planguage: self.form.planguage,
                        pfield: self.form.pfield,
                        pdescription: self.form.pdescription,
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.resetForm();
                    self.getAllProject();
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
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.list-complete-leave-active {
    position: absolute;
}
</style>
