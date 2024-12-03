<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { user } from "@/store/index.js";

import { homeGetArticleList } from "@/api/article";
import { homeGetConfig } from "@/api/config";
import { getAllTag } from "@/api/tag";
import { homeGetStatistic } from "@/api/home";
import { randomFontColor, numberFormate } from "@/utils/tool";

import PageHeader from "@/components/PageHeader/index.vue";
import HomeArticleList from "@/components/HomeArticle/home-article-list.vue";
import RightSide from "@/components/RightSide/right-side.vue";
import MobileTopSkeleton from "@/components/RightSide/components/skeleton/mobile-top-skeleton.vue";
import RightSideItem from "@/components/RightSide/components/item/right-side-item.vue";
import RightSideTop from "@/components/RightSide/components/item/right-side-top.vue";
import RightSideSkeletonItem from "@/components/RightSide/components/skeleton/right-side-skeleton-item.vue";
import { gsapTransY } from "@/utils/transform";

const userStore = user();

/** 文章 */
const param = reactive({
  current: 1, // 当前页
  size: 5, // 每页条目数
  loading: true, // 加载
});
const articleList = ref([]);
const articleTotal = ref();

const getHomeArticleList = async () => {
  try {
    let res = await homeGetArticleList(param.current, param.size);
    if (res.code == 0) {
      const { list, total } = res.data;
      articleList.value = list;
      articleTotal.value = total;
    }
  } finally {
    param.loading = false;
  }
};

const pagination = (page) => {
  param.current = page.current;
  getHomeArticleList();
};

/** 网站右侧 */
const rightSizeLoading = ref(false);
const runtime = ref(0);
let configDetail = ref({});
let tags = ref([]);

// 获取网站详细信息
const getConfigDetail = async () => {
  try {
    let res = await homeGetConfig();
    if (res.code == 0 && typeof res.data != "string") {
      configDetail.value = res.data;
      userStore.setBlogAvatar(res.data.blog_avatar);
      calcRuntimeDays(configDetail.value.createdAt);
    }
  } finally {
    rightSizeLoading.value = false;
  }
};
// 获取文章数、分类数、标签数
const getStatistic = async () => {
  let res = await homeGetStatistic();;
  if (res.code == 0) {
    Object.assign(configDetail.value, res.data);
  }
};

// 获取所有的标签
const getAllTags = async () => {
  let res = await getAllTag();
  if (res.code == 0) {
    tags.value = res.data.map((r) => {
      r.color = randomFontColor();
      return r;
    });
  }
};

// 计算出网站运行天数
const calcRuntimeDays = (time) => {
  if (time) {
    // 解决 iOS 系统上格式化时间出现 NaN 的 bug
    time = time.replace(/-/g, '/'); 

    // 解析时间字符串
    const now = new Date().getTime();
    let created;

    // 尝试解析 ISO 8601 格式的日期时间
    if (time.includes('T')) {
      // 去掉 'Z' 并手动拆分日期和时间
      const [datePart, timePart] = time.replace('Z', '').split('T');
      const [year, month, day] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      const milliseconds = seconds.split('.')[1] || '000';

      created = new Date(year, month - 1, day, hours, minutes, seconds.split('.')[0], milliseconds).getTime();
    } else {
      // 普通的日期时间格式
      created = new Date(time).getTime();
    }

    // 检查解析是否成功
    if (isNaN(created)) {
      console.error('Invalid date format:', time);
      return;
    }

    // 计算天数差
    const days = Math.floor((now - created) / 8.64e7);

    // 假设 runtime 是一个响应式变量
    runtime.value = days;
  }
};

const init = async () => {
  param.loading = true;
  rightSizeLoading.value = true;
  await getHomeArticleList("init");
  await getConfigDetail();
  await getAllTags();
  await getStatistic();
};

const observeMobileBox = () => {
  nextTick(() => {
    gsapTransY([".mobile-top-card", ".mobile-bottom-card"], -30, 0.5, "bounce.in");
    gsapTransY([".mobile-bottom-card"], 30, 0.6, "none");
  });
};

onMounted(async () => {
  await init();
  observeMobileBox();
});
</script>

<template>
  <PageHeader />
  <div class="home_center_box">
    <el-row>
      <el-col :xs="24" :sm="18">
        <el-card
          class="mobile-top-card mobile-card info-card animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <MobileTopSkeleton />
            </template>
            <template #default>
              <RightSideTop :configDetail="configDetail" />
            </template>
          </el-skeleton>
        </el-card>
        <!-- 博客文章 -->
        <HomeArticleList
          :articleList="articleList"
          :param="param"
          :articleTotal="articleTotal"
          @pageChange="pagination"
        ></HomeArticleList>
        <el-card
          class="mobile-bottom-card card-hover mobile-card info-card animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-zixun" size="1.4rem" title="网站资讯">
                <div class="site-info">
                  <div class="flex_r_between">
                    <span>文章数目：</span>
                    <span class="value">{{ configDetail.articleCount }}</span>
                  </div>
                  <div class="flex_r_between">
                    <span>运行时间：</span>
                    <span class="value">{{ runtime }} 天</span>
                  </div>
                  <div class="flex_r_between">
                    <span>博客访问次数：</span>
                    <span class="value">{{ numberFormate(configDetail.view_time) }}</span>
                  </div>
                </div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="6">
        <!-- 博客我的信息 -->
        <RightSide
          :configDetail="configDetail"
          :tags="tags"
          :runtime="runtime"
          :loading="rightSizeLoading"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.mobile-top-card {
  height: 31rem;
  margin: 4px;
  :deep(.info-avatar) {
    padding: 0 2rem;
  }
  :deep(.personal-say) {
    padding-left: 1rem;
  }
  :deep(.info-background) {
    height: 12rem;
    width: 100%;
  }
  :deep(.common-menu) {
    padding: 1rem 5.5rem;
  }
  :deep(.git-ee) {
    padding: 0 4rem;
  }
  :deep(.personal-link) {
    padding: 1rem 6rem;
  }
}
.mobile-bottom-card {
  margin: 4px;
  padding: 1rem;
  .icon-localoffer {
    font-weight: 900;
  }
  span {
    margin-left: 0.3rem;
  }
  .site-info {
    padding: 0.3rem 1rem;
    line-height: 2;
    font-size: 1rem;

    .value {
      font-weight: 600;
    }
  }
}

.group {
  margin-left: 0.3rem;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .img {
    width: 80px;
    height: 80px;
  }
}
</style>
