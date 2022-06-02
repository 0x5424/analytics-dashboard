import type {Component} from 'solid-js'
import {createSignal, createEffect} from 'solid-js'

import styles from './TalentName.module.css'

export const TalentName: Component = ({selectedTalent, updateTalentName}) => {
  // const [newName, setNewTalentName] = createSignal(selectedTalent().name)
  let valueRef
  const [editMode, setEditMode] = createSignal(false)

  createEffect(() => {
    // Here we effectively subscribe to changes in selectedTalent:
    selectedTalent()

    // ...Then ensure editMode is turned off
    setEditMode(false)
  })

  const toggleEditMode = () => setEditMode(!editMode())

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      id: selectedTalent().id,
      name: valueRef.value
    }

    updateTalentName(payload)
    setEditMode(false)
  }

  return (
    <header class={styles.header}>
      <h2
        class={styles.title}
        onclick={toggleEditMode}
      >
        {selectedTalent().name}
      </h2>
      {editMode() && (
        <form class={styles.updateField} onsubmit={handleSubmit}>
          <input
            type="text"
            placeholder={selectedTalent().name}
            // value={newName()}
            // oninput={(e) => setNewTalentName(e.target.value)}
            ref={valueRef}
          />
        </form>
      )}
    </header>
  )
}
