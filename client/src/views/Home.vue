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
  created() {
    document.title = "Home";
  },
  async mounted() {
    try {
      const devices = await fetch(process.env.VUE_APP_API_URL + "/devices");

      this.devices = await devices.json();
    } catch (err) {
      console.error(err);
    }
  },
};
</script>
