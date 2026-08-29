import eagleAppHomeBanner from '../assets/eagleappheadbanner.png';

export type NewsPublicationChannel = 'published' | 'prototype';

export interface NewsArticleHighlight {
  label: string;
  text: string;
}

export interface NewsArticleSection {
  heading: string;
  paragraphs?: readonly string[];
  highlights?: readonly NewsArticleHighlight[];
}

export interface NewsArticle {
  id: string;
  title: string;
  publishedAt: string | null;
  dateLabel: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: readonly [string, ...string[]];
  sections?: readonly NewsArticleSection[];
  youtubeVideoId?: string;
  publicationChannel: NewsPublicationChannel;
}

const PUBLISHED_NEWS_ARTICLES: readonly NewsArticle[] = [
  {
    id: '2026-volleyball-players-of-the-week-nicolyne-alianna-jason-suhendra',
    title: 'Volleyball Players of the Week: Nicolyne Alianna and Jason Suhendra',
    publishedAt: '2026-08-26',
    dateLabel: 'AUGUST 26, 2026',
    category: 'PLAYER OF THE WEEK',
    excerpt: 'Nicolyne Alianna delivered timely points and strong blocks, while Jason Suhendra closed out KV with seven consecutive aces.',
    image: eagleAppHomeBanner,
    imageAlt: 'SPH Lippo Village Athletics Eagle banner',
    body: [
      'SPH Lippo Village Athletics recognizes Grade 12 student Nicolyne Alianna and Jason Suhendra as this week’s Varsity Volleyball Players of the Week.',
    ],
    sections: [
      {
        heading: 'Nicolyne Alianna, Grade 12 · Opposite Hitter',
        paragraphs: [
          'Nicolyne stepped up this week with strong play and continued improvement. Against Parung Pargung, she finished one set as the team’s top point earner. Her blocking stood out in both the match and training throughout the week.',
        ],
      },
      {
        heading: 'Jason Suhendra · Middle',
        paragraphs: [
          'Jason battled through injury during the opening weeks of the season, but he stood out in the team’s first game at KV. After finding his serving range in the first set, he established the range and trajectory for his powerful topspin jump serve in the second.',
          'Jason closed out the game with seven consecutive aces, ending KV’s hopes of a comeback and delivering a memorable finish for the Eagles.',
        ],
      },
    ],
    publicationChannel: 'published',
  },
  {
    id: '2026-smp-basketball-player-of-the-week-dansen-wijaya',
    title: 'SMP Basketball Player of the Week: Dansen Wijaya',
    publishedAt: '2026-08-26',
    dateLabel: 'AUGUST 26, 2026',
    category: 'PLAYER OF THE WEEK',
    excerpt: 'Grade 9 student Dansen Wijaya sparked a second-half rally against ACS with scoring, rebounding, playmaking, and active defense.',
    image: eagleAppHomeBanner,
    imageAlt: 'SPH Lippo Village Athletics Eagle banner',
    body: [
      'Grade 9 student Dansen Wijaya earned SMP Basketball Player of the Week after an all-around performance against ACS.',
      'With SPH Lippo Village trailing by 15 points, Dansen stepped up on both ends of the floor. His active defense and quick transition play helped cut the deficit to six points late in the fourth quarter. He led the team in scoring on 45% shooting, while also leading the squad in rebounds and assists and adding a steal.',
      'Dansen’s effort and all-around play provided a major lift for the team during its second-half rally.',
    ],
    publicationChannel: 'published',
  },
  {
    id: '2026-soccer-players-of-the-week-troy-biantoro-sherny-lim',
    title: 'Soccer Players of the Week: Troy Biantoro and Sherny Lim',
    publishedAt: '2026-08-23',
    dateLabel: 'AUGUST 23, 2026',
    category: 'PLAYER OF THE WEEK',
    excerpt: 'Troy Mihardja Biantoro and Sherny Lim opened the SMA Soccer season with performances defined by hard work, attacking impact, and commitment to their teammates.',
    image: eagleAppHomeBanner,
    imageAlt: 'SPH Lippo Village Athletics Eagle banner',
    body: [
      'SPH Lippo Village Athletics recognizes Grade 11 student Troy Mihardja Biantoro and sophomore Sherny Lim as this week’s Soccer Players of the Week following the Eagles’ friendly matches against SMK 31.',
    ],
    sections: [
      {
        heading: 'Troy Mihardja Biantoro, Grade 11',
        paragraphs: [
          'This will be Troy’s third year on the SMA Soccer team, and each year he has grown in different areas. This week, he delivered a strong performance on the wing and in midfield. Although he did not score or record an assist, he did everything the coaches asked of him.',
          'Troy worked hard throughout training, asked questions about how to improve, and then implemented that feedback during the friendly match against SMK 31.',
        ],
      },
      {
        heading: 'Sherny Lim, Sophomore',
        paragraphs: [
          'Sherny started the season strongly, scoring four goals and recording two assists in her first game against SMK 31. Playing on the wing, she used her speed to stretch the defense. Her love of dance and natural agility helped her dribble past defenders with confident ball control as she drove toward goal.',
          'She also consistently looked to involve her teammates in the offense, including Grace, a strong new player for SPH Lippo Village.',
        ],
      },
    ],
    publicationChannel: 'published',
  },
  {
    id: '2025-26-sports-banquet-athletes-of-the-year',
    title: 'Top Seniors Honored at Annual Sports Banquet',
    publishedAt: '2026-08-17',
    dateLabel: 'AUGUST 17, 2026',
    category: 'ATHLETE SPOTLIGHT',
    excerpt: 'Seniors Nathan Mann and Shermaine Lim have been named the Grade 10–12 Male and Female Athletes of the Year after exceptional final seasons for the Eagles.',
    image: eagleAppHomeBanner,
    imageAlt: 'SPH Lippo Village Athletics Eagle banner',
    body: [
      'LIPPO VILLAGE — As the 2025–26 sports season comes to a close, the SPH Lippo Village community gathered for the annual Sports Awards Banquet to celebrate our finest athletes. In a night filled with school spirit, seniors Nathan Mann and Shermaine Lim stood out from the crowd, officially taking home the prestigious Grade 10–12 Male and Female Athlete of the Year awards.',
      'Proving they are just as dedicated in the classroom as they are on the court, both Nathan and Shermaine also received the Scholar Athlete Award. Balancing intense ACSC and JAAC training schedules with high academic standards, these two have truly defined what it means to be a student-athlete.',
    ],
    sections: [
      {
        heading: 'Nathan Mann: An Absolute Force on the Court and Field',
        paragraphs: [
          'Winning Grade 10–12 Male Athlete of the Year for the second straight year, Nathan has left a huge legacy at SPH. Whether he was spiking, dunking, or breaking throwing records, he dominated everywhere he played:',
        ],
        highlights: [
          {
            label: 'Varsity Volleyball',
            text: 'Nathan led the Eagles to back-to-back JAAC championships and was named team MVP. At ACSC, he made the All-Conference Team and took home the award for ACSC Best Hitter.',
          },
          {
            label: 'Varsity Basketball',
            text: 'After working countless hours in the weight room before the season started, he led the boys to a JAAC Championship and an ACSC second-place finish in Taiwan. He was named team MVP, made the All-Conference Team, and swept the international awards as ACSC Best Defender and ACSC Best Rebounder.',
          },
          {
            label: 'Track & Field',
            text: 'Nathan won the ACSC Gold Medal in Shot Put and broke the school record.',
          },
          {
            label: 'ACSC Legacy',
            text: 'SPH has won nine individual ACSC awards across the last three years, and Nathan holds five of them. He also wrapped up his high school sports career with 3-Year Participation Awards in both Volleyball and Basketball.',
          },
        ],
      },
      {
        heading: 'Shermaine Lim: SPH’s Five-Sport Standout',
        paragraphs: [
          'Most of us can barely handle balancing one sport with homework, but Shermaine competed across five different sports this year:',
        ],
        highlights: [
          {
            label: 'Varsity Badminton',
            text: 'Shermaine was named Most Valuable Player. She was locked in on every point, including a remarkable reflex save in which she returned an opponent’s smash over the net.',
          },
          {
            label: 'Varsity Volleyball',
            text: 'She brought infectious energy to every practice and match, earning the Most Inspirational Player award while helping the team reach its highest ACSC finish yet.',
          },
          {
            label: 'Varsity Basketball & Soccer',
            text: 'Shermaine played significant minutes at ACSC Basketball to help the team earn fourth place. She also played for ACSC Soccer, helping the squad finish higher than last year and take home the tournament Sportsmanship Award.',
          },
          {
            label: 'Track & Field',
            text: 'She trained and ran for the track team during the regular season as well.',
          },
          {
            label: 'True Dedication',
            text: 'By the end of Grade 12, Shermaine earned 3-Year Participation Awards in four separate sports: Volleyball, Basketball, Soccer, and Badminton.',
          },
        ],
      },
      {
        heading: 'Leaving a Legacy',
        paragraphs: [
          'Both Nathan and Shermaine have set the bar high for what it means to be an SPH Eagle. From dominating conference games to working hard in class and cheering on their teammates, they have shown what dedication and great sportsmanship look like. SPH Athletics will miss them next year.',
          'As they move on to their next chapters, both athletes have exciting plans ahead. Nathan is headed to college in Canada, where he will redshirt for the basketball team. Meanwhile, Shermaine is interning with our PE and Athletics Department, where she will help out and serve as an assistant coach for the girls’ soccer team before heading to Australia for college.',
        ],
      },
    ],
    publicationChannel: 'published',
  },
];

const PROTOTYPE_NEWS_ARTICLES: readonly NewsArticle[] = import.meta.env.VITE_RELEASE_CHANNEL === 'prototype' ? [
  {
    id: 'sample-basketball-overtime',
    title: 'VARSITY BASKETBALL SECURES THRILLING OVERTIME VICTORY',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'GAMEDAY RECAP',
    excerpt: 'Marcus Reed drops 28 points as the Eagles storm back in the fourth quarter to take down JIS...',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample basketball story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
  {
    id: 'sample-girls-soccer-quarterfinals',
    title: 'GIRLS SOCCER ADVANCES TO REGIONAL QUARTERFINALS',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'TEAM NEWS',
    excerpt: 'A dominant 3-1 performance sets up a clash with ACS next Tuesday under the lights.',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample soccer story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
  {
    id: 'sample-track-records',
    title: 'TRACK & FIELD SETS THREE NEW SCHOOL RECORDS AT INVITATIONAL',
    publishedAt: null,
    dateLabel: 'PROTOTYPE SAMPLE',
    category: 'ACHIEVEMENT',
    excerpt: 'The weekend saw historic performances across the sprints and hurdles events from our varsity roster.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Sample track and field story artwork',
    body: [
      'This page demonstrates the in-app article layout. Replace this sample with approved school reporting before publication.',
    ],
    publicationChannel: 'prototype',
  },
] : [];

export const NEWS_ARTICLES: readonly NewsArticle[] = [
  ...PUBLISHED_NEWS_ARTICLES,
  ...PROTOTYPE_NEWS_ARTICLES,
];

export function visibleNewsArticles(isPrototype: boolean): readonly NewsArticle[] {
  return NEWS_ARTICLES.filter((article) => (
    isPrototype
      ? true
      : article.publicationChannel === 'published'
        && Boolean(article.publishedAt)
        && article.body.length > 0
  ));
}
