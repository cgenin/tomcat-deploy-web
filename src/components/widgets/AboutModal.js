import React from 'react';
import {Button, Modal} from 'antd';
import PropTypes from 'prop-types';
import packageJson from '../../../package.json';


const AboutModal = (props) => {
  return (
    <Modal visible={props.visible} title="About ?" footer={
     [<Button onClick={props.onHide}>Close</Button>]
    }>
      <h4>{packageJson.version}</h4>
      <p>Ah non attention, je ne suis pas un simple danseur car il faut se recréer... pour recréer... a better you et
        c'est très, très beau d'avoir son propre moi-même ! Ça respire le meuble de Provence, hein ?
      </p>
      <p>Tu vois, j'ai vraiment une grande mission car le cycle du cosmos dans la vie... c'est une grande roue et
        c'est très, très beau d'avoir son propre moi-même ! Et tu as envie de le dire au monde entier, including
        yourself.
      </p>
    </Modal>
  );

}

AboutModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default AboutModal;
