<script setup>
/** 个人资料信息卡:标签 + 内容;wide 的卡片在 2 列网格中跨两列(如个人简介) */
defineProps({
  /** 字段名称 */
  label: { type: String, required: true },
  /** 字段内容 */
  value: { type: String, required: true },
  /** 是否跨两列 */
  wide: { type: Boolean, default: false },
})
</script>

<template>
  <div class="profile-info-card" :class="{ 'profile-info-card--wide': wide }">
    <dt class="profile-info-card__label">{{ label }}</dt>
    <dd class="profile-info-card__value">{{ value }}</dd>
  </div>
</template>

<style scoped>
.profile-info-card {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.profile-info-card--wide {
  grid-column: 1 / -1;
}

.profile-info-card__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
}

.profile-info-card__value {
  margin: var(--space-1) 0 0;
  color: var(--color-text);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
