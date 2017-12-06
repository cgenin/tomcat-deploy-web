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
