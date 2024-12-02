// vite.config.js
import { defineConfig } from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import commonjs from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import AutoImport from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import viteCompression from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/vite-plugin-compression/dist/index.mjs";
import { resolve } from "path";
import requireTransform from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/vite-plugin-require-transform/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///F:/%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90/%E5%8D%9A%E5%AE%A2%E9%A1%B9%E7%9B%AE/a/blog-v3/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var __vite_injected_original_dirname = "F:\\\u76F8\u5173\u8D44\u6E90\\\u535A\u5BA2\u9879\u76EE\\a\\blog-v3";
var vite_config_default = defineConfig({
  base: "./",
  root: process.cwd(),
  // 绝对路径
  resolve: {
    // 配置路径别名
    alias: [
      // 配置 @ 指代 src
      {
        find: "@",
        replacement: resolve(__vite_injected_original_dirname, "./src")
      }
    ],
    extensions: [".js", ".vue", ".json"]
  },
  // 按需导入element-plus main.js里不需要再引入了
  plugins: [
    vue(),
    commonjs(),
    // 自动导入element plus组件
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: true,
      dirs: "src/components",
      resolvers: [ElementPlusResolver()]
      // ElementPlus按需加载
    }),
    viteCompression({
      verbose: true,
      // 默认即可
      disable: false,
      //开启压缩(不禁用)，默认即可
      deleteOriginFile: false,
      //删除源文件
      threshold: 10240,
      //压缩前最小文件大小
      algorithm: "gzip",
      //压缩算法
      ext: ".gz"
      //文件类型
    }),
    // 让vite支持require
    requireTransform({
      fileRegex: /.js$|.vue$/
    }),
    // svg
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(process.cwd(), "src/icons/svg")]
    })
  ],
  css: {
    preprocessorOptions: {
      // 引入全局scss
      scss: {
        additionalData: `@import "./src/styles/base.scss";`
      }
    }
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    https: false,
    open: true,
    // 热更新
    hmr: {
      overlay: false
    },
    proxy: {
      // 本地后端代理
      "/api": {
        //要访问的跨域的域名
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/images": {
        target: "http://localhost:8888/images",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, "")
      }
    }
  },
  // 打包输出
  build: {
    sourcemap: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 4e3,
    rollupOptions: {
      input: {
        index: resolve("index.html")
      },
      // 静态资源分类打包
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxcdTc2RjhcdTUxNzNcdThENDRcdTZFOTBcXFxcXHU1MzVBXHU1QkEyXHU5ODc5XHU3NkVFXFxcXGFcXFxcYmxvZy12M1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcXHU3NkY4XHU1MTczXHU4RDQ0XHU2RTkwXFxcXFx1NTM1QVx1NUJBMlx1OTg3OVx1NzZFRVxcXFxhXFxcXGJsb2ctdjNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6LyVFNyU5QiVCOCVFNSU4NSVCMyVFOCVCNSU4NCVFNiVCQSU5MC8lRTUlOEQlOUElRTUlQUUlQTIlRTklQTElQjklRTclOUIlQUUvYS9ibG9nLXYzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBjb21tb25qcyBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tY29tbW9uanNcIjsgLy8gXHU4QkE5dml0ZVx1NjI1M1x1NTMwNVx1NjUyRlx1NjMwMWNvbW1vbi5qc1x1OEJFRFx1NkNENVxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiOyAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjsgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1c3JjL2NvbXBvbmVudHNcdTRFMEJcdTc2ODRcdTdFQzRcdTRFRjZcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjsgLy8gXHU2MzA5XHU5NzAwXHU1QkZDXHU1MTY1ZXBcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjsgLy8gZ3ppcFx1NTM4Qlx1N0YyOVxyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJlcXVpcmVUcmFuc2Zvcm0gZnJvbSBcInZpdGUtcGx1Z2luLXJlcXVpcmUtdHJhbnNmb3JtXCI7IC8vIFx1NjUyRlx1NjMwMXJlcXVpcmVcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI7IC8vIFx1NjUyRlx1NjMwMXN2Z1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiBcIi4vXCIsXHJcbiAgcm9vdDogcHJvY2Vzcy5jd2QoKSwgLy8gXHU3RUREXHU1QkY5XHU4REVGXHU1Rjg0XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgLy8gXHU5MTREXHU3RjZFXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHJcbiAgICBhbGlhczogW1xyXG4gICAgICAvLyBcdTkxNERcdTdGNkUgQCBcdTYzMDdcdTRFRTMgc3JjXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgZXh0ZW5zaW9uczogW1wiLmpzXCIsIFwiLnZ1ZVwiLCBcIi5qc29uXCJdLFxyXG4gIH0sXHJcbiAgLy8gXHU2MzA5XHU5NzAwXHU1QkZDXHU1MTY1ZWxlbWVudC1wbHVzIG1haW4uanNcdTkxQ0NcdTRFMERcdTk3MDBcdTg5ODFcdTUxOERcdTVGMTVcdTUxNjVcdTRFODZcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIGNvbW1vbmpzKCksXHJcbiAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVlbGVtZW50IHBsdXNcdTdFQzRcdTRFRjZcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZHRzOiB0cnVlLFxyXG4gICAgICBkaXJzOiBcInNyYy9jb21wb25lbnRzXCIsXHJcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sIC8vIEVsZW1lbnRQbHVzXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHJcbiAgICB9KSxcclxuICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgIHZlcmJvc2U6IHRydWUsIC8vIFx1OUVEOFx1OEJBNFx1NTM3M1x1NTNFRlxyXG4gICAgICBkaXNhYmxlOiBmYWxzZSwgLy9cdTVGMDBcdTU0MkZcdTUzOEJcdTdGMjkoXHU0RTBEXHU3OTgxXHU3NTI4KVx1RkYwQ1x1OUVEOFx1OEJBNFx1NTM3M1x1NTNFRlxyXG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSwgLy9cdTUyMjBcdTk2NjRcdTZFOTBcdTY1ODdcdTRFRjZcclxuICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy9cdTUzOEJcdTdGMjlcdTUyNERcdTY3MDBcdTVDMEZcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcclxuICAgICAgYWxnb3JpdGhtOiBcImd6aXBcIiwgLy9cdTUzOEJcdTdGMjlcdTdCOTdcdTZDRDVcclxuICAgICAgZXh0OiBcIi5nelwiLCAvL1x1NjU4N1x1NEVGNlx1N0M3Qlx1NTc4QlxyXG4gICAgfSksXHJcbiAgICAvLyBcdThCQTl2aXRlXHU2NTJGXHU2MzAxcmVxdWlyZVxyXG4gICAgcmVxdWlyZVRyYW5zZm9ybSh7XHJcbiAgICAgIGZpbGVSZWdleDogLy5qcyR8LnZ1ZSQvLFxyXG4gICAgfSksXHJcbiAgICAvLyBzdmdcclxuICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgLy8gU3BlY2lmeSB0aGUgaWNvbiBmb2xkZXIgdG8gYmUgY2FjaGVkXHJcbiAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyYy9pY29ucy9zdmdcIildLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgLy8gXHU1RjE1XHU1MTY1XHU1MTY4XHU1QzQwc2Nzc1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL2Jhc2Uuc2Nzc1wiO2AsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICBodHRwczogZmFsc2UsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgLy8gXHU3MEVEXHU2NkY0XHU2NUIwXHJcbiAgICBobXI6IHtcclxuICAgICAgb3ZlcmxheTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy8gXHU2NzJDXHU1NzMwXHU1NDBFXHU3QUVGXHU0RUUzXHU3NDA2XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgLy9cdTg5ODFcdThCQkZcdTk1RUVcdTc2ODRcdThERThcdTU3REZcdTc2ODRcdTU3REZcdTU0MERcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4ODg4XCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcclxuICAgICAgfSxcclxuICAgICAgXCIvaW1hZ2VzXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4ODg4L2ltYWdlc1wiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2ltYWdlcy8sIFwiXCIpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBcdTYyNTNcdTUzMDVcdThGOTNcdTUxRkFcclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgIC8vIFx1NkQ4OFx1OTY2NFx1NjI1M1x1NTMwNVx1NTkyN1x1NUMwRlx1OEQ4NVx1OEZDNzUwMGtiXHU4QjY2XHU1NDRBXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDQwMDAsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgaW5kZXg6IHJlc29sdmUoXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTUyMDZcdTdDN0JcdTYyNTNcdTUzMDVcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwic3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcInN0YXRpYy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThULFNBQVMsb0JBQW9CO0FBQzNWLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxn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
