import type {Component} from 'solid-js'
import {createSignal, Show, For} from 'solid-js'

import styles from './TalentList.module.css'

export const TalentList: Component = ({talentList, handleCreateNewTalent, selectedTalent, setTalentId}) => {
  let valueRef
  const [editMode, setEditMode] = createSignal(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    handleCreateNewTalent(valueRef.value)
    setEditMode(false)
  }

  return (
    <nav class={styles.list}>
      <div>
        <h2>Talent list</h2>
        <hr class={styles.divider}/>
      </div>
      <Show when={talentList()} fallback={<span>No talents yet</span>}>
        <For each={Object.entries(talentList())}>
          {([id, talent]) => (
            <li
              class={(selectedTalent() && selectedTalent().id === id) ? styles.selected : null}
              onclick={() => setTalentId(id)}
            >
              {talent.name}
            </li>
          )}
        </For>
      </Show>
      <div>
        <hr class={styles.divider}/>
        <div class={styles.centered}>
        {editMode() ? (
          <>
            <form onsubmit={handleSubmit}>
              <input
                type="text"
                placeholder="New talent name"
                ref={valueRef}
              />
            </form>
            <button onclick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button  onclick={() => setEditMode(true)}>
            Create
          </button>
        )}
        </div>
      </div>
    </nav>
  )
}
