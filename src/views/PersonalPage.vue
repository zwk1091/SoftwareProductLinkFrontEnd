<template>
    <div id="main">
        <div id="head">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
            >
                <el-menu-item index="1">项目列表</el-menu-item>
                <el-menu-item index="2">我的项目</el-menu-item>
                <el-menu-item index="3">发布项目</el-menu-item>
                <!-- <el-menu-item index="1">个人UML图</el-menu-item>
                <el-menu-item index="2">团队UML图</el-menu-item>
                <el-menu-item index="3">项目管理</el-menu-item>
                <el-menu-item index="4">需求管理</el-menu-item>
                <el-menu-item index="5">代码管理</el-menu-item> -->
            </el-menu>
        </div>
        <div style="display: flex">
            <!-- <el-menu :default-active="activeIndex" class="personmenu" @select="handleSelect">
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
            </el-menu> -->
            <div
                class="centerDiv" 
                v-if="activeIndex == '1'"

            >
                
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
            <div class="centerDiv" v-else-if="activeIndex == '2'">
                
            </div>
            <div 
            class="detailContent"
            style="width: 300px; margin: 10px auto"
                        v-else>
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
        </div>
        <!-- <div v-if="activeIndex == '1'">
            <PersonalPanel></PersonalPanel>
        </div>
        <div v-else-if="activeIndex == '2'">
            <GroupPanel></GroupPanel>
        </div>
        <div v-else-if="activeIndex == '3'">
            <ProjectPanel></ProjectPanel>
        </div>
        <div v-else-if="activeIndex == '4'">
            <RequirementPanel></RequirementPanel>
        </div>
        <div v-else>
            <RequirementPanel></RequirementPanel>
        </div> -->
    </div>
</template>

<script>
import GroupPanel from "../views/mainpage/GroupPanel.vue";
import PersonalPanel from "../views/mainpage/PersonalPanel.vue";
import RequirementPanel from './mainpage/RequirementPanel.vue';
import ProjectPanel from "../views/mainpage/ProjectPanel.vue";

import ProjectInfo from "../views/mainpage/ProjectInfo";

export default {
    name: "personal-page",
    components: {
        GroupPanel,
        PersonalPanel,
        RequirementPanel,
        ProjectPanel,
        ProjectInfo,
    },
    data() {
        return {
            projectList:[],
            form: {
                pname : "",
                planguage : "",
                pfield : "",
                pdescription : ""
            },
            activeIndex: "1",
            file0: require("../assets/file0.png"),
            file1: require("../assets/file0.png"),
            file2: require("../assets/file0.png"),
            file3: require("../assets/file0.png"),
            file4: require("../assets/file0.png"),
            file5: require("../assets/file0.png"),
            file6: require("../assets/file0.png"),
        };
    },
    mounted() {
        this.getAllProject();
    },
    methods: {
         resetForm() {
            this.form.pname = "";
            this.form.planguage = "";
            this.form.pfield = "";
            this.form.pdescription = "";
        },
        newProject() {
            var self = this;
            //console.log("personal:"+self.$store.state.UML.userId);
            self.$axios
                .get("/createProject", {
                    params: {
                        pname: self.form.pname,
                        planguage: self.form.planguage,
                        pfield: self.form.pfield,
                        // pdescription
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
        handleSelect(key, keyPath) {
            this.activeIndex = key;
        },
    }
};
</script>

<style scoped>
#main {
    width: 100%;
}
#head {
    width: 100%;
    height: 60px;
}
#username {
    position: absolute;
    left: 5%;
    display: inline;
}
#other {
    background-color: #ccc;
}
#left {
    width: 20%;
    height: 100%;
    display: inline;
    background-color: #ccc;
    position: fixed;
    left: 0;
}
#right {
    width: 80%;
    height: 100%;
    display: inline;
    background-color: #ccc;
    position: fixed;
    left: 20%;
}
.box-card {
    width: 240px;
    height: 190px;
    display: inline-block;
    margin: 10px;
}
#newfile {
    display: block;
    position: fixed;
    width: 150px;
    height: 30px;
    border: 1px;
    padding: 5px 20px;
    margin: 20px 20px;
    font-size: 14px;
    outline: none;
}
#files {
    width: 100%;
    height: auto;
}
#file0 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file1 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file2 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file3 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file4 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file5 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#file6 {
    display: inline-block;
    width: 15%;
    height: auto;
    padding: 5px 5px;
    margin: 2% 2%;
    font-size: 14px;
    outline: none;
    background-color: dodgerblue;
}
#pic0 {
    width: 100%;
    display: block;
}
#filename0 {
    text-align: center;
}
#pic1 {
    width: 100%;
    display: block;
}
#filename1 {
    text-align: center;
}
#pic2 {
    width: 100%;
    display: block;
}
#filename2 {
    text-align: center;
}
#pic3 {
    width: 100%;
    display: block;
}
#filename3 {
    text-align: center;
}
#pic4 {
    width: 100%;
    display: block;
}
#filename4 {
    text-align: center;
}
#pic5 {
    width: 100%;
    display: block;
}
#filename5 {
    text-align: center;
}
#pic6 {
    width: 100%;
    display: block;
}
#filename6 {
    text-align: center;
}
</style>