// Simple interactive monthly calendar
(function () {
  const events = [
    { id: 1, date: '2026-06-05', title: 'Beginner Round Dance', time: '7:00 PM', location: 'Community Hall', description: 'An intro class for new dancers.' },
    { id: 2, date: '2026-06-12', title: 'Practice Night', time: '6:30 PM', location: 'Studio A', description: 'Open practice with cuer.' },
    { id: 3, date: '2026-06-20', title: 'Social Dance', time: '8:00 PM', location: 'Downtown Ballroom', description: 'Live music and social dancing.' }
  ];

  const state = {
    now: new Date(),
    year: null,
    month: null // 0-based
  };

  function init() {
    const d = new Date();
    state.year = d.getFullYear();
    state.month = d.getMonth();

    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('eventModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    render();
  }

  function changeMonth(delta) {
    state.month += delta;
    if (state.month < 0) { state.month = 11; state.year -= 1; }
    if (state.month > 11) { state.month = 0; state.year += 1; }
    render();
  }

  function render() {
    const container = document.getElementById('calendar');
    container.innerHTML = '';

    const monthStart = new Date(state.year, state.month, 1);
    const monthName = monthStart.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    document.getElementById('monthLabel').textContent = monthName;

    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dayNames.forEach(dn => {
      const el = document.createElement('div');
      el.className = 'day-header';
      el.textContent = dn;
      container.appendChild(el);
    });

    const firstDow = monthStart.getDay();
    const daysInMonth = new Date(state.year, state.month+1, 0).getDate();

    // previous month filler
    const prevMonthDays = firstDow;
    const prevMonthNum = new Date(state.year, state.month, 0).getDate();
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const dayNum = prevMonthNum - i;
      const cell = makeDayCell(dayNum, true, null);
      container.appendChild(cell);
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(state.year, state.month+1, d);
      const dayEvents = events.filter(ev => ev.date === iso);
      const cell = makeDayCell(d, false, dayEvents);
      container.appendChild(cell);
    }

    // trailing next month filler to complete grid (7 columns)
    const totalCells = 7 + prevMonthDays + daysInMonth; // headers + cells so far
    const remainder = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainder; i++) {
      const cell = makeDayCell(i, true, null);
      container.appendChild(cell);
    }
  }

  function makeDayCell(dayNumber, inactive, dayEvents) {
    const cell = document.createElement('div');
    cell.className = 'day' + (inactive ? ' inactive' : '');
    const num = document.createElement('div');
    num.className = 'date-number';
    num.textContent = dayNumber;
    cell.appendChild(num);

    if (dayEvents && dayEvents.length) {
      dayEvents.forEach(ev => {
        const a = document.createElement('a');
        a.className = 'event-item';
        a.href = '#';
        a.dataset.eventId = ev.id;
        a.innerHTML = `<span class="event-dot"></span>${escapeHtml(ev.title)}`;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          openEventModal(ev);
        });
        cell.appendChild(a);
      });
    }

    return cell;
  }

  function openEventModal(ev) {
    const modal = document.getElementById('eventModal');
    const body = document.getElementById('modalBody');
    body.innerHTML = `<h3>${escapeHtml(ev.title)}</h3>
      <p><strong>Date:</strong> ${escapeHtml(ev.date)}</p>
      <p><strong>Time:</strong> ${escapeHtml(ev.time)}</p>
      <p><strong>Location:</strong> ${escapeHtml(ev.location)}</p>
      <p>${escapeHtml(ev.description)}</p>`;
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.setAttribute('aria-hidden', 'true');
  }

  function toISO(y, m, d) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
