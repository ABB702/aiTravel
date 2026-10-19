<template>
  <section class="page-card">
    <slot />
  </section>
</template>

<style scoped>
.page-card {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
</style>
