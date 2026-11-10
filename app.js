const events = [
  { id: 'jazz', name: 'Akşamüstü caz buluşması', category: 'Müzik', city: 'İstanbul', place: 'Kadıköy Sahne', date: '2026-11-14', time: '19.30', icon: '♫', color: 'linear-gradient(135deg,#d9c3b6,#b8c7bd)' },
  { id: 'ceramic', name: 'Birlikte seramik atölyesi', category: 'Sanat', city: 'Ankara', place: 'Atölye 06 · Çankaya', date: '2026-11-16', time: '14.00', icon: '◉', color: 'linear-gradient(135deg,#dec7b1,#d8b19e)' },
  { id: 'film', name: 'Avluda kısa film gecesi', category: 'Sanat', city: 'İzmir', place: 'Tarihi Havagazı Fabrikası', date: '2026-11-18', time: '20.00', icon: '▣', color: 'linear-gradient(135deg,#c9d0c2,#adbcb0)' },
  { id: 'walk', name: 'Sahil boyunca sabah yürüyüşü', category: 'Açık hava', city: 'İstanbul', place: 'Moda İskelesi', date: '2026-11-21', time: '09.00', icon: '☼', color: 'linear-gradient(135deg,#c9d5d1,#ead8bf)' },
  { id: 'tasting', name: 'Mahalle kahvesi tadımı', category: 'Yemek', city: 'İzmir', place: 'Alsancak · Kıbrıs Şehitleri', date: '2026-11-22', time: '11.30', icon: '☕', color: 'linear-gradient(135deg,#d7bba5,#e2d3be)' },
  { id: 'indie', name: 'Bağımsız gruplar canlı', category: 'Müzik', city: 'Ankara', place: 'Milyon Performance Hall', date: '2026-11-27', time: '21.00', icon: '♫', color: 'linear-gradient(135deg,#c7bfd1,#d7b9b2)' },
  { id: 'market', name: 'Üretici pazarı ve piknik', category: 'Yemek', city: 'İstanbul', place: 'KüçükÇiftlik Park', date: '2026-11-29', time: '10.00', icon: '✿', color: 'linear-gradient(135deg,#d7d4ae,#b9c8a9)' },
  { id: 'garden', name: 'Botanik bahçesi keşfi', category: 'Açık hava', city: 'Ankara', place: 'Atatürk Orman Çiftliği', date: '2026-12-02', time: '13.00', icon: '❋', color: 'linear-gradient(135deg,#bdcbb7,#d8d2b8)' },
  { id: 'photo', name: 'Analog fotoğraf yürüyüşü', category: 'Sanat', city: 'İzmir', place: 'Kordon · Cumhuriyet Meydanı', date: '2026-12-05', time: '15.00', icon: '◉', color: 'linear-gradient(135deg,#d2c5b6,#bdc8ca)' }
];
let category = 'Tümü';
let onlySaved = false;
let saved = JSON.parse(localStorage.getItem('birlikte-saved-v1') || '[]');
const $ = selector => document.querySelector(selector);
const dateParts = value => {
  const date = new Date(`${value}T12:00:00`);
  return { month: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(date).replace('.', '').toUpperCase(), day: new Intl.DateTimeFormat('tr-TR', { day: '2-digit' }).format(date) };
};
function render() {
  const query = $('#searchInput').value.trim().toLocaleLowerCase('tr-TR');
  const city = $('#citySelect').value;
  const list = events.filter(event => (category === 'Tümü' || event.category === category) && (city === 'Tümü' || city === event.city) && (!onlySaved || saved.includes(event.id)) && (!query || `${event.name} ${event.place} ${event.city} ${event.category}`.toLocaleLowerCase('tr-TR').includes(query)));
  $('#eventGrid').innerHTML = list.map(event => {
    const date = dateParts(event.date);
    return `<article class="card"><div class="cover" style="background:${event.color}"><div class="date"><b>${date.day}</b>${date.month}</div><span class="icon">${event.icon}</span><button class="save ${saved.includes(event.id) ? 'saved' : ''}" data-save="${event.id}" aria-label="${saved.includes(event.id) ? 'Kaydedilenlerden çıkar' : 'Kaydet'}">${saved.includes(event.id) ? '♥' : '♡'}</button></div><div class="card-body"><span class="category">${event.category}</span><h3>${event.name}</h3><div class="meta"><span>${event.city}</span><span>${event.time}</span></div><div class="place">⌖ &nbsp;${event.place}</div></div></article>`;
  }).join('');
  $('#empty').hidden = list.length !== 0;
  $('#resultsCount').textContent = `${list.length} etkinlik`;
  $('#resultsTitle').textContent = onlySaved ? 'Kaydettiklerin' : 'Yaklaşan etkinlikler';
  $('#savedCount').textContent = saved.length;
  $('#savedToggle').classList.toggle('on', onlySaved);
}
$('#chips').addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  category = button.dataset.category;
  document.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('active', chip === button));
  render();
});
$('#searchInput').addEventListener('input', render);
$('#citySelect').addEventListener('change', render);
$('#savedToggle').addEventListener('click', () => { onlySaved = !onlySaved; render(); });
$('#eventGrid').addEventListener('click', event => {
  const id = event.target.dataset.save;
  if (!id) return;
  saved = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
  localStorage.setItem('birlikte-saved-v1', JSON.stringify(saved));
  render();
});
render();
