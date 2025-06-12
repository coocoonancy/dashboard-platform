<template>
  <div class="config-panel">
    <h3>Chart Config Panel</h3>

    <!-- 图表类型 -->
    <label>Chart Type:</label>
    <el-select v-model="localConfig.type">
      <option value="bar">Bar</option>
      <option value="line">Line</option>
      <option value="pie">Pie</option>
    </el-select>

    <!-- 标题 -->
    <label>Title:</label>
    <el-input v-model="localConfig.title" type="text" placeholder="Enter title" />

    <!-- 数据 JSON -->
    <label>Data (JSON):</label>
    <el-input textarea type="textarea" v-model="dataInput" rows="6" placeholder='e.g. [1,2,3] or [{value: 10, name: "A"}]'></el-input>

    <!-- 提交按钮 -->
    <el-button type="primary" @click="applyConfig">Apply</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElSelect, ElButton, ElInput } from 'element-plus';
const props = defineProps<{ initialConfig: any }>();
const emit = defineEmits(['applyConfig']);

// 本地状态用于编辑配置
const localConfig = ref({
  type: props.initialConfig.type || 'bar',
  title: props.initialConfig.title || '',
  data: props.initialConfig.data || []
});

// 将 data 序列化为 JSON 字符串用于输入框
const dataInput = ref(JSON.stringify(localConfig.value.data, null, 2));

// 监听 initialConfig 变化（可选）
watch(
  () => props.initialConfig,
  newVal => {
    localConfig.value = {
      type: newVal.type || 'bar',
      title: newVal.title || '',
      data: newVal.data || []
    };
    dataInput.value = JSON.stringify(localConfig.value.data, null, 2);
  },
  { deep: true }
);

// 点击“Apply”按钮时发出更新
const applyConfig = () => {
  try {
    const parsedData = JSON.parse(dataInput.value);
    emit('applyConfig', {
      ...localConfig.value,
      data: parsedData
    });
  } catch (e) {
    alert('Invalid JSON in Data input');
  }
};
</script>

<style scoped>
.config-panel {
  border: 1px solid #ccc;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}
.config-panel h3 {
  margin-bottom: 16px;
  margin-top: 6px;
}
.config-panel label {
  display: block;
  margin: 8px 0 4px;
}
.config-panel input,
.config-panel select,
.config-panel textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  margin-bottom: 8px;
}
</style>
