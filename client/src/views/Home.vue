<template>
  <div class="home">
    <form class="filter col-8">
      <input v-model="filter" type="text" placeholder="Filter" />
    </form>
    <Devices :devices="devices" :filter="filter" />
  </div>
</template>

<script>
import Devices from "@/components/Devices.vue";

export default {
  name: "Home",
  components: {
    Devices,
  },
  data() {
    return {
      devices: [],
      filter: "",
    };
  },
  created() {
    document.title = `Home | ${process.env.VUE_APP_APP_NAME}`;
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

<style lang="scss" scoped>
.home {
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
}

.filter {
  border: 1px solid red;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-color: #cbd5e0;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.filter input {
  height: 3rem;
  width: 100%;
  font-size: 1rem;
  border: 0 solid white;
  outline: none;
}

.filter input:focus {
  border-bottom: 1px solid #001f3f;
}
</style>
