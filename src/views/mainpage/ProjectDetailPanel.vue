<template>
    <div>

        <!-- <div style="display: flex"> --> 
            <el-container>
            <el-header id="tool">
                <top-bar></top-bar>
            </el-header>
            <el-container>
            <el-aside>
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
                <!-- <el-menu-item index="5">
                    <i class="el-icon-menu"></i>
                    <span slot="title">新建UML</span>
                </el-menu-item> -->
            </el-menu>
            </el-aside>
            <el-main>
            <div
                class="centerDiv"
                v-show="activeIndex == '1'"
            >
                <div class="text">项目名称：{{ thisProject.pname }}</div>
                <div class="text">项目描述：{{ thisProject.pdescription }}</div>
                <div class="text">项目领域：{{ thisProject.pfield }}</div>
                <div class="text">项目语言：{{ thisProject.planguage }}</div>
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
                <el-card class="box-card">
                    <el-button
                        class="createBtn"
                        icon="el-icon-circle-plus-outline"
                        @click="dialogVisibleUML = true"
                        >新建UML图</el-button
                    >
                </el-card>
                 <transition-group name="list-complete">
                        <SingleFile
                            v-for="item in fileList"
                            :key="item.fid"
                            :fileName="item.fileName"
                            :fid="item.fid"
                            :fileType="item.fileType"
                            :gid="selectGid"
                            :src="item.refreshTime"
                            @refreshFileList="getFileList"
                        ></SingleFile>
                </transition-group>
            </div>
            <div class="centerDiv" 
            v-show="activeIndex == '4'">
                <FileTree v-bind:pid="pid"></FileTree>            
            </div>
            <div
                class="centerDiv"
                v-show="fileActiveIndex == '1'"
            >
                <el-upload
                class="upload-demo"
                ref="upload"
                action="doUpload"
                :limit="1"
                :file-list="codeFileList"
                :before-upload="beforeUpload">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                <div slot="tip" class="el-upload__tip">只能上传单个文件，且不超过5MB</div>
                <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>
                <el-button type="primary" @click="submitFileUpload()">上传</el-button>
                </el-upload> 
            </div>
            <div
                class="centerDiv"
                v-show="fileActiveIndex == '2'"
            >
                <el-upload
                class="upload-demo"
                ref="upload"
                action="doUpload"
                accept=".zip"
                :limit="1"
                :file-list="codeFileList"
                :before-upload="beforeUpload">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                <div slot="tip" class="el-upload__tip">只能上传单个文件，且不超过5MB</div>
                <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>
                <el-button type="primary" @click="submitZipFileUpload()">上传</el-button>
                </el-upload> 
            </div>
            </el-main>
            </el-container>
            </el-container>
        <!-- </div> -->
        <PageFooter></PageFooter>
        <el-dialog
            title="新增UML图"
            :visible.sync="dialogVisibleUML"
            width="30%"
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
                        <el-button @click="dialogVisibleUML = false">取 消</el-button>
                        <el-button style="float: right; margin-left: 5px" @click="resetUMLForm()">清空</el-button>
                        <el-button style="float: right" type="primary" @click="newfile">创建</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
        <el-dialog
            title="新增文件夹"
            :visible.sync="dialogVisibleDirectory"
            width="30%"
        >
            <el-form
                ref="newDirectoryForm"
                :model="newDirectoryForm"
                label-width="80px"
                style="width: 300px;"
            >
                <el-form-item label="文件夹名称">
                    <el-input v-model="newDirectoryForm.dname"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDirectory = false">取 消</el-button>
                <el-button type="primary" @click="createDirectory">确 定</el-button>
            </span>
        </el-dialog>

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
import FileTree from "./FileTree";
import qs from 'qs';
import my_axios from 'axios'
export default {
    name: "ProjectDetailPanel",
    components: {GroupInfo, SingleFile, PageFooter, RequirementInfo, TopBar, FileTree},
    data() {
        return {
            dialogVisible: false,
            dialogVisibleUML: false,
            dialogVisibleDirectory: false,
            activeIndex: "1",
            fileActiveIndex: "0",
            newDirectoryForm: {
                dname: "",
            },
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
            pid:-2,
            description: "",
            planguage: "",
            pfield: "",
            pname: "",
            codeFileList: [],
            fileName: "",
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
        
        beforeUpload(file) {
            var self = this;
            self.codeFileList[0] = file;
            self.fileName = file.name;
            return false;
        },
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
        submitZipFileUpload() {
            var self = this;
            // let fd = new URLSearcFormDatahParams();
            let fd = new FormData();

            fd.append('zip', self.codeFileList[0]);
            fd.append('pid', self.$store.state.UML.pid);
            var url = "http://localhost:8084/project/uploadZipFile";

            this.$axios({  
                method:'post',  
                url:url,  
                data: fd,
                // {
                // pid:self.$store.state.UML.pid,
                // fileName:"hehehaha",
                // file : self.codeFileList[0]},
                // headers:{'Content-Type': 'multipart/form-data'},  
                // transformRequest: function(obj) {  
                //     var str = [];  
                //     for(var p in obj){  
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                //     }  
                //     return str.join("&");  
                // }  
            
            }) .then((res)=>{
                console.log(res.data);
            });
        },
        submitFileUpload() {
            var self = this;
            // let fd = new URLSearcFormDatahParams();
            let fd = new FormData();

            fd.append('file', self.codeFileList[0]);
            fd.append('pid', self.$store.state.UML.pid);
            // fd.append('fileName', "hehehaha");
            // console.log(self.fileName);
            // console.log(self.codeFileList[0]);
            // console.log(self.$store.state.UML.pid);
            var url = "http://localhost:8084/directory/uploadFile";
            // self.$axios.post(url, fd, {
            //     headers: {
            //     'Content-Type': 'multipart/form-data'
            //     },
            // }) .then((res)=>{
            //     console.log(res.data);
            // });
            // console.log(fd.get('pid'));
            this.$axios({  
                method:'post',  
                url:url,  
                data: fd,
                // {
                // pid:self.$store.state.UML.pid,
                // fileName:"hehehaha",
                // file : self.codeFileList[0]},
                // headers:{'Content-Type': 'multipart/form-data'},  
                // transformRequest: function(obj) {  
                //     var str = [];  
                //     for(var p in obj){  
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                //     }  
                //     return str.join("&");  
                // }  
            
            }) .then((res)=>{
                console.log(res.data);
            });
            // self.$axios({
            //         method : 'post',
            //         url : "http://localhost:8084/directory/uploadFile", 
            //         data : fd,
            //         // transformRequest: [
            //         // function (data) {
            //         //     let ret = ''
            //         //     for (let it in data) {
            //         //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            //         //     }
            //         //     ret = ret.substring(0, ret.length - 1)
            //         //     return ret
            //         // }
            //         // ],
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded'
            //         }
            // });
                // .post("/directory/uploadFile",qs.stringify(fd), {
                //         // headers: {
                //         // 'Content-Type': 'multipart/form-data'
                //         // },
                //         headers : {'Content-Type':'multipart/form-data'},
                //         // file : self.codeFileList[0],
                //         // pid : self.$store.state.UML.pid,
                //     })
                //     .then(function(response) {
                //     console.log("success: response.data--", response.data);
                //     if (response.data != -1) { 
                        
                //     } else {

                //     }
                // })
                // .catch(function(error) {
                //     console.log("error:" + error);
                // });
                    

                    // file : self.codeFileList[0],
                    // pid : self.$store.state.UML.pid,
                    // fileName : self.fileName,
                    // headers: {
                    // 'Content-Type': 'multipart/form-data'
                    // }
                // })
                
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
                    self.$router.push({ name: "Designer" });
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });
        },
        
        createDirectory() {
            var self = this;
            self.$axios
                .get("/directory/newDirectory", {
                    params: {
                        dirName : self.newDirectoryForm.dname,
                        pid : self.$store.state.UML.pid,
                    }
                })
                .then(function(response) {
                    console.log("success:" + response);
                    self.$message({
                        message: "创建成功",
                        type: "success"
                    });
                    self.resetForm();
                })
                .catch(function(error) {
                    console.log("error:" + error);
                });

            this.dialogVisibleDirectory = false;
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
        fileHandleSelect(key, keyPath) {
            this.fileActiveIndex = key;
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
                        pid: self.$store.state.UML.pid,
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
            console.log("getfile by pid");
            var self = this;
            // self.pid = self.$store.state.UML.pid;
            this.$axios
                .get("/getAllFilePicByPid", {
                    params: {
                        pid: self.$store.state.UML.pid
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
    /* height: 390px;
    overflow-y: auto;
    padding-top: 10px; */
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
