import { reactive, Ref, ref, watch } from 'vue'

export interface PageOption {
  pageSize?: number
}

export function usePages<T>(watchCallback: () => T[], pageOption?: PageOption) {
  const { pageSize = 10 } = pageOption || {}

  const rawData = ref([]) as Ref<T[]>
  const data = ref([]) as Ref<T[]>

  const bindings = reactive({
    current: 1,
    currentChange: (currentPage: number) => {
      data.value = sliceData(rawData.value, currentPage)
    },
  })

  const sliceData = (rawData: T[], currentPage: number) => {
    return rawData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }

  watch(
    watchCallback,
    (value) => {      
      rawData.value = value
      bindings.currentChange(1)
    },
    {
      immediate: true,
    }
  )

  return {
    data,
    bindings,
  }
}
