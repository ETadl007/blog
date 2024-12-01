<script setup lang="ts" name="Home">
import { ref, onMounted, watch } from "vue";
import HomeCard from "@/components/HomeCard/home-card.vue";
import { getStatistic } from "@/api/home";
import WordCloud from "./components/WordCloud.vue";
import biaoqian from "@/assets/svg/biaoqian.svg?component";
import fenlei from "@/assets/svg/fenlei.svg?component";
import wenzhang from "@/assets/svg/wenzhang.svg?component";
import yonghu from "@/assets/svg/yonghu.svg?component";
import { debounce } from "@pureadmin/utils";
import { useAppStoreHook } from "@/store/modules/app";

const staticsData = ref({
  articleCount: 0,
  categoryCount: 0,
  tagCount: 0,
  userCount: 0,
});

const codeMapChartRef = ref(null);
const barChartRef = ref(null);
const cloudChartRef = ref(null);

// 静态数据
const getStatisticData = async () => {
  const res = await getStatistic();
  if (res.status == 0) {
    Object.assign(staticsData.value, res.data);
  }
};

const resize = debounce(() => {
  // resize echarts
  codeMapChartRef.value && codeMapChartRef.value.init();
  barChartRef.value && barChartRef.value.resize();
  cloudChartRef.value && cloudChartRef.value.resize();
}, 300);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    resize();
  }
);

onMounted(() => {
  getStatisticData();

  window.addEventListener("resize", resize);
});
</script>

<template>
  <el-card class="home">
    <template #header> 首页 </template>
    <el-row>
      <el-col :xs="12" :sm="6">
        <home-card label="文章" :value="staticsData.articleCount">
          <wenzhang class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="分类" :value="staticsData.categoryCount">
          <fenlei class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="标签" :value="staticsData.tagCount">
          <biaoqian class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="用户" :value="staticsData.userCount">
          <yonghu class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-card class="m-[5px]">
          <WordCloud ref="cloudChartRef" />
        </el-card>
      </el-col>
    </el-row>
    <div class="filings">
      <a class="change-color" href="http://beian.miit.gov.cn/" target="_blank"
        >蜀ICP备12345678号</a
      >
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.filings {
  margin-top: 20px;
  text-align: center;
  color: #333;
  font-size: 12px;

  .change-color {
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      color: #000;
    }
  }
}

.svg-fill {
  transition: all 0.3s;
}
/* 鼠标悬停的样式 */
.svg-fill:hover {
  transform: scale(1.1);
}
</style>
