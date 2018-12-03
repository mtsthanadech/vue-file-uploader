<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <login-card/>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import LoginCard from '@/components/LoginCard.vue';

export default {
    name: "login",
    components: {
        "login-card": LoginCard
    }
};

</script>