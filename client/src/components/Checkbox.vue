<template>
  <label class="checkbox">
    <input class="form-checkbox" type="checkbox" :checked="checked" />
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: ["label", "checked"],
};
</script>

<style>
input[type="checkbox"] {
  height: 1.5rem;
  width: 1.5rem;
  appearance: none;
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  flex-shrink: 0;
  background: #fff;
  cursor: pointer;
  border: 1px solid #bac4cf; /*#cbd5e0;*/
  border-radius: 0.25rem;
}

input[type="checkbox"]:hover {
  background-color: #34568b;
}

input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  background-color: #34568b;
}

label.checkbox span {
  margin-left: 5px;
}
</style>
