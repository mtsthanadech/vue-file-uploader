<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Match Column">
                <b-form>
                    <li v-for="(column,index) in columns" :key="index" style="list-style-type:none;">
                        <b-input-group>
                            <b-input-group-text slot="append">
                                <strong>{{ column }}</strong>
                            </b-input-group-text>
                            <b-form-input></b-form-input>
                        </b-input-group>
                        </br>

                    </li>
                </b-form>
            </b-card>
        </div>
        
    </div>
</template>

<script>

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
