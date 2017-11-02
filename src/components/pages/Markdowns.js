import React from 'react';
import {Link} from 'react-router-dom'
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
      <div className="row">
        <div className="panel panel-default col-xs-offset-1 col-xs-10">
          <div className="panel-body">

            <Link to="/"><i className="fa fa-chevron-left"/>&nbsp;Back to the main screen</Link>
            <hr/>
            <div className="markdown-body" dangerouslySetInnerHTML={{__html: html}}/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default [...markdowns.keys()].map(k => {
  return {
    path: `/md/${k}`,
    component: () => <MdWrapper title={k} html={markdowns.get(k).__content}/>
  };
});


