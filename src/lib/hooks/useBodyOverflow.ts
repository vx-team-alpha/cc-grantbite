export function useBodyOverflow(node: HTMLElement, condition: boolean) {
  const body = document.body
  const html = document.documentElement

  function update(shouldHide: boolean) {
    if (shouldHide) {
      // Store current scroll position
      const scrollY = window.scrollY

      // Apply styles to both html and body for better iOS support
      html.style.overflow = "hidden"
      html.style.position = "fixed"
      html.style.top = `-${scrollY}px`
      html.style.left = "0"
      html.style.right = "0"
      html.style.bottom = "0"

      body.style.overflow = "hidden"
      body.style.position = "fixed"
      body.style.top = `-${scrollY}px`
      body.style.left = "0"
      body.style.right = "0"
      body.style.bottom = "0"
      body.style.width = "100%"
      body.style.height = "100%"

      // Store scroll position for restoration
      body.setAttribute("data-scroll-y", scrollY.toString())
    } else {
      // Get stored scroll position
      const scrollY = parseInt(body.getAttribute("data-scroll-y") || "0", 10)

      // Remove styles from both html and body
      html.style.overflow = ""
      html.style.position = ""
      html.style.top = ""
      html.style.left = ""
      html.style.right = ""
      html.style.bottom = ""

      body.style.overflow = ""
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      body.style.bottom = ""
      body.style.width = ""
      body.style.height = ""

      body.removeAttribute("data-scroll-y")

      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }

  // Initial set
  update(condition)

  return {
    update(newCondition: boolean) {
      update(newCondition)
    },
    destroy() {
      // Clean up on destroy
      update(false)
    },
  }
}
