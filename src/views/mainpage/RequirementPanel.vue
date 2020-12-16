<template>
    <div>
        <div style="display: flex">
            <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
                <!-- <el-menu-item index="1">
                    <i class="el-icon-document"></i>
                    <span slot="title">发布需求</span>
                </el-menu-item> -->
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">需求列表</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">我的需求</span>
                </el-menu-item>
            </el-menu>
            <div
                class="detailContent"
                v-if="activeIndex == '1'"
                style="width: 300px; margin: 10px auto"
            >
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
            <div class="centerDiv" v-else>
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
        </div>
        <PageFooter></PageFooter>
    </div>
</template>
<script>
import RequirementInfo from "./RequirementInfo";
import GroupInfo from "./GroupInfo.vue";
import SingleFile from "./SingleFile.vue";
import PageFooter from "../PageFooter.vue";
export default {
    name: "RequirementPanel",
    components: {GroupInfo, SingleFile, PageFooter, RequirementInfo},
    data() {
        return {
            activeIndex: "1",
            form: {
                UMLName: "",
                UMLType: ""
            },
            fileList: [],
            requirementList : [],
            imgsrc: "http://qldvty1zf.hn-bkt.clouddn.com/"
        };
    },
    mounted() {
        this.getFileList();
        this.getAllGroup();
        this.getAllRequirement();
    },
    methods: {
        createRequirement() {
             var self = this;
            //console.log("personal:"+self.$store.state.UML.userId);
            self.$axios
                .get("/createRequirement", {
                    params: {
                        rname: self.form.rname,
                        description: self.form.description,
                        rtype: self.form.rtype,
                        // pdescription
                        priority: self.form.priority,
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.resetForm();
                    self.getAllRequirement();
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        resetForm() {
            this.form.rname = "";
            this.form.description = "";
            this.form.rtype = "";
            this.form.priority = "";
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
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.list-complete-leave-active {
    position: absolute;
}
</style>
