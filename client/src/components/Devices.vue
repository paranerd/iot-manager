<template>
  <div class="table-responsive">
    <table class="devices">
      <thead>
        <th>
          <Checkbox
            @change="toggleSelectAll"
            :checked="selected == devices.length"
          />
        </th>
        <th>Hostname</th>
        <th>Type</th>
        <th>IP</th>
        <th>Firmware</th>
        <th class="text-right">Actions</th>
      </thead>
      <tbody>
        <tr class="device" v-for="device in filteredDevices" :key="device.ip">
          <td>
            <Checkbox
              @change="select($event, device)"
              :checked="device.selected"
            />
          </td>
          <td>{{ device.hostname }}</td>
          <td>{{ device.type }}</td>
          <td>
            {{ device.ip }}
          </td>
          <td>
            {{ device.firmware.installed }}
            <span class="update-available" v-if="device.firmware.hasUpdate">
              <strong>({{ device.firmware.latest }})</strong>
            </span>
          </td>
          <td class="text-right">
            <a :href="'http://' + device.ip" target="_blank" class="btn btn-blue" title="Open">
              <font-awesome-icon icon="external-link-alt" />
            </a>
            <button
              class="btn btn-green"
              v-if="device.firmware.hasUpdate"
              title="Upgrade"
            >
              <font-awesome-icon icon="angle-double-up" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Checkbox from "@/components/Checkbox.vue";

export default {
  props: ["devices", "filter"],
  components: {
    Checkbox,
  },
  methods: {
    toggleSelectAll(e) {
      this.devices.forEach((device) => {
        device.selected = e.target.checked;
      });
    },
    select(e, device) {
      device.selected = e.target.checked;
    },
  },
  computed: {
    selected: function () {
      return this.devices.filter((device) => device.selected).length;
    },
    filteredDevices: function () {
      if (this.devices.length > 0) {
        const filtered = this.devices.filter(
          (obj) =>
            Object.values(obj).filter(
              (value) =>
                typeof value === "string" && value.indexOf(this.filter) > -1
            ).length > 0
        );

        return filtered;
      }

      return [];
    },
  },
};
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  white-space: nowrap;
  width: 100%;
}

table tbody,
table thead {
  width: 100%;
}

table td,
table th {
  border-top: 1px solid #ddd;
}

td:first-child,
th:first-child {
  padding-left: 15px !important;
}

td:last-child,
th:last-child {
  padding-right: 15px !important;
}

th {
  height: 50px;
  text-align: left;
}

th.text-right,
td.text-right {
  text-align: right;
}

.devices {
  width: 100%;
}

.device {
  height: 40px;
}

.devices td,
.devices th {
  padding: 5px;
}

tr:nth-child(even) {
  background: #fafafa;
}

tr:hover {
  background: #eee;
}

.btn {
  margin-left: 5px;
  height: 100%;
  border: none;
  border-radius: 2px;
  color: white;
  padding: 5px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  cursor: pointer;
}

.btn-green {
  background-color: #4caf50;
}

.btn-blue {
  background: #39cccc;
}

.update-available {
  color: #4caf50;
}
</style>
