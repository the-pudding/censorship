<script>
  export let options = [];
  export let legend = "";
  export let legendPosition = "top";
  export let labelClass = "";
  export let disabled = false;
  export let value = options.length ? options[0].value : "";

  const id = `legend-${Math.floor(Math.random() * 1000000)}`;
  const makeSlug = (str = "") => `${str}`.toLowerCase().replace(/\W/g, "");

  $: optionsWithSlug = options.map((d) => ({
    ...d,
    val: d.value,
    slug: makeSlug(d.value)
  }));
  $: isTop = legendPosition === "top";
</script>

<div class="button-set">
  <div
    id={`group-${id}`}
    class="group"
    class:is-top={isTop}
    role="radiogroup"
    aria-labelledby={`label-${id}`}
  >
    {#if legend}<div class="legend" id="group-{id}">{legend}</div>{/if}
    <div class="options">
      {#each optionsWithSlug as option}
        <div class="option">
          <input
            type="radio"
            id={`${id}-${option.slug}`}
            name="name-{id}"
            class="sr-only"
            value={option.value}
            {disabled}
            bind:group={value}
          />
          <label class="option {labelClass}" for={`${id}-${option.slug}`}>
            {option.label || option.value}
          </label>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .button-set {
    display: inline-block;
  }

  .group {
    display: flex;
    align-items: center;
  }

  .group.is-top {
    flex-direction: column;
  }

  .is-top .legend {
    padding-bottom: 0.5em;
    padding-right: 0;
  }

  .legend {
    padding-right: 0.5em;
    font-size: 1em;
  }

  .options {
    display: flex;
  }

  label {
    appearance: none;
    user-select: none;
    line-height: 1;
    padding: 0.5em;
    border-radius: 0;
    margin: 1px;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    font-size: var(--14px);
    display: inline-block;
    text-align: center;
    width: var(--width, "auto");
  }

  .option + .option label {
    border-left-width: 0;
  }

  .option:first-of-type label {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }

  .option:last-of-type label {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
  }

  .option + .option > label {
    border-left-width: 0;
  }

  input[type="radio"] + label {
    background: var(--color-button-bg);
    color: var(--color-button-fg);
    font-weight: bold;
    opacity: 1;
  }

  input[type="radio"]:checked + label,
  input[type="radio"]:checked:hover + label {
    background: var(--color-primary);
    opacity: 1;
  }

  input[type="radio"]:hover + label {
    background: var(--color-gray-100);
    opacity: 1;
  }

  input[type="radio"]:focus + label {
    outline: 2px solid var(--color-focus);
  }

  input[type="radio"]:disabled + label {
    color: var(--color-gray-700);
    background: var(--color-gray-500);
    cursor: not-allowed;
  }

  @media screen and (min-width: 40rem) {
    label {
      font-size: var(--16px);
    }
  }
</style>
