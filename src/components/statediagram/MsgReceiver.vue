<template>
    <div
        @click.stop="setEditingId"
        :style="{
            width: this.width * 0.98 + 'px',
            height: this.height * 0.98 + 'px',
            display: 'flex'
        }"
        v-clickoutside="hideInputAndSave"
    >
        <div
            class="rectDiv"
            :style="{
                width: this.width * 0.9 + 'px',
                height: this.height * 0.9 + 'px'
            }"
        >
            <el-input
                class="contentSpan"
                v-model="name"
                v-if="showInput && id == $store.state.editingId"
                size="mini"
                :autofocus="true"
                @focus="saveOriginValue"
                @blur="submitChange"
                :style="{
                    width: this.width * 0.6 + 'px',
                    marginTop: this.height * 0.2 + 'px'
                }"
            ></el-input>
            <span
                :style="{
                    width: this.width * 0.6 + 'px',
                    minHeight: this.height * 0.6 + 'px',
                    marginTop: this.height * 0.2 + 'px'
                }"
                v-else
                class="contentSpan"
                @click="handleNameClick"
                >{{ name }}</span
            >
        </div>
        <div
            class="triDiv"
            :style="{
                borderWidth: this.height * 0.45 + 2 + 'px',
                marginLeft: -this.height * 0.9 - 4 + 'px'
            }"
        >
            <div
                class="triWhiteDiv"
                :style="{
                    borderWidth: this.height * 0.45 + 'px',
                    marginLeft: -this.height * 0.45 + 2 + 'px',
                    marginTop: -this.height * 0.45 + 'px'
                }"
            ></div>
        </div>
    </div>
</template>
<script>
import CommonComponent from "../CommonComponent.vue";
export default {
    name: "MsgReceiver",
    extends: CommonComponent,
    data() {
        return {
            name: "",
            originValue: ""
        };
    },
    watch: {
        properties: {
            deep: true,
            handler(prop) {
                this.name = prop.name;
            }
        }
    },
    methods: {
        hideInputAndSave() {
            this.showInput = false;
            this.setEditStateFalse();
        },
        saveOriginValue() {
            this.originValue = this.name;
        },
        submitChange() {
            if (this.originValue == this.name) {
                return;
            }
            this.$store.dispatch("modifyNode", {
                nodeKey: "properties",
                key: "name",
                value: this.name,
                originValue: this.originValue,
                id: this.id
            });
        },
        getLineLeftPosition() {
            //calculate 中点
            console.log("leftpostion");
            var x = 0;
            var y = this.height * 0.49;
            return [{x, y}];
        },
        getLineRightPosition() {
            //calculate 中点
            var x = this.width * 0.98;
            var y = this.height * 0.49;
            return [{x, y}];
        },
        getLineTopPosition() {
            //calculate 中点
            var x = this.width * 0.49;
            var y = 0;
            return [{x, y}];
        },
        getLineBottomPosition() {
            //calculate 中点
            var x = this.width * 0.49;
            var y = this.height * 0.98;
            return [{x, y}];
        },
        getName() {
            //calculate 中点
            return "";
        },
    }
};
</script>
<style scoped>
.rectDiv {
    border-top: 2px solid black;
    border-left: 2px solid black;
    border-bottom: 2px solid black;
    background: white;
}
.triDiv {
    width: 0;
    height: 0;
    border-right: solid black;
    border-top: solid transparent;
    border-bottom: solid transparent;
    border-left: solid transparent;
}
.triWhiteDiv {
    width: 0;
    height: 0;
    border-right: solid white;
    border-top: solid transparent;
    border-bottom: solid transparent;
    border-left: solid transparent;
}
</style>
