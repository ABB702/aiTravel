<script setup>
import { computed, onMounted, ref } from 'vue'
import { getUserProfile } from '@/api/user.js'
import PageHeader from '@/components/common/PageHeader.vue'
import userAvatar from '@/assets/user-avatar.svg'
import { USER_AVATAR_ALT } from '@/constants/chat.js'
import { buildProfileFields } from '@/utils/profile.js'
import ProfileInfoCard from './components/ProfileInfoCard.vue'

/** "我的"页面:加载并展示个人资料,加载中显示骨架屏,失败可重新加载 */
const profile = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const fields = computed(() => buildProfileFields(profile.value))
// 头像与昵称显示在顶部,其余字段显示为信息卡
const nickname = computed(() => fields.value.find((field) => field.key === 'nickname')?.value)
const cards = computed(() =>
  fields.value.filter((field) => field.key !== 'avatar' && field.key !== 'nickname'),
)
// 头像为空时回退为默认头像
const avatarSrc = computed(() => profile.value?.avatar || userAvatar)

/** 加载用户资料;重复点击"重新加载"时重新显示骨架屏 */
async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    profile.value = await getUserProfile()
  } catch (error) {
    errorMessage.value = error?.message || '加载失败,请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-container profile-page">
    <PageHeader title="我的" subtitle="查看个人基本信息" />

    <el-skeleton v-if="loading" animated :rows="6" />

    <el-result v-else-if="errorMessage" icon="error" title="加载失败" :sub-title="errorMessage">
      <template #extra>
        <el-button type="primary" @click="load">重新加载</el-button>
      </template>
    </el-result>

    <template v-else-if="profile">
      <div class="profile-page__head">
        <el-avatar :size="64" :src="avatarSrc" :alt="USER_AVATAR_ALT" />
        <h2 class="profile-page__nickname">{{ nickname }}</h2>
      </div>
      <dl class="profile-page__grid">
        <ProfileInfoCard
          v-for="card in cards"
          :key="card.key"
          :label="card.label"
          :value="card.value"
          :wide="card.wide"
        />
      </dl>
    </template>
  </div>
</template>

<style scoped lang="scss">
.profile-page__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.profile-page__nickname {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-title);
  overflow-wrap: anywhere;
}

// 手机单列,平板及以上 2 列
.profile-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--touch-gap-min);
  margin: 0;

  @media #{$mq-tablet-up} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }
}
</style>
