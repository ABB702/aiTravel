<script setup>
/** 推荐目的地卡片:可通过点击、Enter 或空格选中 */
const props = defineProps({
  /** 推荐目的地 { id, name, description, icon } */
  destination: { type: Object, required: true },
  /** 是否为当前选中的目的地 */
  selected: { type: Boolean, default: false },
})

const emit = defineEmits({
  /** 选中该目的地,参数为目的地名称 */
  select: (name) => typeof name === 'string',
})

/** 触发选中事件 */
function choose() {
  emit('select', props.destination.name)
}
</script>

<template>
  <div
    class="destination-card"
    :class="{ 'destination-card--selected': selected }"
    role="button"
    tabindex="0"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="choose"
    @keydown.enter.prevent="choose"
    @keydown.space.prevent="choose"
  >
    <el-icon class="destination-card__icon" :size="24"
      ><component :is="destination.icon"
    /></el-icon>
    <div class="destination-card__body">
      <span class="destination-card__name">{{ destination.name }}</span>
      <span class="destination-card__desc">{{ destination.description }}</span>
    </div>
  </div>
</template>

<style scoped>
.destination-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--touch-target-min);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.destination-card:hover {
  border-color: var(--color-primary);
}

.destination-card--selected {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.destination-card__icon {
  flex: none;
  color: var(--color-primary);
}

.destination-card__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.destination-card__name {
  color: var(--color-text);
  font-weight: 600;
}

.destination-card__desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
}
</style>
