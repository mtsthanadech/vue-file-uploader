<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">
            <ul>
                <!-- <li v-for="column in columns">{{ column }}</li> -->
            </ul>
            <!-- <li v-for-key=""></li> -->
            <li v-for="(column,index) in columns" :key="index">
                <!-- this is column : {{column}} -->
                <input type="text" v-model="matchColumns[index]" placeholder="">{{column}}
            </li>
        </div>
        
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
    name: "MatchColumn",
    data() {
        return {
            columns: ['ant', 'bird', 'cat', 'dog', 'egg'],
            matchColumns: [],
            error: false
        }
    }
}
</script>
