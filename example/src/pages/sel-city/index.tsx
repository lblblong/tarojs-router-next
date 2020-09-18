import React, { FC } from 'react'
import { View, Button } from '@tarojs/components'
import { useRouter } from 'tarojs-router'
import './index.css'

const Index: FC = () => {
  const { backData, backError } = useRouter()
  const cityList = [
    {
      id: 1,
      name: '深圳'
    },
    {
      id: 2,
      name: '广州'
    }
  ]

  const onSel = (index: number) => {
    backData(cityList[index])
  }

  return (
    <View>
      <View>
        {cityList.map((it, index) => {
          return (
            <View onClick={() => onSel(index)} className='item' key={it.id}>
              {it.name}
            </View>
          )
        })}
      </View>

      <Button
        onClick={() => {
          backError(new Error('用户取消选择'))
        }}
      >
        取消选择
      </Button>
    </View>
  )
}

export default Index
