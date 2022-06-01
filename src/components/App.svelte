<script>
  import { getContext } from "svelte";
  import Test from "$components/Test.svelte";
  import Footer from "$components/Footer.svelte";

  const copy = getContext("copy");
</script>

<Test />
