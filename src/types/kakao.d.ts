declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (obj: {
          objectType: string
          text: string
          link: { mobileWebUrl: string; webUrl: string }
        }) => void
      }
    }
  }
}

export {}
