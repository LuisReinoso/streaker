import fetch from 'node-fetch';

export interface GitHubStats {
  streak: {
    best: number;
    current: number;
    isAtRisk: boolean;
  };
  contributions: {
    best: number;
    total: number;
    current: number;
  };
}

interface GithubCell {
  date: string;
  level: number;
}

const parseContributionCells = (html: string): GithubCell[] => {
  const cellMatches =
    html.match(/data-date="([^"]+)"[^>]+data-level="([^"]+)"/g) || [];
  return cellMatches.map((cell) => ({
    date: cell.match(/data-date="([^"]+)"/)[1],
    level: parseInt(cell.match(/data-level="([^"]+)"/)[1]),
  }));
};

const calculateStreaks = (cells: GithubCell[]) => {
  let currentStreak = 0;
  let bestStreak = 0;
  let currentCount = 0;

  // Calculate current streak (counting backwards from today)
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].level === 0) break;
    currentStreak++;
  }

  // Calculate best streak
  cells.forEach(({ level }) => {
    if (level > 0) {
      currentCount++;
      bestStreak = Math.max(bestStreak, currentCount);
    } else {
      currentCount = 0;
    }
  });

  return { currentStreak, bestStreak };
};

const getTotalContributions = (html: string): number => {
  const match = html.match(/(\d+)\s+contributions?\s+in\s+the\s+last\s+year/);
  return match ? parseInt(match[1]) : 0;
};

export async function fetchStats(username: string): Promise<GitHubStats> {
  if (!username) {
    throw new Error('Username is required');
  }

  try {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const html = await response.text();
    const cells = parseContributionCells(html);

    if (!cells.length) {
      throw new Error('No contribution data found');
    }

    const { currentStreak, bestStreak } = calculateStreaks(cells);
    const totalContributions = getTotalContributions(html);

    // Get today's contributions
    const today = new Date().toISOString().split('T')[0];
    const todayCell = cells.find((cell) => cell.date === today);
    const currentContributions = todayCell?.level ? todayCell.level : 0;

    // Find best daily contribution
    const bestContributions = Math.max(...cells.map((cell) => cell.level));

    return {
      streak: {
        current: currentStreak,
        best: bestStreak,
        isAtRisk: currentStreak > 0 && currentContributions === 0,
      },
      contributions: {
        total: totalContributions,
        current: currentContributions,
        best: bestContributions,
      },
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return {
      streak: { current: 0, best: 0, isAtRisk: false },
      contributions: { total: 0, current: 0, best: 0 },
    };
  }
}
