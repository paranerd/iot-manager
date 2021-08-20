<template>
  <!--<div class="devices">
    <li class="device" v-for="device in devices" :key="device.ip">
      <span class="hostname">
        {{ device.hostname }}
      </span>
    </li>
  </div>-->
  <table class="devices">
    <thead>
      <th>Hostname</th>
      <th>Type</th>
      <th>IP</th>
      <th>Firmware</th>
      <th>Update</th>
    </thead>
    <tbody>
      <tr class="device" v-for="device in devices" :key="device.ip">
        <td>{{ device.hostname }}</td>
        <td>{{ device.type }}</td>
        <td>
          <a :href="device.ip">{{ device.ip }}</a>
        </td>
        <td>{{ device.firmware.installed }}</td>
        <td>{{ device.firmware.hasUpdate ? device.firmware.latest : "no" }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["devices"],
};
</script>

<style>
table {
  border-collapse: collapse;
  border: 1px solid #ddd;
}
table td,
table th {
  border-top: 1px solid #ddd;
}
th {
  text-align: left;
}
.devices {
  width: 100%;
}

.device {
  height: 50px;
}

.devices td,
.devices th {
  padding: 5px;
}

.hostname {
  background: red;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
