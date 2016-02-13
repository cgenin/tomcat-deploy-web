export const ADD_ARTIFACTS = 'ACTIONS:ADD-ARTIFACTS';
export const REMOVE_ARTIFACTS = 'ACTIONS:REMOVE-ARTIFACTS';
export const UPDATE = 'ACTIONS:UPDATE';


export function addArtifacts(artifacts) {
  return {
    type: ADD_ARTIFACTS,
    artifacts
  };
}

export function update(artifacts) {
  return {
    type: UPDATE,
    artifacts
  };
}


export function removeArtifacts(artifacts) {
  return {
    type: REMOVE_ARTIFACTS, artifacts
  };
}