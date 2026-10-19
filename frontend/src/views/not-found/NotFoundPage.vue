<script setup>
import PageCard from '@/components/common/PageCard.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { ROUTE_PATHS } from '@/constants/routes.js'

/** 404 页面:提示页面不存在,并提供返回首页的链接 */
</script>

<template>
  <div class="page-container">
    <PageHeader title="页面不存在" subtitle="你访问的页面可能已被移除或地址有误" />
    <PageCard>
      <RouterLink :to="ROUTE_PATHS.HOME" class="not-found__link">返回首页</RouterLink>
    </PageCard>
  </div>
</template>

<style scoped>
.not-found__link {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-target-min);
  color: var(--color-primary);
}
</style>
