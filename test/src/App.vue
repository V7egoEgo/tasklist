

<template>
  <div class="to-doo__box">
    <h2>На Сегодня <strong>{{day}}. {{mounth[mounthNum-1]}}. {{year}}</strong></h2>
    <TaskVue :todayItems="nextday"/>
    <!-- второй компонент -->
    <h2>На Завтра <strong>{{day+1}}. {{mounth[mounthNum-1]}}. {{year}}</strong></h2>
      <TaskVue :todayItems="today"/>
      <MyButton class="btn"  :title = "title"/>
  </div>

</template>
<script setup>
import { ref , reactive } from 'vue';

import MyButton from './components/MyButton.vue';
import TaskVue from './components/taskVue.vue';

const checkedValue = ref(false);
const categoriesChoice = ref(false)
const date = new Date();
const day = date.getUTCDate();
const mounthNum = date.getMonth();
const year = date.getFullYear();
const title = "Добавить задачу";
const mounth =
[
 'Январь',
 'Февраль',
 'Март',
 'Апрель',
 'Май',
 'Июнь',
 'Июль',
 'Август',
 'Сентябрь',
 'Ноябрь',
 'Декабрь',
];
const  today = reactive([
  {
    change :ref(false),
    checkbox:ref(false),
    id:1,
    text:"Lorem nostrud eiusmod id duis 1est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:2,
    text:"1 Lorem nostrud eiusmod id duis 2est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:3,
    text:"1 Lorem nostrud eiusmod id duis 3est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:4,
    text:"1 Lorem nostrud eiusmod id duis 4est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:5,
    text:"1 Lorem nostrud eiusmod id duis 5est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:6,
    text:"1 Lorem nostrud eiusmod id duis 6est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  }
])
const  nextday = reactive([
  {
    change :ref(false),
    checkbox:ref(false),
    id:1,
    text:"Lorem nostrud eiusmod id duis 1est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:2,
    text:"Lorem nostrud eiusmod id duis 2est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:3,
    text:"Lorem nostrud eiusmod id duis 3est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:4,
    text:"Lorem nostrud eiusmod id duis 4est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:5,
    text:"Lorem nostrud eiusmod id duis 5est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  },
  {
    change :ref(false),
    checkbox:ref(false),
    id:6,
    text:"Lorem nostrud eiusmod id duis 6est commodo elit velit Lorem aute laborum consequat exercitation aute.",
  }
])
function change(item)
{
  item.change = !item.change
}
</script>
<style>
.to-doo__item
{
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.to-doo__box
{
  padding: 20px;
  width: 560px ;
}
.to-doo__items
{
  display: flex;
  flex-direction: column;
  width: 520px;

}
.to-doo__items > label
{
  display: flex;
  margin-bottom: 12px;
  color:  #4F4F4F;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  gap: 10px;
}
.active
{
  text-decoration: line-through ;
}
h2
{
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 12px;
}
.btn
{
  border-radius: 4px;
  background: #27AE60;
  width: 100%;
  height: 48px;
  border: none;
  color: #fff;
}
.to-doo__tems-change
{
  width: 475px;
}
</style>
