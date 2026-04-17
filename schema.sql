-- Weekly Goals Table
-- Each week both players set 2 goals
CREATE TABLE weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player TEXT NOT NULL CHECK (player IN ('jacob', 'gabby')),
  week_start DATE NOT NULL, -- Always a Monday
  goal_1 TEXT NOT NULL,
  goal_2 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Check-ins (M-F each week)
CREATE TABLE daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player TEXT NOT NULL CHECK (player IN ('jacob', 'gabby')),
  week_start DATE NOT NULL,
  checkin_date DATE NOT NULL,
  goal_1_done BOOLEAN DEFAULT FALSE,
  goal_2_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player, checkin_date)
);

-- Weekly Results (computed at end of week, stored for history)
CREATE TABLE weekly_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  jacob_score INTEGER NOT NULL DEFAULT 0, -- out of 10 (2 goals x 5 days)
  gabby_score INTEGER NOT NULL DEFAULT 0,
  winner TEXT CHECK (winner IN ('jacob', 'gabby', 'tie')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX ON weekly_goals(player, week_start);
CREATE INDEX ON daily_checkins(player, week_start);
CREATE INDEX ON daily_checkins(checkin_date);

-- Enable Row Level Security (open for now, lock down per user later)
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON weekly_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_checkins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON weekly_results FOR ALL USING (true) WITH CHECK (true);
