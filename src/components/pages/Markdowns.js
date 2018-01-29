import React from 'react';
import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'antd'
import 'github-markdown-css'

import Title from '../widgets/Title'

const webpackCtx = require.context('!markdown-with-front-matter-loader!./_mds', false, /.md$/);
const markdowns = webpackCtx.keys().reduce(
  (memo, fileName) => memo.set(fileName.match(/.\/([^.]+).*/)[1], webpackCtx(fileName)),
  new Map());
const MdWrapper = (props) => {
  const {html, title} = props;
  return (
    <div>
      <Title text={title}/>
      <Row>
        <Col offset={2} span={20}>
          <Card style={{width: '100%'}}>
          <Link to="/"><i className="fa fa-chevron-left"/>&nbsp;Back to the main screen</Link>
          <hr/>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: html}}/>
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default [...markdowns.keys()].map(k => {
  return {
    path: `/md/${k}`,
    component: () => <MdWrapper title={k} html={markdowns.get(k).__content}/>
  };
});


