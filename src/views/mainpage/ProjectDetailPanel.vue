<template>
    <div>
        
        <div style="display: flex">
            <el-container>
            <el-header id="tool">
                <top-bar></top-bar>
            </el-header>
            <el-container class="mainBody">
            <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <!-- <el-menu-item index="1">
                    <i class="el-icon-document"></i>
                    <span slot="title">发布需求</span>
                </el-menu-item> -->
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">需求管理</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">UML图管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-menu"></i>
                    <span slot="title">代码管理</span>
                </el-menu-item>
            </el-menu>
            <div
                class="centerDiv"
                v-show="activeIndex == '1'"
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
                        :rname="item.rname"
                        :description="item.description"
                   
                        @refresh="getAllRequirement()"
                    ></RequirementInfo>
                </transition-group>
            </div>
            <div
                class="centerDiv"
                v-show="activeIndex == '2'"
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
            v-show="activeIndex == '3'">
                <transition-group name="list-complete">
                    <RequirementInfo  
                        v-for="item in groupList"
                        :key="'gid:' + item.gid"
                        :name="item.groupName"
                        :invitedMember="item.invitedUserList"
                        :invitingMember="item.invitingUserList"
                   
                        :leaderId="item.captainId"
                        :gid="item.gid"
                        @refresh="getAllGroup()"
                    ></RequirementInfo>
                </transition-group>
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
                ref="requirementform"
                :model="requirementform"
                label-width="80px"
                style="width: 300px;"
            >
                <el-form-item label="需求名称">
                    <el-input v-model="requirementform.name"></el-input>
                </el-form-item>
                <el-form-item label="需求类型">
                    <el-input v-model="requirementform.name"></el-input>
                </el-form-item>
                <el-form-item label="需求优先级">
                    <el-input v-model="requirementform.name"></el-input>
                </el-form-item>
                <el-form-item label="详细描述">
                    <el-input v-model="requirementform.name"></el-input>
                </el-form-item>
                <el-form-item label="图片说明Todo">
                    <!-- <el-input v-model="requirementform.name"></el-input> -->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createGroup">确 定</el-button>
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
            requirementform: {
                rname: "",
                descrrption: "",
                priority: "",
                rtype: "",
            },
            form: {
                UMLName: "",
                UMLType: ""
            },
            fileList: [],
            requirementList : [],
            imgsrc: "http://q92yn5po6.bkt.clouddn.com/"
        };
    },

    mounted() {
        this.getFileList();
        this.getAllGroup();
        this.getAllRequirement();
    },
    methods: {
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
                            "http://q92yn5po6.bkt.clouddn.com/" +
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
                            "http://q92yn5po6.bkt.clouddn.com/" +
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
