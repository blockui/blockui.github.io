export default class PageLoadingHelper {
  static setLoading(loading) {
    PageLoadingHelper.loading = loading
  }

  static isLoading() {
    return PageLoadingHelper.loading
  }
}

PageLoadingHelper.loading = false
