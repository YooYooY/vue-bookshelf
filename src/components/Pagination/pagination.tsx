import { defineComponent } from 'vue'
import './pagination.scss'

export default defineComponent({
  name: 'my-pagination',
  props: {
    total: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    currentChange: (currentPage: number) => true,
    'update:currentPage': (currentPage: number) => true,
  },
  setup(props, { emit }) {
    const pageNum = Math.ceil(props.total / props.pageSize)

    if (props.hideOnSinglePage && pageNum <= 1) {
      return () => null
    }

    const paginations: number[] = []
    for (let i = 1; i <= pageNum; i++) {
      paginations.push(i)
    }

    const classes = (index: number) => [
      'cvl-paginations-item',
      {
        'cvl-paginations-item-active': index === props.currentPage,
      },
    ]

    const handleClick = (index: number) => {
      emit('update:currentPage', index)
      emit('currentChange', index)
    }

    return () => (
      <div class="cvl-paginations">
        {paginations.map((i) => (
          <span class={classes(i)} onClick={() => handleClick(i)}>
            {i}
          </span>
        ))}
      </div>
    )
  },
})
