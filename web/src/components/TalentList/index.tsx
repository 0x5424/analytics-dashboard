import type {Component} from 'solid-js'
import {Show, For} from 'solid-js'

import styles from './TalentList.module.css'

export const TalentList: Component = ({talentList, newTalentName, setNewTalentName, handleCreateNewTalent, selectedTalent, selectNewTalent}) => {
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
              onclick={() => selectNewTalent({id, ...talent})}
            >
              {talent.name}
            </li>
          )}
        </For>
      </Show>
      <div>
        <hr class={styles.divider}/>
        <input
          type="text"
          placeholder="New talent name"
          value={newTalentName()}
          oninput={(e) => setNewTalentName(e.target.value)}
        />
        <button onclick={handleCreateNewTalent}>
          Create
        </button>
      </div>
    </nav>
  )
}
