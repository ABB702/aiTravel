<script setup>
import { BUDGET_RANGE } from '@/constants/budget.js'
import { TRAVELER_RANGE } from '@/constants/traveler.js'
import { validatePlan } from '@/utils/validators.js'

/**
 * 旅程规划表单:目的地、预算、出行人数。
 * 表单值由父组件持有(v-model),子组件不直接修改 props。
 * 提交时先校验:通过才触发 submit,不通过则触发 invalid 并把错误交给父组件显示。
 */
const props = defineProps({
  /** 表单值 { destination, budget, travelerCount } */
  modelValue: { type: Object, required: true },
  /** 是否正在提交(禁用按钮并显示加载) */
  submitting: { type: Boolean, default: false },
  /** 字段错误提示 { destination?, budget?, travelerCount? } */
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits({
  'update:modelValue': (value) => typeof value === 'object' && value !== null,
  /** 校验通过,参数为目的地已去除首尾空白的表单值 */
  submit: (plan) => typeof plan === 'object' && plan !== null,
  /** 校验失败,参数为字段错误提示 */
  invalid: (errors) => typeof errors === 'object' && errors !== null,
  /** 用户修改了某个字段,父组件应清除该字段的错误 */
  'clear-error': (field) => typeof field === 'string',
})

/**
 * 更新单个字段。
 *
 * @param {'destination' | 'budget' | 'travelerCount'} field 字段名
 * @param {string | number | null | undefined} value 新值
 */
function updateField(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value ?? null })
  emit('clear-error', field)
}

/** 提交表单:先校验,通过后才触发 submit */
function handleSubmit() {
  const errors = validatePlan(props.modelValue)
  if (Object.keys(errors).length > 0) {
    emit('invalid', errors)
    return
  }
  emit('submit', { ...props.modelValue, destination: props.modelValue.destination.trim() })
}
</script>

<template>
  <el-form class="plan-form" label-position="top" @submit.prevent="handleSubmit">
    <el-form-item label="目的地" :error="errors.destination">
      <el-input
        :model-value="modelValue.destination"
        placeholder="想去哪里?也可以点击下方推荐目的地"
        clearable
        @update:model-value="updateField('destination', $event ?? '')"
      />
    </el-form-item>
    <div class="plan-form__row">
      <el-form-item class="plan-form__field" label="预算(元)" :error="errors.budget">
        <el-input-number
          :model-value="modelValue.budget"
          :min="BUDGET_RANGE.min"
          :max="BUDGET_RANGE.max"
          :step="100"
          :value-on-clear="null"
          placeholder="请输入预算"
          @update:model-value="updateField('budget', $event)"
        />
      </el-form-item>
      <el-form-item class="plan-form__field" label="出行人数" :error="errors.travelerCount">
        <el-input-number
          :model-value="modelValue.travelerCount"
          :min="TRAVELER_RANGE.min"
          :max="TRAVELER_RANGE.max"
          :precision="0"
          step-strictly
          :value-on-clear="null"
          placeholder="请输入人数"
          @update:model-value="updateField('travelerCount', $event)"
        />
      </el-form-item>
    </div>
    <el-button
      type="primary"
      native-type="submit"
      class="plan-form__submit"
      :loading="submitting"
      :disabled="submitting"
    >
      开始规划
    </el-button>
  </el-form>
</template>

<style scoped lang="scss">
.plan-form__row {
  display: flex;
  flex-direction: column;

  @media #{$mq-tablet-up} {
    flex-direction: row;
    gap: var(--space-4);
  }
}

.plan-form__field {
  flex: 1;
}

.plan-form__field :deep(.el-input-number) {
  width: 100%;
}

.plan-form__submit {
  width: 100%;
}
</style>
