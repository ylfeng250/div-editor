<template>
    <div>
        <ul class="emoji-list" @click="selectEmoji">
            <li v-for="(url,emoji) in emojiMap" :key="emoji" class="emoji-item">
                <img :src="url" :alt="emoji">
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .emoji-list{
        width: 200px;
        height: auto;
        border: 1px solid;
        margin: 0px;
        padding: 2px;
        display: flex;
        flex-basis: 100%;
        flex-wrap:wrap;
        align-items: flex-start;
    }
    .emoji-item{
        list-style: none;
        cursor: pointer;
        border: 1px solid #ffffff;
    }
    .emoji-item:hover {
        border: 1px solid blue;
    }
</style>

<script>
import { emojiMap } from '../utils/emojis';
export default {
    name: 'emoji-box',
    data () {
        return {
            emojiMap: emojiMap
        }
    },
    methods: {
        selectEmoji (event) {
            var emoji = event.target
            if (emoji.nodeName === 'IMG') {
                this.$emit('select', emoji.alt)
            }
        }
    }
}
</script>