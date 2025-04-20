<template>
  <div class="px-pls-m pt-4 pb-6 mb-[8rem]">
    <div class="flex justify-center font-bold items-center p-pls-m border border-pocket-border rounded-md">
      <a class="flex items-center gap-pls-xs" :href="formUrl" target="_blank">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM7 10H9C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10Z"></path></svg>
        <p>修正・追加の要望はありますか?</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackLink',
  props: {
    calcId: {
      type: String,
      required: true
    },
    calcTitle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const formUrl = encodeURI(
      "https://docs.google.com/forms/d/e/1FAIpQLSfmMKpVod9fPUtkcfC5u_kJ16NRCsmMLWFKgVvkLGNSPJErmw/viewform?usp=pp_url" +
      "&entry.2139251524=表計算" +
      "&entry.1085637990=" + props.calcId + "_" + props.calcTitle
    )

    return {
      formUrl
    }
  }
}
</script> 