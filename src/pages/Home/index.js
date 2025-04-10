import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, // 正确图标名称
  CheckCircleOutlined,
  ReadOutlined 
} from '@ant-design/icons';
import { getArticleListAPI, getChannelAPI } from '@/apis/article';
import BarChart from "./componens/BarChart";
import './index.scss';

const Home = () => {
  // 获取文章数据
  const [stats, setStats] = useState({});
  // 获取频道数据
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    // 获取文章统计数据
    const fetchArticles = async () => {
      const { data } = await getArticleListAPI({ 
        status: undefined,
        per_page: 1000 // 获取足够多的数据用于统计
      });
      const today = new Date().toISOString().split('T')[0];
      
      // 新增统计逻辑
      const pendingCount = data.results.filter(art => art.status === 1).length;
      const totalComments = data.results.reduce((sum, art) => sum + (art.comment_count || 0), 0);
      
      setStats({
        totalArticles: data.total_count,
        todayNew: data.results.filter(art => art.pubdate?.startsWith?.(today)).length, // 改为pubdate字段
        pendingReview: pendingCount,  // 待审文章数
        totalComments: totalComments   // 总评论数
      });
      
      // 在生成图表数据处修改（约第35行）
      const genChartData = (articles = []) => {
        const days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();
      
        return {
          xData: days,
          yData: days.map(day => 
            articles.filter(art => art.pubdate?.startsWith?.(day)).length
          )
        };
      };
    };

    // 获取频道数据
    const fetchChannels = async () => {
      const { data } = await getChannelAPI();
      setChannels(data.channels);
    };

    fetchArticles();
    fetchChannels();
  }, []);

  // 生成图表数据
  const genChartData = (articles) => {
    // 近7天发布趋势（示例实现）
    const days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return {
      xData: days,
      yData: days.map(day => 
        articles.filter(art => art.pub_date.startsWith(day)).length
      )
    };
  };

  return (
    <div className="home">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总文章数"
              value={stats.totalArticles || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={stats.todayNew || 0}
              prefix={<ReadOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="待审文章" bordered={false}>
            <div className="stat-number">{stats.pendingReview || 0} 篇</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="总评论数" bordered={false}>
            <div className="stat-number">{stats.totalComments || 0} 条</div>
          </Card>
        </Col>
      </Row>

      {/* 图表展示区 */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="内容趋势">
            <BarChart title={'文章发布趋势'} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="热门分类">
            <BarChart title={'最受欢迎频道'} />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Card title="最近动态" style={{ marginTop: 20 }}>
        <div className="recent-activities">
          <p>• 用户张三发布了新文章《React最佳实践》</p>
          <p>• 李四的文章《前端优化方案》通过审核</p>
          <p>• 系统于 09:00 完成每日备份</p>
        </div>
      </Card>
    </div>
  )
}

export default Home