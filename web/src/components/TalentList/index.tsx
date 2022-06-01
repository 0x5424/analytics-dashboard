import type {Component} from 'solid-js'
import {Show, For, createResource, createSignal} from 'solid-js'

import {fetchTalents, createTalent} from '../../utils/database'

import styles from './TalentList.module.css'

export const TalentList: Component = () => {
  const [talents] = createResource(fetchTalents)
  const [newTalentName, setNewTalentName] = createSignal('')

  return (
    <>
      {talents.loading ? <span>Loading...</span> : (
        <nav class={styles.list}>
          <div>
            <h2>Talent list</h2>
            <hr class={styles.divider}/>
          </div>
          <Show when={talents()} fallback={<span>No talents yet</span>}>
            <For each={Object.entries(talents())}>
              {([/* id */, talent]) => <li>{talent.name}</li>}
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
            <button onclick={() => createTalent(newTalentName())}>
              Create
            </button>
          </div>
        </nav>
      )}
    </>
  )
}
