
export const UPDATE = 'VERSIONS:UPDATE';

export function update(data) {
  return {
    type: UPDATE, data
  };
}
