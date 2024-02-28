export default () => {
  let today = new Date();
  let second = String(today.getSeconds()).padStart(2, '0');
  let minute = String(today.getMinutes()).padStart(2, '0');
  let hour = String(today.getHours()).padStart(2, '0');
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '.' + mm + '.' + dd + ' ' + hour + ':' + minute + ':' + second;
  return today
}