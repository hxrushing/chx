import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
  } from 'antd'
  import { PlusOutlined } from '@ant-design/icons'
  import { Link, useSearchParams } from 'react-router-dom'
  import './index.scss'
  import ReactQuill from 'react-quill'
  import 'react-quill/dist/quill.snow.css'
  import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article'
  import { useEffect, useState } from'react'
  import { useChannel } from '@/hooks/useChannel'
  const { Option } = Select
  
  const Publish = () => {
    //获取频道列表
    const { channelList } = useChannel()
    //表单提交
    const onFinish = (formValue) => {
      //校验封面类型
      if(imageList.length !== imageType){
        return message.warning('封面类型与图片数量不匹配')
      }
      //按照接口文档的格式处理收集到的表单数据
      const { title, content, channel_id } = formValue
      const reqData = {
        title,
        content,
        cover: {
          type: imageType,
          images: imageList.map(item => {
            if(item.response){
              return item.response.data.url
            }else{ 
              return item.url
            }
          }),
        },
        channel_id
      }
      //调用接口提交
      if(articleId){
        //编辑
        updateArticleAPI({...reqData, id: articleId})
      }else{
        createArticleAPI(reqData)
      }
    }
    //上传回调
    const [imageList, setImageList] = useState([])
    const onChange = (value) => {
      setImageList(value.fileList)
    }
    //切换图片封面类型
    const [imageType, setImageType] = useState(0)
    const onTypeChange = (e) => {
      setImageType(e.target.value)
    }
    
    //回填数据
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id') 
    //获取实例
    const [form] = Form.useForm()
    useEffect(() => {
      //通过id获取文章详情
      async function getArticleDetail() {
        const res = await getArticleById(articleId)
        const data = res.data
        const { cover } = data
        form.setFieldsValue({
          ...data,
          type: cover.type,
        })
        //回填图片类型
        setImageType(cover.type)
        //显示图片
        setImageList(cover.images.map(url => {
          return { url,}
        }))
      } 
      if(articleId){
        getArticleDetail()  
      }
      //调用实例方法 完成回填
    }, [articleId, form])

    return (
      <div className="publish">
        <Card 
          title={
            <Breadcrumb items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: `${articleId ? '编辑' : '发布'}文章` },
            ]}
            />
          }
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 0 }}
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="频道"
              name="channel_id"
              rules={[{ required: true, message: '请选择文章频道' }]}
            >
              <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType>0 && <Upload
              listType="picture-card"
              showUploadList
              action={'http://geek.itheima.net/v1_0/upload'}
              name="image"
              onChange={onChange}
              maxCount={imageType}
              fileList={imageList}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
          </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请输入文章内容' }]}
            >
                {/* 富文本编辑器 */}
                <ReactQuill 
                    className='publish-quill'
                    theme='snow'
                    placeholder='请输入文章内容'
                />
            </Form.Item>
  
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  发布文章
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  
  export default Publish