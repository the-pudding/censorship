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

  :global(h1 mark) {
    position: relative;
    display: inline-block;
  }

  :global(h1 mark:before) {
    left: 0;
    background: url("/assets/images/title-before.jpg");
    transform: translate(-100%, 0);
  }

  :global(h1 mark:after) {
    right: 0;
    background: url("/assets/images/title-after.jpg");
    transform: translate(100%, 0);
  }

  :global(h1 mark:before, h1 mark:after) {
    content: "";
    position: absolute;
    top: 0;
    width: 12rem;
    height: 100%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border: 4px solid var(--color-primary);
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
