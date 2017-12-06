import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import ModalFooter from 'react-bootstrap/lib/ModalFooter';
import ModalHeader from 'react-bootstrap/lib/ModalHeader';
import ModalTitle from 'react-bootstrap/lib/ModalTitle';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import packageJson from '../../../package.json';


const AboutModal = (props) => {
  return (
    <Modal {...props} bsSize="small" aria-labelledby="contained-modal-title-sm">
      <ModalHeader closeButton>
        <ModalTitle id="contained-modal-title-sm">About ?</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <h4>{packageJson.version}</h4>
        <p>Ah non attention, je ne suis pas un simple danseur car il faut se recréer... pour recréer... a better you et
          c'est très, très beau d'avoir son propre moi-même ! Ça respire le meuble de Provence, hein ?
        </p>
        <p>Tu vois, j'ai vraiment une grande mission car le cycle du cosmos dans la vie... c'est une grande roue et
          c'est très, très beau d'avoir son propre moi-même ! Et tu as envie de le dire au monde entier, including
          yourself.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );

}

AboutModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default AboutModal;
