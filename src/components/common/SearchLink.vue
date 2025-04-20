<template>
  <div class="px-pls-m">
    <div class="flex justify-center items-center">
      <a class="flex items-center justify-center gap-1 text-pls-bold border-pocket-border border font-bold rounded-md p-pls-xs w-full h-[42px]" :href="searchUrl" target="_blank">
        <p>ブラウザで検索する</p>
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchLink',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const searchUrl = encodeURI("https://www.google.com/search?q=" + props.searchText)

    return {
      searchUrl
    }
  }
}
</script> 