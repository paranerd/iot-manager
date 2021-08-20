<template>
  <div class="home">
    <Devices :devices="devices" />
  </div>
</template>

<script>
// @ is an alias to /src
import Devices from "@/components/Devices.vue";

export default {
  name: "Home",
  components: {
    Devices,
  },
  data() {
    return {
      devices: [],
    };
  },
  async mounted() {
    console.log("I am mounted in dist?");
    try {
      const devices = await fetch("http://localhost:8098/api/devices");

      this.devices = await devices.json();

      console.log(this.devices);
    } catch (err) {
      console.error(err);
    }
  },
};
</script>
