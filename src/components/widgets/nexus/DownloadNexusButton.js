import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Icon, Spin} from 'antd';

const transform = (artifact) => {

  const {groupId, artifactId, version, name} = artifact;
  return {name, url: `/api/nexus/download/${groupId}/${artifactId}/${version}/to/${name}`};

};

const toObject = (acc, tag) => {
  const n = {};
  n[tag.name] = {...tag};
  return Object.assign({}, acc, n);
};

class DownloadItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, donwloaded: false
    };
    this.onDownload = this.onDownload.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  componentDidMount() {
    this.onDownload();
    fetch(this.props.item.url)
      .then(res => res.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(blob);
        const tagA = document.createElement('a');
        tagA.setAttribute('href', blobURL);
        tagA.style.display = 'none';
        tagA.setAttribute('download', `${this.props.item.name}.war`);
        this.mainTag.appendChild(tagA);
        tagA.click();
        this.onEnd();
      });
  }

  onDownload() {
    this.setState({loading: true});
  }

  onEnd() {
    this.setState({loading: false, donwloaded: true});
  }

  render() {
    const {item} = this.props;
    const downloaded = (this.state.donwloaded) ? <Icon type="check"/> : null;
    const load = (this.state.loading) ? <Spin/> : null;
    return (
      <p ref={elm => this.mainTag = elm}>{item.name} : {downloaded} {load}</p>
    );
  }
}

DownloadItem.propTypes = {
  item: PropTypes.object.isRequired,
};

class ModalDownload extends React.PureComponent {

  render() {
    const list = Object.keys(this.props.tags)
      .map((key) => {
        const obj = this.props.tags[key];
        return {...obj};
      })
      .map(item => (
        <DownloadItem key={item.name} item={item}/>
      ));

    return (
      <Modal
        title="Download selected Nexus artifacts"
        visible={true}
        onOk={this.props.close}
        onCancel={this.props.close}
        footer={
          <Button key="close" type="primary" onClick={this.props.close}>
            Close
          </Button>
        }
      >
        {list}
      </Modal>);
  }
}

ModalDownload.propTypes = {
  tags: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default class DownloadNexusButton extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.showModal = this.showModal.bind(this);
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  render() {
    if (this.props.tags.length === 0) {
      return <div/>;
    }

    const tags = this.props.tags
      .map(transform)
      .reduce(toObject, {});
    const modal = (this.state.visible) ? (
      <ModalDownload
        tags={tags}
        close={() => this.setState({visible: false})}
      />
    ) : null;
    return (
      <div>
        <Button type="button" onClick={this.showModal}>
          <i className="fa fa-download"/>
          &nbsp;Download
        </Button>
        {modal}
      </div>
    );
  }
}

DownloadNexusButton.propTypes = {
  tags: PropTypes.array.isRequired,
};
