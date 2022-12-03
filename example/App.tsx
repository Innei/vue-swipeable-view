import { defineComponent, ref } from 'vue'

import { SwipeContainer } from '~/components/SwipeContainer'

import styles from './app.module.css'

const PageDataView = [
  {
    title: 'Page 1',
    dataset: Array.from({ length: 10 }, (_, i) => i),
  },

  {
    title: 'Page 2',
    dataset: Array.from({ length: 20 }, (_, i) => i),
  },

  {
    title: 'Page 3',
    dataset: Array.from({ length: 30 }, (_, i) => i),
  },
]

export const App = defineComponent({
  setup() {
    const tabIndex = ref(0)
    const currentProgress = ref(0)
    return () => (
      <div class={'flex flex-col h-screen overflow-hidden'}>
        <div class={styles['tabs']}>
          {PageDataView.map((page, index) => (
            <div class={styles['tab']} key={index}>
              {page.title}
            </div>
          ))}

          <div
            class={[styles['indicator']]}
            style={{
              transform: `translateX(calc(${tabIndex.value * 100}% + ${
                126 * currentProgress.value
              }px))`,
            }}
          />
        </div>
        <SwipeContainer
          rootClassName={styles.root}
          onPageViewTransition={(p) => {
            currentProgress.value = p
          }}
          onTabIndexChange={(index) => {
            tabIndex.value = index
          }}
        >
          {{
            default() {
              return PageDataView.map((item) =>
                item.dataset.map((item, index) => (
                  <div class={styles['item']} key={index}>
                    {item}
                  </div>
                )),
              )
            },
          }}
        </SwipeContainer>
      </div>
    )
  },
})
