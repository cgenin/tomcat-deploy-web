export function filtering(list, filter = '') {
  if (!list) {
    return [];
  }
  if (filter === '') {
    return list;
  }
  const term = filter.toUpperCase();
  return list.filter(obj => {
    const arr = Object.values(obj);
    const res = JSON.stringify(arr).toUpperCase();
    return res.indexOf(term) !== -1;
  })
}

export function sortStrBy(attr) {
  return (a, b) => {
    const groupId1 = a[attr];
    const groupId2 = b[attr];
    if (groupId1 < groupId2)
      return -1;
    if (groupId1 > groupId2)
      return 1;
    return 0;
  }
}
