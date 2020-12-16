<template>
    <div style="display: inline-block;">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button
                    size="mini"
                    style="float: left; padding: 3px 0; color: red"
                    type="text"
                    icon="el-icon-close"
                    @click="deleteRequirement"
                ></el-button>
                <span>需求名称：{{ rname }}</span>
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
                <div class="text item">需求内容：{{ description }}</div>
                <div class="text item">需求类别：{{ rtype }}</div>
                <div class="text item">优先级：{{ priority }}</div>
            </div>
        </el-card>
        <el-dialog title="邀请新成员" :visible.sync="dialogVisible" width="30%">
            <el-select
                v-model="newMembers"
                multiple
                filterable
                placeholder="选择你想邀请的成员邮箱"
            >
                <el-option
                    v-for="item in userList"
                    :key="item.userEmail"
                    :label="item.userEmail"
                    :value="item.userEmail"
                >
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="inviteUser()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "RequirementInfo",
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
        };
    },
    methods: {
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
        deleteRequirement() {
            console.log("delete requirement", this.rid);
            if (this.rid <= 0) {
                return;
            }
            var self = this;
            this.$axios
                .get("/deleteRequirement", { params: { rid: self.rid } })
                .then(function(response) {
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
