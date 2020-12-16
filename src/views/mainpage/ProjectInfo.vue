<template>
    <div style="display: inline-block;" v-if="projectDetail">

            <!-- <ProjectDetailPanel></ProjectDetailPanel> -->
    </div>
    <div v-else style="display: inline-block;"  @click="handleProjectInfoClick">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button
                    v-if="$store.state.UML.userId == leaderId"
                    size="mini"
                    style="float: left; padding: 3px 0; color: red"
                    type="text"
                    icon="el-icon-close"
                    @click="deleteGroup"
                ></el-button>
                <span>项目名称：{{ pname }}</span>
                <!-- <el-button
                    v-if="$store.state.UML.userId == leaderId"
                    size="mini"
                    style="float: right; padding: 3px 0"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleClick"
                    >邀请</el-button -->
                >
                <!--TODO leader == user-->
                
            </div>
            <div class="list">
                    <div class="text item">项目描述：{{ description }}</div>
                    <div class="text item">项目语言：{{ planguage }}</div>
                    <div class="text item">项目领域：{{ pfield }}</div>
            </div>
        </el-card>
    </div>
</template>
<script>

import ProjectDetailPanel from "./ProjectDetailPanel.vue";


export default {
    name: "RequirementInfo",
    components: {ProjectDetailPanel, },

    props: {
        pid: {
            type: Number,
            default: -1,
        },
        pname: {
            type: String,
            default: "undefine",
        },
        description: {
            type: String,
            default: "undefine",
        },
        planguage: {
            type: String,
            default: "undefine",
        },
        pfield: {
            type: String,
            default: "undefine",
        }
    },
    data() {
        return {
            dialogVisible: false,
            projectDetail: false,
            newMembers: [],
            userList: [],
        };
    },
    methods: {
        handleClick() {
            this.dialogVisible = true;
            this.getAllUser();
        },
        handleProjectInfoClick() {
            var self = this;
            console.log("handleProjectInfoClick", this.pid, this.pname);

            self.$store.commit("setProjectId", {
                                pid: this.pid
                            });
            // self.projectDetail = true;
            self.$router.push({ name: "ProjectDetailPanel" });
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
                .then(function(response) {
                    console.log(
                        "getAllUser:",
                        self.$store.state.UML.userId,
                        response.data
                    );
                    self.userList = response.data;
                })
                .catch(function(error) {
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
                .then(function(response) {
                    console.log(response.data);
                    self.newMembers = [];
                    self.$emit("refresh");
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });

            this.dialogVisible = false;
        },
        deleteGroup() {
            if (this.gid <= 0) {
                return;
            }
            var self = this;
            this.$axios
                .get("/deleteGroup", { params: { gid: self.gid } })
                .then(function(response) {
                    console.log("delete group res:", response.data);
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
                .catch(function(error) {
                    console.log("error:", error);
                });
        },
    },
};
</script>
<style scoped>
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
    width: 240px;
    height: 190px;
    display: inline-block;
    margin: 10px;
}
</style>
