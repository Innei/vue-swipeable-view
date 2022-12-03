import type { PropType } from 'vue'
import { defineComponent, onUnmounted, ref, watch } from 'vue'

import { throttle } from '../utils/index.js'
import styles from './index.module.css'

export const SwipeContainer = defineComponent({
  props: {
    rootClassName: {
      type: String,
    },
    margin: {
      type: Number,
      default: 10,
    },
    initialTabIndex: {
      type: Number,
      default: 0,
    },
    onScroll: {
      type: Function as PropType<(e: UIEvent) => any>,
    },
    onPageViewTransition: {
      type: Function as PropType<(progress: number) => any>,
    },
    onTabIndexChange: {
      type: Function as PropType<(index: number) => any>,
    },
  },
  expose: ['scrollTo', 'getCurrentIndex'],
  setup(props, { attrs, slots, expose }) {
    // TODO
    const currentIndex = ref(props.initialTabIndex)

    const containerRef = ref<HTMLDivElement>()
    const innerContainerRef = ref<HTMLDivElement>()

    const updateRef = ref(0)
    const forceUpdate = () => {
      updateRef.value += 1
    }

    let memoedChildContainerWidth = 0

    const childStyle = {
      width: `100%`,
      marginRight: `${props.margin}px`,
    }

    let ob: ResizeObserver
    watch(
      () => containerRef.value,
      (containerRef) => {
        if (!containerRef) {
          return
        }

        ob = new ResizeObserver(() => {
          forceUpdate()
          calChild(containerRef)
        })
        function calChild(containerRef: HTMLDivElement) {
          const $child = containerRef.children.item(0)
          if ($child) {
            memoedChildContainerWidth = $child.clientWidth
          }
        }

        calChild(containerRef)

        ob.observe(containerRef)
      },
    )

    onUnmounted(() => {
      ob.disconnect()
    })

    const handleOnScroll = throttle((e: UIEvent) => {
      props.onScroll?.(e)

      const $ = e.target as HTMLDivElement

      const index = Math.floor(
        ($.scrollLeft + props.margin) / memoedChildContainerWidth,
      )
      currentIndex.value = index

      props.onTabIndexChange?.(index)

      if (props.onPageViewTransition) {
        const progress =
          ($.scrollLeft + props.margin) / memoedChildContainerWidth
        props.onPageViewTransition(progress - index)
      }
    }, 60)

    const scrollTo = (i: number) => {
      if (!containerRef.value) {
        return
      }

      containerRef.value.scrollTo({
        left: memoedChildContainerWidth * i,
        behavior: 'smooth',
      })
    }

    expose({
      scrollTo,
      getCurrentIndex: () => currentIndex.value,
    })

    return () => {
      const children = Array.isArray(slots.default?.())
        ? slots.default?.()
        : [slots.default?.()]
      return (
        <div
          class={[styles['root'], props.rootClassName]}
          ref={containerRef}
          {...attrs}
        >
          <div
            class={[styles['container']]}
            ref={innerContainerRef}
            onScroll={handleOnScroll}
          >
            {children?.map((child, i) => {
              return (
                <div class={styles['child']} style={childStyle} key={i}>
                  {child}
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  },
})
