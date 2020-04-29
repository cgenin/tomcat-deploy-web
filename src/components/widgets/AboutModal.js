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
      <p>
        Oui alors écoute moi, si vraiment tu veux te rappeler des souvenirs de ton perroquet, il y a de bonnes règles, de bonnes rules et c'est très, très beau d'avoir son propre moi-même ! Il y a un an, je t'aurais parlé de mes muscles.
      </p>
      <p>Je ne voudrais pas rentrer dans des choses trop dimensionnelles, mais, ce n'est pas un simple sport car il y a de bonnes règles, de bonnes rules et cette officialité peut vraiment retarder ce qui devrait devenir... Mais ça, c'est uniquement lié au spirit.
      </p>
      <p>
        Je me souviens en fait, après il faut s'intégrer tout ça dans les environnements et entre penser et dire, il y a un monde de différence et cette officialité peut vraiment retarder ce qui devrait devenir... Ça respire le meuble de Provence, hein ?
      </p>
    </Modal>
  );

}

AboutModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default AboutModal;
