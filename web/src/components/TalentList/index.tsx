import type { Component } from 'solid-js';
import { Show, For, createResource, createSignal } from "solid-js";
import { ref, get } from "firebase/database";

import { db } from '../../utils/database'

import styles from './TalentList.module.css';

const fetchTalents = async () => {
  const snapshot = await get(ref(db, '/talents'))

  return snapshot.val()
};

export const TalentList: Component = () => {
  const [talents] = createResource(fetchTalents);
  const [newTalentName, setNewTalentName] = createSignal("");
  let formattedTalents = []

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
              {([_id, talent]) => <li>{talent.name}</li>}
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
            <button onclick={() => console.log(newTalentName())}>
              Create
            </button>
          </div>
        </nav>
      )}
    </>
  )
}
