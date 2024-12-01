import { ref, reactive, onMounted } from "vue";
import { getConfigDetail, updateConfigDetail, imgUpload } from "@/api/site";
import { message } from "@/utils/message";
import { ElLoading } from "element-plus";
import { deepClone } from "@/utils/utils";

export function useSite() {
  const loading = ref(false);
  const primaryForm = reactive({});
  const siteInfoForm = reactive({
    id: 1,
    blog_name: "",
    blog_avatar: "",
    avatarList: [],
    avatar_bg: "", // 博客头像后的bg
    bgList: [],
    personal_say: "", // 个签
    blog_notice: "", // 公告
    github_link: "",
  });

  const blogAvatarV = (rule: any, value: any, callback: any) => {
    if (!siteInfoForm.avatarList.length) {
      callback(new Error("请上传博客头像"));
    } else if (!siteInfoForm.bgList.length) {
      callback(new Error("请上传博客头像背景"));
    } else {
      callback();
    }
  };
  const siteInfoRules = reactive({
    blog_name: [{ required: true, message: "请输入博客名称", trigger: "blur" }],
    blog_avatar: { required: true, validator: blogAvatarV, trigger: "blur" },
  });

  const isEditSiteInfo = ref(false);

  async function save(type, formRef) {
    await formRef.validate(async valid => {
      if (valid) {
        switch (type) {
          case "site":
            await updateSiteConfig();
            isEditSiteInfo.value = false;
            break;
          default:
            return;
        }
      }
    });
  }

  function edit(type) {
    switch (type) {
      case "site":
        isEditSiteInfo.value = true;
        break;
      default:
        return;
    }
  }

  function cancel(type, ref) {
    ref.clearValidate();
    switch (type) {
      case "site":
        isEditSiteInfo.value = false;
        ref.clearValidate();
        Object.assign(siteInfoForm, primaryForm);
        Object.assign(primaryForm, deepClone(siteInfoForm));
        break;
      default:
        return;
    }
  }

  // 初始化网站设置
  async function initConfig() {
    const res = await getConfigDetail();
    if (res.status == 0) {
      if (res.data) {
        const {
          blog_avatar,
          avatar_bg
        } = res.data;
        Object.assign(siteInfoForm, res.data);
        if (blog_avatar) {
          siteInfoForm.avatarList = [
            {
              id: 1,
              name: blog_avatar.split("/").pop() || "未知名称",
              url: blog_avatar
            }
          ];
        }
        if (avatar_bg) {
          siteInfoForm.bgList = [
            {
              id: 2,
              name: avatar_bg.split("/").pop() || "未知名称",
              url: avatar_bg
            }
          ];
        }
        Object.assign(primaryForm, deepClone(siteInfoForm));
      }
    }
  }
  // 修改网站设置
  async function updateSiteConfig() {
    loading.value = true;
    const imgUploading = ElLoading.service({
      fullscreen: true,
      text: "图片上传中......"
    });
    // 先上传图片
    if (siteInfoForm.bgList.length && !siteInfoForm.bgList[0].id) {
      const imgRes = await imgUpload(siteInfoForm.bgList[0]);
      if (imgRes.status == 0) {
        const { url } = imgRes.data;
        siteInfoForm.avatar_bg = url;
      }
    }
    if (siteInfoForm.avatarList.length && !siteInfoForm.avatarList[0].id) {
      const imgRes = await imgUpload(siteInfoForm.avatarList[0]);
      if (imgRes.status == 0) {
        const { url } = imgRes.data;
        siteInfoForm.blog_avatar = url;
      }
    }
    imgUploading.close();
    const res = await updateConfigDetail(siteInfoForm);
    if (res.status == 0) {
      message("网站设置修改成功", { type: "success" });
      initConfig();
    }
    loading.value = false;
  }

  onMounted(() => {
    initConfig();
  });

  return {
    loading,
    siteInfoForm,
    siteInfoRules,
    isEditSiteInfo,
    edit,
    save,
    cancel
  };
}
