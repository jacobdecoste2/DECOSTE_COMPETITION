// ============================================================
// RIVALRY CONFIG — Update these values before deploying
// ============================================================
const SUPABASE_URL = 'https://gphmbgakdsoetjwnmzju.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Co6XrSL9m0Ci3pnhqc74Fg_MV60fWzm';

// ============================================================
// SUPABASE CLIENT
// ============================================================
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// DATE UTILITIES
// ============================================================
function getMondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(monday) {
  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function toISO(date) {
  return date.toISOString().split('T')[0];
}

function isWeekday() {
  const day = new Date().getDay();
  return day >= 1 && day <= 5;
}

function isToday(date) {
  return toISO(date) === toISO(new Date());
}

function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

// ============================================================
// DB HELPERS
// ============================================================
async function getWeekGoals(player, weekStart) {
  const { data } = await db
    .from('weekly_goals')
    .select('*')
    .eq('player', player)
    .eq('week_start', weekStart)
    .single();
  return data;
}

async function setWeekGoals(player, weekStart, goal1, goal2) {
  const { data, error } = await db
    .from('weekly_goals')
    .upsert({ player, week_start: weekStart, goal_1: goal1, goal_2: goal2 }, { onConflict: 'player,week_start' })
    .select()
    .single();
  return { data, error };
}

async function getCheckins(player, weekStart) {
  const { data } = await db
    .from('daily_checkins')
    .select('*')
    .eq('player', player)
    .eq('week_start', weekStart)
    .order('checkin_date');
  return data || [];
}

async function upsertCheckin(player, weekStart, date, goal1Done, goal2Done) {
  const { data, error } = await db
    .from('daily_checkins')
    .upsert({
      player,
      week_start: weekStart,
      checkin_date: date,
      goal_1_done: goal1Done,
      goal_2_done: goal2Done
    }, { onConflict: 'player,checkin_date' })
    .select()
    .single();
  return { data, error };
}

async function getWeeklyResults(limit = 20) {
  const { data } = await db
    .from('weekly_results')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(limit);
  return data || [];
}

async function getAllTimeRecord() {
  const results = await getWeeklyResults(1000);
  const record = { jacob: 0, gabby: 0, tie: 0 };
  results.forEach(r => {
    if (r.winner === 'jacob') record.jacob++;
    else if (r.winner === 'gabby') record.gabby++;
    else record.tie++;
  });
  return record;
}

// Compute winner from checkins (doesn't save — for live display)
function computeWeekScore(checkins) {
  return checkins.reduce((sum, c) => {
    return sum + (c.goal_1_done ? 1 : 0) + (c.goal_2_done ? 1 : 0);
  }, 0);
}

// ============================================================
// UI UTILITIES
// ============================================================
function showToast(msg, duration = 2500) {
  let t = document.getElementById('global-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'global-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function setActive(selector) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const el = document.querySelector(selector);
  if (el) el.classList.add('active');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekRange(mondayStr) {
  const mon = new Date(mondayStr + 'T00:00:00');
  const fri = new Date(mon);
  fri.setDate(fri.getDate() + 4);
  return `${formatDate(mondayStr)} – ${formatDate(toISO(fri))}`;
}
