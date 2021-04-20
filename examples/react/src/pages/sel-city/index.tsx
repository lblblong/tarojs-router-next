import { Button, View } from '@tarojs/components'
import React, { FC } from 'react'
import { Router } from 'tarojs-router-next'
import './index.css'

const Index: FC = () => {
  const cityList = [
    {
      id: 1,
      name: '深圳',
    },
    {
      id: 2,
      name: '广州',
    },
  ]

  const onSel = (index: number) => {
    Router.back(cityList[index])
  }

  return (
    <View>
      <View>
        {cityList.map((it, index) => {
          return (
            <View onClick={() => onSel(index)} className="item" key={it.id}>
              {it.name}
            </View>
          )
        })}
      </View>

      <Button
        onClick={() => {
          Router.back(Error('用户取消选择'))
        }}
      >
        取消选择
      </Button>
    </View>
  )
}

export default Index
