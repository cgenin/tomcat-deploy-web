import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col, Card, Breadcrumb} from 'antd';
import {HOME} from "../../../routesConstant";
import {add} from "../../../modules/schedulers/actions";
import Title from "../../widgets/Title";
import {withRouter} from "react-router";

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  const type = query.type;
  const {schedulers, actions, nexus} = state;
  const {artifacts} = actions;
  return {schedulers, type, artifacts, nexus};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (scheduler, history) {
      dispatch(add(scheduler))
        .then(() => history.push(HOME.path()));
    },
  };
};


class Scheduler extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="add-scheduler">
        <Row>
          <Col offset={2} span={20}>
            <Breadcrumb style={{margin: '16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Add an Job</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Title text={`Add an Job (${this.props.type})`}/>
        <Row>
          <Col span={20} offset={2}>
            <Card style={{width: '100%'}}>

            </Card>
          </Col>
        </Row>¬
      </div>
    );
  }
}

Scheduler.propTypes = {schedulers: PropTypes.array.isRequired};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Scheduler));




