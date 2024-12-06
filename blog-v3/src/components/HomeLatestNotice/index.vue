<template>
  <div>
    <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24">
      <div class="el-card is-always-shadow card-hover">
        <div class="el-card__body">
          <div class="el-card__header">
            <i class="iconfont icon-gonggao" style="font-size: 1.5rem; color: rgb(255, 0, 0);padding-right: 7px;"></i>
            <span style="font-size: 17px">项目开发以完成，后续会不定时补充新功能！！！</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
    --el-border-color-light:transparent
    :deep(--el-card-padding) {
        padding: 0;
    }
    :deep(--el-card-border-color){
        color: (--el-border-color-light)
    }
}
.el-card__header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}
.icon-gonggao:before{
    content: "\e604";
}
</style>