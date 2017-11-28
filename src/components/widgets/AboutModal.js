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
        <p>Tu vois, là on voit qu'on a beaucoup à travailler sur nous-mêmes car on est tous capables de donner des
          informations à chacun et cela même si les gens ne le savent pas ! Pour te dire comme on a beaucoup à
          apprendre sur la vie !
        </p>
        <p>Je ne voudrais pas rentrer dans des choses trop dimensionnelles, mais, premièrement, il faut toute la
          splendeur du aware puisque the final conclusion of the spirit is perfection C'est pour ça que j'ai fait des
          films avec des replicants.
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
