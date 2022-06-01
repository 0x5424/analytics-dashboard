import type { Component } from 'solid-js';
import { createSignal, createResource } from "solid-js";

import styles from './Example.module.css';

const fetchPlanet = async (id) =>
  (await fetch(`https://swapi.dev/api/planets/${id}/`)).json();

export const Example: Component = () => {
  const [planetId, setPlanetId] = createSignal();
  const [planet] = createResource(planetId, fetchPlanet);

  return (
    <div class={styles.container}>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setPlanetId(e.currentTarget.value)}
      />
      <span>{planet.loading && "Loading..."}</span>
      <div>
        <pre>{JSON.stringify(planet(), null, 2)}</pre>
      </div>
    </div>
  );
};
