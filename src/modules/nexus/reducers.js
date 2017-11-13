import {RESET, ADD, REMOVE} from './actions';

const defaultState = [];

const filterArtifact = (artifactId, groupId, packaging) => {
  return a => {
    return !(a.artifactId === artifactId && a.groupId === groupId && a.packaging === packaging)
  }
};

export function nexusReducers(state = defaultState, action) {
  switch (action.type) {
    case RESET :
      return [];
    case  ADD : {
      const {artifactId, groupId, packaging, version} = action.nexus;
      const filter = state.filter(filterArtifact(artifactId, groupId, packaging));
      return [...filter, {
        artifactId,
        groupId,
        packaging,
        version
      }];
    }
    case  REMOVE : {
      const {artifactId, groupId, packaging} = action.nexus;
      return state.filter(filterArtifact(artifactId, groupId, packaging));
    }
    default :
      return state;
  }
}
