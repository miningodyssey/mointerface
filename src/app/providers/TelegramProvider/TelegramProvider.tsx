import { createContext, useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { TelegramUser, WebApp } from './types'
import {FCWithChildren} from "@/types/app";

export type TelegramContextType = {
  webApp?: WebApp
  user?: TelegramUser
}

export const TelegramContext = createContext<TelegramContextType>({})

export const TelegramProvider: FCWithChildren = (props) => {
  const { children } = props

  const [webApp, setWebApp] = useState<WebApp | null>(null)

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp

    if (app) {
      app.ready()

      setWebApp(app)
    }
  }, [])

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp.initDataUnsafe,
          user: webApp.initDataUnsafe.user,
        }
      : {}
  }, [webApp])

  return (
    <TelegramContext.Provider value={value}>
      <Script src="/js/telegram-web-app.js" strategy="beforeInteractive" />
      {children}
    </TelegramContext.Provider>
  )
}
