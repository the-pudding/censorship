<script>
  import { getContext } from "svelte";
  const copy = getContext("copy");
</script>

<section id="hero">
  <h1>{@html copy.hed}</h1>
  <time>{copy.time}</time>
  <p>{@html copy.byline1}</p>
  <p>{@html copy.byline2}</p>
</section>

<style>
  section {
    max-width: var(--col-width);
    margin: var(--32px) auto;
    text-align: center;
  }

  h1 {
    font-weight: bold;
    text-transform: uppercase;
    font-size: var(--48px);
    line-height: 1.2;
  }

  p {
    margin: 0 auto;
  }

  p:last-of-type,
  time {
    font-size: var(--16px);
  }

  @media only screen and (min-width: 30rem) {
    h1 {
      font-size: var(--64px);
    }

    p:last-of-type,
    time {
      font-size: var(--18px);
    }
  }

  @media only screen and (min-width: 60rem) {
    h1 {
      font-size: var(--96px);
    }

    p:last-of-type,
    time {
      font-size: var(--20px);
    }
  }
</style>
