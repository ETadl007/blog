<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";
import { getlataestNewsData } from "@/api/latestNewsData";

import "echarts-wordcloud";
import { object } from "vue-types";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const wordCloudRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(wordCloudRef as Ref<HTMLDivElement>, {
  theme
});
const latestNewsData = ref([]);
const getTagList = async () => {
  const res = await getlataestNewsData();
  if (res.code == 0) {
    latestNewsData.value = res.data;
  }
};

const init = async () => {
  await getTagList();
};

init();

defineExpose({
  resize
});
</script>

<template>
  <div ref="latestNewsData">
    <el-scrollbar max-height="504" class="mt-3">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in latestNewsData"
          :key="index"
          center
          placement="top"
          :timestamp="item.createdAt"
        >
          <div class="flex items-center justify-between">
            <p class="text-text_color_regular text-sm">
              {{
                `${item.nick_name} ${item.action}【${item.target_name}】${item.target_type}`
              }}
            </p>
            <p
              v-if="Object.keys(item.changes).length && item.changes.reason"
              class="text-text_color_regular text-sm"
            >
              {{ `原因：${item.changes.reason}` }}
            </p>
            <p v-else-if="Object.keys(item.changes).length && item.changes.content">
              {{ `内容：${item.changes.content}` }}
            </p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar__bar) {
  right: -10px;
}
:deep(.el-scrollbar) {
  overflow: visible;
}
</style>