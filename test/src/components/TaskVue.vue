<template>
	<div class="to-doo__items">
      <div class="to-doo__item" v-for="item in todayItems" :key="item.id">
        <input v-model="item.checkbox" type="checkbox" >
        <p @click="change(item)" v-if="!item.change" :class= "{ active : item.checkbox}">{{item.text}}</p>
        <input @change="change(item)" class="to-doo__tems-change" v-else type="text" v-model = "item.text">
        <MyButton class="btn" title='Удалить' @click="$emit('deleteItem', item ,todayItems )" />
      </div>
    </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

import MyButton from "./MyButton.vue"
const props = defineProps(['todayItems']);
const emits = defineEmits(['deleteItem']);

function change(item)
{
  item.change = !item.change
}
</script>

<style lang="css" scoped>
  .btn
  {
    width:100px;
    height: 30px;
    border: 1px solid #000000F0;
  }
</style>