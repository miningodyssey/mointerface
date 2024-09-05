import { FC, PropsWithChildren } from 'react'

  export interface DefaultTheme {
    color: {
      bg: string
      bgSecondary: string
      text: string
      hint: string
      link: string
      btn: string
      btnText: string
    }
  }

export type FCWithChildren<T = {}> = FC<PropsWithChildren<T>>
