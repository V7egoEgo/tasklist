<template>
	<button>{{title}}</button>
</template>
<script setup>
import {defineProps, defineEmits} from 'vue';
const props = defineProps(['title'])
</script>

<style lang="css" scoped>

</style>