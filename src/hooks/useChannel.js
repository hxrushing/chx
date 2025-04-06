//封装获取频道列表的函数
import { useEffect, useState } from 'react'
import { getChannelAPI } from '@/apis/article'

function useChannel() {
    //获取频道列表所有的逻辑
    //获取频道列表
    const [channelList, setChannelList] = useState([])
    useEffect(() => {
      //封装函数，在函数体内调用接口
      const getChannelListAPI = async () => {
        const res = await getChannelAPI()
        setChannelList(res.data.channels)
      }
      getChannelListAPI()
    }, [])
    //把组件需要的数据返回出去
    return {channelList}
}
export {useChannel}